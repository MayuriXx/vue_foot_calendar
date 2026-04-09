import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import MatchHeader from '../MatchHeader.vue'
import type { Match } from '@/types/football'

const mockMatch: Match = {
  fixture: {
    id: 1,
    referee: 'Referee Name',
    timezone: 'UTC',
    date: '2024-04-09T15:00:00Z',
    timestamp: 1712686800,
    periods: { first: 1200, second: 2400 },
    venue: { id: 1, name: 'Stamford Bridge', city: 'London' },
    status: { long: 'Match Finished', short: 'FT', elapsed: 90 },
  },
  league: {
    id: 39,
    name: 'Premier League',
    country: 'England',
    logo: 'https://example.com/prem.png',
    flag: null,
    season: 2024,
    round: '1',
  },
  teams: {
    home: { id: 1, name: 'Chelsea', logo: 'https://example.com/chelsea.png', winner: true },
    away: { id: 2, name: 'Arsenal', logo: 'https://example.com/arsenal.png', winner: false },
  },
  goals: { home: 2, away: 1 },
  score: {
    halftime: { home: 1, away: 0 },
    fulltime: { home: 2, away: 1 },
    extratime: { home: null, away: null },
    penalty: { home: null, away: null },
  },
} as Match

describe('MatchHeader.vue', () => {
  it('renders match header correctly', () => {
    const wrapper = mount(MatchHeader, {
      props: {
        match: mockMatch,
      },
    })

    expect(wrapper.find('.match-header').exists()).toBe(true)
  })

  it('displays league information', () => {
    const wrapper = mount(MatchHeader, {
      props: {
        match: mockMatch,
      },
    })

    expect(wrapper.text()).toContain('Premier League')
    expect(wrapper.text()).toContain('Match Finished')
  })

  it('displays team names', () => {
    const wrapper = mount(MatchHeader, {
      props: {
        match: mockMatch,
      },
    })

    expect(wrapper.text()).toContain('Chelsea')
    expect(wrapper.text()).toContain('Arsenal')
  })

  it('displays score', () => {
    const wrapper = mount(MatchHeader, {
      props: {
        match: mockMatch,
      },
    })

    expect(wrapper.find('.score').text()).toBe('2 - 1')
  })

  it('displays venue information', () => {
    const wrapper = mount(MatchHeader, {
      props: {
        match: mockMatch,
      },
    })

    expect(wrapper.text()).toContain('Stamford Bridge')
    expect(wrapper.text()).toContain('London')
  })

  it('displays match date', () => {
    const wrapper = mount(MatchHeader, {
      props: {
        match: mockMatch,
      },
    })

    expect(wrapper.find('.date').exists()).toBe(true)
  })

  it('renders league logo', () => {
    const wrapper = mount(MatchHeader, {
      props: {
        match: mockMatch,
      },
    })

    expect(wrapper.find('.league-logo').exists()).toBe(true)
  })

  it('renders team logos', () => {
    const wrapper = mount(MatchHeader, {
      props: {
        match: mockMatch,
      },
    })

    const teamLogos = wrapper.findAll('.team-logo')
    expect(teamLogos.length).toBe(2)
  })

  it('shows dashes for null goals', () => {
    const matchWithoutGoals = {
      ...mockMatch,
      goals: { home: null, away: null },
    }

    const wrapper = mount(MatchHeader, {
      props: {
        match: matchWithoutGoals,
      },
    })

    expect(wrapper.find('.score').text()).toBe('- - -')
  })

  it('does not display venue info when venue name is empty', () => {
    const matchWithoutVenue = {
      ...mockMatch,
      fixture: {
        ...mockMatch.fixture,
        venue: { id: null, name: '', city: '' },
      },
    }

    const wrapper = mount(MatchHeader, {
      props: {
        match: matchWithoutVenue,
      },
    })

    expect(wrapper.find('.venue-info').exists()).toBe(false)
  })
})
