import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useFootball } from '../../composables/useFootball'
import type { Match } from '@/types/football'

// Mock footballService et cacheService
vi.mock('@/services/football.service', () => ({
  default: {
    getTodayMatches: vi.fn(),
    getMatchesByDateRange: vi.fn(),
    getTeamMatches: vi.fn(),
    getLeagueMatches: vi.fn(),
  },
}))

vi.mock('@/services/cache.service', () => ({
  default: {
    get: vi.fn(),
    set: vi.fn(),
  },
}))

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

describe('useFootball', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('initializes with default state', () => {
    const { matches, isLoading, error, fromCache, selectedStatus, selectedCountry, selectedLeague } = useFootball()

    expect(matches.value).toEqual([])
    expect(isLoading.value).toBe(false)
    expect(error.value).toBeNull()
    expect(fromCache.value).toBe(false)
    expect(selectedStatus.value).toBe('all')
    expect(selectedCountry.value).toBe('all')
    expect(selectedLeague.value).toBe('all')
  })

  it('returns empty computed properties when no matches', () => {
    const { upcomingMatches, liveMatches, finishedMatches, matchesByLeague, countries, leagues } = useFootball()

    expect(upcomingMatches.value).toEqual([])
    expect(liveMatches.value).toEqual([])
    expect(finishedMatches.value).toEqual([])
    expect(matchesByLeague.value).toEqual([])
    expect(countries.value).toEqual([])
    expect(leagues.value).toEqual([])
  })

  it('filters upcoming matches correctly', async () => {
    const { matches, upcomingMatches } = useFootball()

    const upcomingMatch = {
      ...mockMatch,
      fixture: { ...mockMatch.fixture, status: { long: 'Not Started', short: 'NS', elapsed: null } },
    }

    matches.value = [upcomingMatch, mockMatch]
    expect(upcomingMatches.value).toHaveLength(1)
    expect(upcomingMatches.value[0].fixture.status.short).toBe('NS')
  })

  it('filters live matches correctly', () => {
    const { matches, liveMatches } = useFootball()

    const liveMatch = {
      ...mockMatch,
      fixture: { ...mockMatch.fixture, status: { long: 'Match Live', short: '1H', elapsed: 45 } },
    }

    matches.value = [liveMatch, mockMatch]
    expect(liveMatches.value).toHaveLength(1)
    expect(liveMatches.value[0].fixture.status.short).toBe('1H')
  })

  it('filters finished matches correctly', () => {
    const { matches, finishedMatches } = useFootball()

    matches.value = [mockMatch]
    expect(finishedMatches.value).toHaveLength(1)
    expect(finishedMatches.value[0].fixture.status.short).toBe('FT')
  })

  it('groups matches by league', () => {
    const { matches, matchesByLeague } = useFootball()

    const match2 = {
      ...mockMatch,
      league: { ...mockMatch.league, id: 140, name: 'La Liga' },
    }

    matches.value = [mockMatch, match2]
    expect(matchesByLeague.value).toHaveLength(2)
  })

  it('extracts unique countries from matches', () => {
    const { matches, countries } = useFootball()

    const matchSpain = {
      ...mockMatch,
      league: { ...mockMatch.league, country: 'Spain' },
    }

    matches.value = [mockMatch, matchSpain]
    expect(countries.value).toContain('England')
    expect(countries.value).toContain('Spain')
    expect(countries.value).toHaveLength(2)
  })

  it('filters by country', () => {
    const { matches, selectedCountry, filteredMatches } = useFootball()

    const matchSpain = {
      ...mockMatch,
      league: { ...mockMatch.league, country: 'Spain' },
    }

    matches.value = [mockMatch, matchSpain]
    selectedCountry.value = 'Spain'

    expect(filteredMatches.value).toHaveLength(1)
    expect(filteredMatches.value[0].league.country).toBe('Spain')
  })

  it('filters by status', () => {
    const { matches, selectedStatus, filteredMatches } = useFootball()

    const liveMatch = {
      ...mockMatch,
      fixture: { ...mockMatch.fixture, status: { long: 'Match Live', short: '1H', elapsed: 45 } },
    }

    matches.value = [mockMatch, liveMatch]
    selectedStatus.value = 'live'

    expect(filteredMatches.value).toHaveLength(1)
    expect(filteredMatches.value[0].fixture.status.short).toBe('1H')
  })

  it('filters by league', () => {
    const { matches, selectedLeague, filteredMatches } = useFootball()

    matches.value = [mockMatch]
    selectedLeague.value = '39|Premier League'

    expect(filteredMatches.value).toHaveLength(1)
    expect(filteredMatches.value[0].league.id).toBe(39)
  })

  it('resets all filters', () => {
    const { selectedStatus, selectedCountry, selectedLeague, resetFilters } = useFootball()

    selectedStatus.value = 'live'
    selectedCountry.value = 'England'
    selectedLeague.value = '39|Premier League'

    resetFilters()

    expect(selectedStatus.value).toBe('all')
    expect(selectedCountry.value).toBe('all')
    expect(selectedLeague.value).toBe('all')
  })

  it('sorts leagues by priority', () => {
    const { matches, matchesByLeague } = useFootball()

    const ligue1Match = {
      ...mockMatch,
      league: { ...mockMatch.league, id: 61, name: 'Ligue 1', country: 'France' },
    }

    const premierLeagueMatch = {
      ...mockMatch,
      league: { ...mockMatch.league, id: 39, name: 'Premier League', country: 'England' },
    }

    matches.value = [ligue1Match, premierLeagueMatch]
    
    // Premier League (id: 39, priority: 1) should come before Ligue 1 (id: 61, priority: 4)
    expect(matchesByLeague.value[0].id).toBe(39)
    expect(matchesByLeague.value[1].id).toBe(61)
  })

  it('generates correct league string format', () => {
    const { matches, leagues } = useFootball()

    matches.value = [mockMatch]
    expect(leagues.value).toContain('39|Premier League')
  })

  it('handles combined filters', () => {
    const { matches, selectedCountry, selectedStatus, filteredMatches } = useFootball()

    const liveMatch = {
      ...mockMatch,
      fixture: { ...mockMatch.fixture, status: { long: 'Match Live', short: '1H', elapsed: 45 } },
    }

    matches.value = [mockMatch, liveMatch]
    selectedCountry.value = 'England'
    selectedStatus.value = 'live'

    expect(filteredMatches.value).toHaveLength(1)
    expect(filteredMatches.value[0].fixture.status.short).toBe('1H')
  })

  it('categorizes matches correctly in matchesByLeague', () => {
    const { matches, matchesByLeague } = useFootball()

    const liveMatch = {
      ...mockMatch,
      fixture: { ...mockMatch.fixture, status: { long: 'Match Live', short: '1H', elapsed: 45 } },
    }

    const upcomingMatch = {
      ...mockMatch,
      fixture: { ...mockMatch.fixture, status: { long: 'Not Started', short: 'NS', elapsed: null } },
    }

    matches.value = [liveMatch, upcomingMatch, mockMatch]

    expect(matchesByLeague.value).toHaveLength(1)
    expect(matchesByLeague.value[0].live).toHaveLength(1)
    expect(matchesByLeague.value[0].upcoming).toHaveLength(1)
    expect(matchesByLeague.value[0].finished).toHaveLength(1)
  })
})
