import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import StandingsSection from '../StandingsSection.vue'
import type { Standing } from '@/types/football'

const mockStandings: Standing[] = [
  {
    rank: 1,
    team: { id: 1, name: 'Team A', logo: 'https://example.com/a.png' },
    points: 30,
    goalsDiff: 15,
    all: { played: 10, win: 8, draw: 2, lose: 0 },
  },
  {
    rank: 2,
    team: { id: 2, name: 'Team B', logo: 'https://example.com/b.png' },
    points: 27,
    goalsDiff: 10,
    all: { played: 10, win: 8, draw: 1, lose: 1 },
  },
] as Standing[]

describe('StandingsSection.vue', () => {
  it('renders standings section', () => {
    const wrapper = mount(StandingsSection, {
      props: {
        standings: mockStandings,
        homeTeamId: 1,
        awayTeamId: 2,
        leagueName: 'Premier League',
      },
    })

    expect(wrapper.find('.standings-section').exists()).toBe(true)
  })

  it('displays standings title', () => {
    const wrapper = mount(StandingsSection, {
      props: {
        standings: mockStandings,
        homeTeamId: 1,
        awayTeamId: 2,
        leagueName: 'Premier League',
      },
    })

    expect(wrapper.text()).toContain('Classement')
  })

  it('displays league name', () => {
    const wrapper = mount(StandingsSection, {
      props: {
        standings: mockStandings,
        homeTeamId: 1,
        awayTeamId: 2,
        leagueName: 'Premier League',
      },
    })

    expect(wrapper.text()).toContain('Premier League')
  })

  it('renders standings table header', () => {
    const wrapper = mount(StandingsSection, {
      props: {
        standings: mockStandings,
        homeTeamId: 1,
        awayTeamId: 2,
        leagueName: 'Premier League',
      },
    })

    expect(wrapper.find('.standings-header').exists()).toBe(true)
    expect(wrapper.text()).toContain('Pos')
    expect(wrapper.text()).toContain('Équipe')
    expect(wrapper.text()).toContain('J')
    expect(wrapper.text()).toContain('Pts')
  })

  it('renders all standings rows', () => {
    const wrapper = mount(StandingsSection, {
      props: {
        standings: mockStandings,
        homeTeamId: 1,
        awayTeamId: 2,
        leagueName: 'Premier League',
      },
    })

    const standingRows = wrapper.findAll('.standing-row')
    expect(standingRows.length).toBe(2)
  })

  it('displays team information correctly', () => {
    const wrapper = mount(StandingsSection, {
      props: {
        standings: mockStandings,
        homeTeamId: 1,
        awayTeamId: 2,
        leagueName: 'Premier League',
      },
    })

    expect(wrapper.text()).toContain('Team A')
    expect(wrapper.text()).toContain('Team B')
  })

  it('displays team rankings', () => {
    const wrapper = mount(StandingsSection, {
      props: {
        standings: mockStandings,
        homeTeamId: 1,
        awayTeamId: 2,
        leagueName: 'Premier League',
      },
    })

    expect(wrapper.text()).toContain('1')
    expect(wrapper.text()).toContain('2')
  })

  it('displays team statistics', () => {
    const wrapper = mount(StandingsSection, {
      props: {
        standings: mockStandings,
        homeTeamId: 1,
        awayTeamId: 2,
        leagueName: 'Premier League',
      },
    })

    // Games played
    expect(wrapper.text()).toContain('10')
    // Wins (8)
    expect(wrapper.text()).toContain('8')
    // Points
    expect(wrapper.text()).toContain('30')
    expect(wrapper.text()).toContain('27')
  })

  it('applies home team highlight class', () => {
    const wrapper = mount(StandingsSection, {
      props: {
        standings: mockStandings,
        homeTeamId: 1,
        awayTeamId: 2,
        leagueName: 'Premier League',
      },
    })

    const rows = wrapper.findAll('.standing-row')
    expect(rows[0].classes()).toContain('home-highlight')
  })

  it('applies away team highlight class', () => {
    const wrapper = mount(StandingsSection, {
      props: {
        standings: mockStandings,
        homeTeamId: 1,
        awayTeamId: 2,
        leagueName: 'Premier League',
      },
    })

    const rows = wrapper.findAll('.standing-row')
    expect(rows[1].classes()).toContain('away-highlight')
  })

  it('displays goals difference with sign', () => {
    const wrapper = mount(StandingsSection, {
      props: {
        standings: mockStandings,
        homeTeamId: 1,
        awayTeamId: 2,
        leagueName: 'Premier League',
      },
    })

    expect(wrapper.text()).toContain('+15')
    expect(wrapper.text()).toContain('+10')
  })

  it('handles negative goals difference', () => {
    const standingsWithNegativeDiff = [
      {
        ...mockStandings[0],
        goalsDiff: -5,
      },
    ] as Standing[]

    const wrapper = mount(StandingsSection, {
      props: {
        standings: standingsWithNegativeDiff,
        homeTeamId: 1,
        awayTeamId: 2,
        leagueName: 'Premier League',
      },
    })

    expect(wrapper.text()).toContain('-5')
  })
})
