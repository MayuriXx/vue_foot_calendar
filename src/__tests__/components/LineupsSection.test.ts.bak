import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import LineupsSection from '../LineupsSection.vue'
import TeamLineup from '../TeamLineup.vue'
import type { MatchLineup } from '@/types/football'

const mockLineup: MatchLineup = {
  team: {
    id: 1,
    name: 'Team A',
    logo: 'https://example.com/logo.png',
  },
  formation: '4-3-3',
  startXI: [
    {
      player: { id: 1, name: 'Player 1', number: 1, pos: 'G' },
    },
  ],
  substitutes: [
    {
      player: { id: 12, name: 'Player 12', number: 12, pos: 'G' },
    },
  ],
} as MatchLineup

describe('LineupsSection.vue', () => {
  it('does not render when lineups are empty', () => {
    const wrapper = mount(LineupsSection, {
      props: {
        lineups: [],
      },
      global: {
        components: {
          TeamLineup,
        },
      },
    })

    expect(wrapper.find('.lineups-section').exists()).toBe(false)
  })

  it('renders lineups section when lineups exist', () => {
    const wrapper = mount(LineupsSection, {
      props: {
        lineups: [mockLineup],
      },
      global: {
        components: {
          TeamLineup,
        },
      },
    })

    expect(wrapper.find('.lineups-section').exists()).toBe(true)
  })

  it('displays formations title', () => {
    const wrapper = mount(LineupsSection, {
      props: {
        lineups: [mockLineup],
      },
      global: {
        components: {
          TeamLineup,
        },
      },
    })

    expect(wrapper.text()).toContain('Formations')
  })

  it('renders team lineup components', () => {
    const wrapper = mount(LineupsSection, {
      props: {
        lineups: [mockLineup],
      },
      global: {
        components: {
          TeamLineup,
        },
      },
    })

    const teamLineups = wrapper.findAllComponents(TeamLineup)
    expect(teamLineups.length).toBe(1)
  })

  it('passes correct props to TeamLineup', () => {
    const wrapper = mount(LineupsSection, {
      props: {
        lineups: [mockLineup],
      },
      global: {
        components: {
          TeamLineup,
        },
      },
    })

    const teamLineup = wrapper.findComponent(TeamLineup)
    expect(teamLineup.props('lineup')).toEqual(mockLineup)
  })

  it('renders both team lineups in grid', () => {
    const mockLineup2 = {
      ...mockLineup,
      team: { id: 2, name: 'Team B', logo: 'https://example.com/logo2.png' },
    }

    const wrapper = mount(LineupsSection, {
      props: {
        lineups: [mockLineup, mockLineup2],
      },
      global: {
        components: {
          TeamLineup,
        },
      },
    })

    const teamLineups = wrapper.findAllComponents(TeamLineup)
    expect(teamLineups.length).toBe(2)
    expect(wrapper.find('.lineups-grid').exists()).toBe(true)
  })
})
