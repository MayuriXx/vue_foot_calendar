import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useMatchDetail } from '../../composables/useMatchDetail'
import type { Match, MatchStatistics, MatchEvent, MatchLineup, Standing } from '@/types/football'

// Mock footballService et cacheService
vi.mock('@/services/football.service', () => ({
  default: {
    getMatchById: vi.fn(),
    getMatchStatistics: vi.fn(),
    getMatchEvents: vi.fn(),
    getMatchLineups: vi.fn(),
    getStandings: vi.fn(),
  },
}))

vi.mock('@/services/cache.service', () => ({
  default: {
    get: vi.fn(),
    set: vi.fn(),
  },
}))

import footballService from '@/services/football.service'
import cacheService from '@/services/cache.service'

const mockMatch: Match = {
  fixture: {
    id: 1,
    referee: 'Referee',
    timezone: 'UTC',
    date: '2024-04-09T15:00:00Z',
    timestamp: 1712686800,
    periods: { first: 1200, second: 2400 },
    venue: { id: 1, name: 'Stadium', city: 'City' },
    status: { long: 'Match Finished', short: 'FT', elapsed: 90 },
  },
  league: {
    id: 39,
    name: 'Premier League',
    country: 'England',
    logo: 'https://example.com/logo.png',
    flag: null,
    season: 2024,
    round: '1',
  },
  teams: {
    home: { id: 1, name: 'Team A', logo: 'https://example.com/a.png', winner: true },
    away: { id: 2, name: 'Team B', logo: 'https://example.com/b.png', winner: false },
  },
  goals: { home: 2, away: 1 },
  score: {
    halftime: { home: 1, away: 0 },
    fulltime: { home: 2, away: 1 },
    extratime: { home: null, away: null },
    penalty: { home: null, away: null },
  },
} as Match

const mockStatistics: MatchStatistics[] = [
  {
    team: { id: 1, name: 'Team A', logo: 'https://example.com/a.png' },
    statistics: [
      { type: 'Shots', value: 10 },
      { type: 'Possession', value: '55%' },
    ],
  },
] as MatchStatistics[]

const mockEvents: MatchEvent[] = [
  {
    time: { elapsed: 45, extra: null },
    type: 'Goal',
    detail: 'Normal Goal',
    comments: null,
    player: { id: 1, name: 'Player 1' },
    team: { id: 1, name: 'Team A', logo: 'https://example.com/a.png' },
  },
] as MatchEvent[]

const mockLineups: MatchLineup[] = [
  {
    team: { id: 1, name: 'Team A', logo: 'https://example.com/a.png', formation: '4-3-3' },
    coach: { id: 1, name: 'Coach Name' },
    startXI: [],
    substitutes: [],
  },
] as MatchLineup[]

const mockStandings: Standing[] = [
  {
    rank: 1,
    team: { id: 1, name: 'Team A', logo: 'https://example.com/a.png' },
    points: 30,
    goalsDiff: 15,
    all: { played: 10, win: 8, draw: 2, lose: 0 },
  },
] as Standing[]

describe('useMatchDetail', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('initializes with default state', () => {
    const { match, statistics, events, lineups, standings, isLoading, error, isLoadingStandings, standingsError } =
      useMatchDetail(1)

    expect(match.value).toBeNull()
    expect(statistics.value).toEqual([])
    expect(events.value).toEqual([])
    expect(lineups.value).toEqual([])
    expect(standings.value).toEqual([])
    expect(isLoading.value).toBe(false)
    expect(error.value).toBeNull()
    expect(isLoadingStandings.value).toBe(false)
    expect(standingsError.value).toBeNull()
  })

  it('loads match details successfully', async () => {
    const mockGetMatchById = vi.fn().mockResolvedValue(mockMatch)
    const mockGetStats = vi.fn().mockResolvedValue(mockStatistics)
    const mockGetEvents = vi.fn().mockResolvedValue(mockEvents)
    const mockGetLineups = vi.fn().mockResolvedValue(mockLineups)

    vi.mocked(footballService.getMatchById).mockImplementation(mockGetMatchById)
    vi.mocked(footballService.getMatchStatistics).mockImplementation(mockGetStats)
    vi.mocked(footballService.getMatchEvents).mockImplementation(mockGetEvents)
    vi.mocked(footballService.getMatchLineups).mockImplementation(mockGetLineups)

    const { match, statistics, events, lineups, loadMatchDetails } = useMatchDetail(1)

    await loadMatchDetails()

    expect(match.value).toEqual(mockMatch)
    expect(statistics.value).toEqual(mockStatistics)
    expect(events.value).toEqual(mockEvents)
    expect(lineups.value).toEqual(mockLineups)
  })

  it('sets loading state during load', async () => {
    const mockGetMatchById = vi.fn().mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve(mockMatch), 100))
    )

    vi.mocked(footballService.getMatchById).mockImplementation(mockGetMatchById)
    vi.mocked(footballService.getMatchStatistics).mockResolvedValue([])
    vi.mocked(footballService.getMatchEvents).mockResolvedValue([])
    vi.mocked(footballService.getMatchLineups).mockResolvedValue([])

    const { isLoading, loadMatchDetails } = useMatchDetail(1)

    expect(isLoading.value).toBe(false)

    const promise = loadMatchDetails()
    expect(isLoading.value).toBe(true)

    await promise
  })

  it('handles error during load', async () => {
    const errorMessage = 'API Error'
    vi.mocked(footballService.getMatchById).mockRejectedValue(new Error(errorMessage))
    vi.mocked(footballService.getMatchStatistics).mockResolvedValue([])
    vi.mocked(footballService.getMatchEvents).mockResolvedValue([])
    vi.mocked(footballService.getMatchLineups).mockResolvedValue([])

    const { error, loadMatchDetails } = useMatchDetail(1)

    await loadMatchDetails()

    expect(error.value).toBe(errorMessage)
  })

  it('sets error when match not found', async () => {
    vi.mocked(footballService.getMatchById).mockResolvedValue(null)

    const { error, loadMatchDetails } = useMatchDetail(999)

    await loadMatchDetails()

    expect(error.value).toBe('Match not found')
  })

  it('loads standings successfully', async () => {
    vi.mocked(footballService.getMatchById).mockResolvedValue(mockMatch)
    vi.mocked(footballService.getMatchStatistics).mockResolvedValue([])
    vi.mocked(footballService.getMatchEvents).mockResolvedValue([])
    vi.mocked(footballService.getMatchLineups).mockResolvedValue([])
    vi.mocked(footballService.getStandings).mockResolvedValue([mockStandings])
    vi.mocked(cacheService.get).mockReturnValue(null)

    const { standings, loadMatchDetails, loadStandings } = useMatchDetail(1)

    await loadMatchDetails()
    await loadStandings()

    expect(standings.value).toEqual(mockStandings)
  })

  it('uses cached standings when available', async () => {
    vi.mocked(footballService.getMatchById).mockResolvedValue(mockMatch)
    vi.mocked(footballService.getMatchStatistics).mockResolvedValue([])
    vi.mocked(footballService.getMatchEvents).mockResolvedValue([])
    vi.mocked(footballService.getMatchLineups).mockResolvedValue([])
    vi.mocked(cacheService.get).mockReturnValue(mockStandings)

    const { standings, loadMatchDetails, loadStandings } = useMatchDetail(1)

    await loadMatchDetails()
    await loadStandings()

    expect(standings.value).toEqual(mockStandings)
    expect(vi.mocked(footballService.getStandings)).not.toHaveBeenCalled()
  })

  it('loads standings only once', async () => {
    vi.mocked(footballService.getMatchById).mockResolvedValue(mockMatch)
    vi.mocked(footballService.getMatchStatistics).mockResolvedValue([])
    vi.mocked(footballService.getMatchEvents).mockResolvedValue([])
    vi.mocked(footballService.getMatchLineups).mockResolvedValue([])
    vi.mocked(footballService.getStandings).mockResolvedValue([mockStandings])
    vi.mocked(cacheService.get).mockReturnValue(null)

    const { loadMatchDetails, loadStandings } = useMatchDetail(1)

    await loadMatchDetails()
    await loadStandings()
    await loadStandings() // Second call

    // Should only be called once
    expect(vi.mocked(footballService.getStandings)).toHaveBeenCalledTimes(1)
  })

  it('handles standings error', async () => {
    vi.mocked(footballService.getMatchById).mockResolvedValue(mockMatch)
    vi.mocked(footballService.getMatchStatistics).mockResolvedValue([])
    vi.mocked(footballService.getMatchEvents).mockResolvedValue([])
    vi.mocked(footballService.getMatchLineups).mockResolvedValue([])
    vi.mocked(footballService.getStandings).mockRejectedValue(new Error('Standings API Error'))
    vi.mocked(cacheService.get).mockReturnValue(null)

    const { standingsError, loadMatchDetails, loadStandings } = useMatchDetail(1)

    await loadMatchDetails()
    await loadStandings()

    expect(standingsError.value).toBe('Standings API Error')
  })

  it('sets loading states correctly', async () => {
    vi.mocked(footballService.getMatchById).mockResolvedValue(mockMatch)
    vi.mocked(footballService.getMatchStatistics).mockResolvedValue([])
    vi.mocked(footballService.getMatchEvents).mockResolvedValue([])
    vi.mocked(footballService.getMatchLineups).mockResolvedValue([])

    const { isLoading, loadMatchDetails } = useMatchDetail(1)

    expect(isLoading.value).toBe(false)

    const promise = loadMatchDetails()
    expect(isLoading.value).toBe(true)

    await promise
    expect(isLoading.value).toBe(false)
  })

  it('loads all match details in parallel', async () => {
    let callOrder: string[] = []

    vi.mocked(footballService.getMatchById).mockImplementation(async () => {
      callOrder.push('match')
      return mockMatch
    })

    vi.mocked(footballService.getMatchStatistics).mockImplementation(async () => {
      callOrder.push('statistics')
      return mockStatistics
    })

    vi.mocked(footballService.getMatchEvents).mockImplementation(async () => {
      callOrder.push('events')
      return mockEvents
    })

    vi.mocked(footballService.getMatchLineups).mockImplementation(async () => {
      callOrder.push('lineups')
      return mockLineups
    })

    const { loadMatchDetails } = useMatchDetail(1)
    await loadMatchDetails()

    // All should be called
    expect(callOrder).toContain('match')
    expect(callOrder).toContain('statistics')
    expect(callOrder).toContain('events')
    expect(callOrder).toContain('lineups')
  })

  it('handles empty standings array response', async () => {
    vi.mocked(footballService.getMatchById).mockResolvedValue(mockMatch)
    vi.mocked(footballService.getMatchStatistics).mockResolvedValue([])
    vi.mocked(footballService.getMatchEvents).mockResolvedValue([])
    vi.mocked(footballService.getMatchLineups).mockResolvedValue([])
    vi.mocked(footballService.getStandings).mockResolvedValue([[]])
    vi.mocked(cacheService.get).mockReturnValue(null)

    const { standingsError, loadMatchDetails, loadStandings } = useMatchDetail(1)

    await loadMatchDetails()
    await loadStandings()

    expect(standingsError.value).toBe('Classement non disponible pour cette ligue')
  })
})
