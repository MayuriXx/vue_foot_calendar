import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import MatchCard from '../../components/MatchCard.vue'
import type { Match } from '@/types/football'

const mockMatch: Match = {
  fixture: {
    id: 1,
    referee: 'Referee Name',
    timezone: 'UTC',
    date: '2024-04-09T15:00:00Z',
    timestamp: 1712686800,
    periods: {
      first: 1200,
      second: 2400,
    },
    venue: {
      id: 1,
      name: 'Stadium Name',
      city: 'City',
    },
    status: {
      long: 'Match Finished',
      short: 'FT',
      elapsed: 90,
    },
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
    home: {
      id: 1,
      name: 'Team A',
      logo: 'https://example.com/team-a.png',
      winner: true,
    },
    away: {
      id: 2,
      name: 'Team B',
      logo: 'https://example.com/team-b.png',
      winner: false,
    },
  },
  goals: {
    home: 2,
    away: 1,
  },
  score: {
    halftime: { home: 1, away: 0 },
    fulltime: { home: 2, away: 1 },
    extratime: { home: null, away: null },
    penalty: { home: null, away: null },
  },
} as Match

describe('MatchCard.vue', () => {
  it('renders match card with correct information', () => {
    const wrapper = mount(MatchCard, {
      props: {
        match: mockMatch,
      },
    })

    expect(wrapper.find('.match-card').exists()).toBe(true)
    expect(wrapper.text()).toContain('Premier League')
    expect(wrapper.text()).toContain('Team A')
    expect(wrapper.text()).toContain('Team B')
  })

  it('displays score for finished match', () => {
    const wrapper = mount(MatchCard, {
      props: {
        match: mockMatch,
        isPastMatch: true,
      },
    })

    expect(wrapper.text()).toContain('2 - 1')
  })

  it('displays "vs" for upcoming match', () => {
    const upcomingMatch = {
      ...mockMatch,
      fixture: {
        ...mockMatch.fixture,
        status: {
          long: 'Not Started',
          short: 'NS',
          elapsed: null,
        },
      },
    }

    const wrapper = mount(MatchCard, {
      props: {
        match: upcomingMatch,
      },
    })

    expect(wrapper.text()).toContain('vs')
  })

  it('shows live badge for live match', () => {
    const wrapper = mount(MatchCard, {
      props: {
        match: mockMatch,
        isLiveMatch: true,
      },
    })

    expect(wrapper.text()).toContain('EN DIRECT')
    expect(wrapper.find('.status-badge.live').exists()).toBe(true)
  })

  it('applies live class when isLiveMatch is true', () => {
    const wrapper = mount(MatchCard, {
      props: {
        match: mockMatch,
        isLiveMatch: true,
      },
    })

    expect(wrapper.find('.match-card.live').exists()).toBe(true)
  })

  it('applies finished class when isPastMatch is true', () => {
    const wrapper = mount(MatchCard, {
      props: {
        match: mockMatch,
        isPastMatch: true,
      },
    })

    expect(wrapper.find('.match-card.finished').exists()).toBe(true)
  })

  it('emits click event when card is clicked', async () => {
    const wrapper = mount(MatchCard, {
      props: {
        match: mockMatch,
      },
    })

    await wrapper.find('.match-card').trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  it('renders team logos', () => {
    const wrapper = mount(MatchCard, {
      props: {
        match: mockMatch,
      },
    })

    const logos = wrapper.findAll('.team-logo')
    expect(logos.length).toBe(2)
  })

  it('renders league logo', () => {
    const wrapper = mount(MatchCard, {
      props: {
        match: mockMatch,
      },
    })

    expect(wrapper.find('.league-logo').exists()).toBe(true)
  })
})
