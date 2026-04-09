import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ScoresSection from '../ScoresSection.vue'
import type { Match } from '@/types/football'

const mockMatch: Match = {
  fixture: {
    id: 1,
    referee: 'Referee Name',
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

describe('ScoresSection.vue', () => {
  it('does not render when halftime score is null', () => {
    const matchWithoutScores = {
      ...mockMatch,
      score: {
        halftime: { home: null, away: null },
        fulltime: { home: null, away: null },
        extratime: { home: null, away: null },
        penalty: { home: null, away: null },
      },
    }

    const wrapper = mount(ScoresSection, {
      props: {
        match: matchWithoutScores,
      },
    })

    expect(wrapper.find('.scores-section').exists()).toBe(false)
  })

  it('renders scores section when halftime score exists', () => {
    const wrapper = mount(ScoresSection, {
      props: {
        match: mockMatch,
      },
    })

    expect(wrapper.find('.scores-section').exists()).toBe(true)
  })

  it('displays halftime score', () => {
    const wrapper = mount(ScoresSection, {
      props: {
        match: mockMatch,
      },
    })

    expect(wrapper.text()).toContain('Mi-temps')
    expect(wrapper.text()).toContain('1 - 0')
  })

  it('displays fulltime score', () => {
    const wrapper = mount(ScoresSection, {
      props: {
        match: mockMatch,
      },
    })

    expect(wrapper.text()).toContain('Temps réglementaire')
    expect(wrapper.text()).toContain('2 - 1')
  })

  it('displays extratime score when available', () => {
    const matchWithExtraTime = {
      ...mockMatch,
      score: {
        ...mockMatch.score,
        extratime: { home: 2, away: 2 },
      },
    }

    const wrapper = mount(ScoresSection, {
      props: {
        match: matchWithExtraTime,
      },
    })

    expect(wrapper.text()).toContain('Prolongations')
    expect(wrapper.text()).toContain('2 - 2')
  })

  it('displays penalty score when available', () => {
    const matchWithPenalties = {
      ...mockMatch,
      score: {
        ...mockMatch.score,
        penalty: { home: 3, away: 2 },
      },
    }

    const wrapper = mount(ScoresSection, {
      props: {
        match: matchWithPenalties,
      },
    })

    expect(wrapper.text()).toContain('TAB')
    expect(wrapper.text()).toContain('3 - 2')
  })

  it('does not display extratime when it is null', () => {
    const wrapper = mount(ScoresSection, {
      props: {
        match: mockMatch,
      },
    })

    expect(wrapper.text()).not.toContain('Prolongations')
  })

  it('does not display penalty when it is null', () => {
    const wrapper = mount(ScoresSection, {
      props: {
        match: mockMatch,
      },
    })

    expect(wrapper.text()).not.toContain('TAB')
  })

  it('renders correct number of score rows', () => {
    const wrapper = mount(ScoresSection, {
      props: {
        match: mockMatch,
      },
    })

    const scoreRows = wrapper.findAll('.score-row')
    expect(scoreRows.length).toBe(2) // halftime + fulltime
  })
})
