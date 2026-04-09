import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import StatisticsSection from '../StatisticsSection.vue'
import type { MatchStatistics } from '@/types/football'

const mockStatistics: MatchStatistics[] = [
  {
    team: {
      id: 1,
      name: 'Team A',
      logo: 'https://example.com/a.png',
    },
    statistics: [
      { type: 'Shots on Goal', value: 8 },
      { type: 'Shots off Goal', value: 5 },
      { type: 'Possession', value: '55%' },
    ],
  },
  {
    team: {
      id: 2,
      name: 'Team B',
      logo: 'https://example.com/b.png',
    },
    statistics: [
      { type: 'Shots on Goal', value: 6 },
      { type: 'Shots off Goal', value: 3 },
      { type: 'Possession', value: '45%' },
    ],
  },
] as MatchStatistics[]

describe('StatisticsSection.vue', () => {
  it('does not render when statistics are empty', () => {
    const wrapper = mount(StatisticsSection, {
      props: {
        statistics: [],
      },
    })

    expect(wrapper.find('.statistics-section').exists()).toBe(false)
  })

  it('renders statistics section when statistics exist', () => {
    const wrapper = mount(StatisticsSection, {
      props: {
        statistics: mockStatistics,
      },
    })

    expect(wrapper.find('.statistics-section').exists()).toBe(true)
  })

  it('displays statistics title', () => {
    const wrapper = mount(StatisticsSection, {
      props: {
        statistics: mockStatistics,
      },
    })

    expect(wrapper.text()).toContain('Statistiques')
  })

  it('displays team names in statistics', () => {
    const wrapper = mount(StatisticsSection, {
      props: {
        statistics: mockStatistics,
      },
    })

    expect(wrapper.text()).toContain('Team A')
    expect(wrapper.text()).toContain('Team B')
  })

  it('renders team statistics correctly', () => {
    const wrapper = mount(StatisticsSection, {
      props: {
        statistics: mockStatistics,
      },
    })

    const teamStats = wrapper.findAll('.team-stats')
    expect(teamStats.length).toBe(2)
  })

  it('displays all statistics items', () => {
    const wrapper = mount(StatisticsSection, {
      props: {
        statistics: mockStatistics,
      },
    })

    expect(wrapper.text()).toContain('Shots on Goal')
    expect(wrapper.text()).toContain('Shots off Goal')
    expect(wrapper.text()).toContain('Possession')
  })

  it('displays statistics values', () => {
    const wrapper = mount(StatisticsSection, {
      props: {
        statistics: mockStatistics,
      },
    })

    expect(wrapper.text()).toContain('8')
    expect(wrapper.text()).toContain('5')
    expect(wrapper.text()).toContain('55%')
    expect(wrapper.text()).toContain('6')
    expect(wrapper.text()).toContain('3')
    expect(wrapper.text()).toContain('45%')
  })

  it('renders correct number of stat items', () => {
    const wrapper = mount(StatisticsSection, {
      props: {
        statistics: mockStatistics,
      },
    })

    const statItems = wrapper.findAll('.stat-item')
    expect(statItems.length).toBe(6) // 3 stats per team * 2 teams
  })

  it('formats statistics in grid layout', () => {
    const wrapper = mount(StatisticsSection, {
      props: {
        statistics: mockStatistics,
      },
    })

    expect(wrapper.find('.stats-grid').exists()).toBe(true)
  })

  it('handles single team statistics', () => {
    const singleTeamStats = [mockStatistics[0]]

    const wrapper = mount(StatisticsSection, {
      props: {
        statistics: singleTeamStats,
      },
    })

    const teamStats = wrapper.findAll('.team-stats')
    expect(teamStats.length).toBe(1)
  })
})
