import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TeamLineup from '../../components/TeamLineup.vue'
import PlayersList from '../../components/PlayersList.vue'
import type { MatchLineup } from '@/types/football'

const mockLineup: MatchLineup = {
  team: {
    id: 1,
    name: 'Chelsea',
    logo: 'https://example.com/chelsea.png',
    formation: '4-3-3',
  },
  coach: {
    id: 1,
    name: 'Coach Name',
  },
  formation: '4-3-3',
  startXI: [
    { player: { id: 1, name: 'Keeper', number: 1, pos: 'G' } },
    { player: { id: 2, name: 'Defender 1', number: 2, pos: 'D' } },
    { player: { id: 3, name: 'Defender 2', number: 3, pos: 'D' } },
    { player: { id: 4, name: 'Midfielder 1', number: 4, pos: 'M' } },
    { player: { id: 5, name: 'Midfielder 2', number: 5, pos: 'M' } },
    { player: { id: 6, name: 'Forward', number: 9, pos: 'F' } },
  ],
  substitutes: [
    { player: { id: 12, name: 'Substitute Keeper', number: 12, pos: 'G' } },
    { player: { id: 13, name: 'Substitute Defender', number: 13, pos: 'D' } },
  ],
} as MatchLineup

describe('TeamLineup.vue', () => {
  it('renders team lineup container', () => {
    const wrapper = mount(TeamLineup, {
      props: {
        lineup: mockLineup,
      },
      global: {
        components: {
          PlayersList,
        },
      },
    })

    expect(wrapper.find('.team-lineup').exists()).toBe(true)
  })

  it('displays team logo', () => {
    const wrapper = mount(TeamLineup, {
      props: {
        lineup: mockLineup,
      },
      global: {
        components: {
          PlayersList,
        },
      },
    })

    expect(wrapper.find('.team-logo').exists()).toBe(true)
    expect(wrapper.find('.team-logo').attributes('src')).toBe('https://example.com/chelsea.png')
  })

  it('displays team name', () => {
    const wrapper = mount(TeamLineup, {
      props: {
        lineup: mockLineup,
      },
      global: {
        components: {
          PlayersList,
        },
      },
    })

    expect(wrapper.text()).toContain('Chelsea')
  })

  it('displays team formation', () => {
    const wrapper = mount(TeamLineup, {
      props: {
        lineup: mockLineup,
      },
      global: {
        components: {
          PlayersList,
        },
      },
    })

    expect(wrapper.text()).toContain('Formation: 4-3-3')
  })

  it('renders lineup header', () => {
    const wrapper = mount(TeamLineup, {
      props: {
        lineup: mockLineup,
      },
      global: {
        components: {
          PlayersList,
        },
      },
    })

    expect(wrapper.find('.lineup-header').exists()).toBe(true)
  })

  it('renders PlayersList components for starting XI', () => {
    const wrapper = mount(TeamLineup, {
      props: {
        lineup: mockLineup,
      },
      global: {
        components: {
          PlayersList,
        },
      },
    })

    const playerLists = wrapper.findAllComponents(PlayersList)
    expect(playerLists.length).toBeGreaterThanOrEqual(1)
  })

  it('passes correct props to starting XI PlayersList', () => {
    const wrapper = mount(TeamLineup, {
      props: {
        lineup: mockLineup,
      },
      global: {
        components: {
          PlayersList,
        },
      },
    })

    const playerLists = wrapper.findAllComponents(PlayersList)
    const startingXI = playerLists[0]

    expect(startingXI.props('title')).toBe('Titulaires')
    expect(startingXI.props('players')).toEqual(mockLineup.startXI)
    expect(startingXI.props('isSubstitute')).toBe(false)
  })

  it('passes correct props to substitutes PlayersList', () => {
    const wrapper = mount(TeamLineup, {
      props: {
        lineup: mockLineup,
      },
      global: {
        components: {
          PlayersList,
        },
      },
    })

    const playerLists = wrapper.findAllComponents(PlayersList)
    const substitutes = playerLists[1]

    expect(substitutes.props('title')).toBe('Remplaçants')
    expect(substitutes.props('players')).toEqual(mockLineup.substitutes)
    expect(substitutes.props('isSubstitute')).toBe(true)
  })

  it('renders two PlayersList components', () => {
    const wrapper = mount(TeamLineup, {
      props: {
        lineup: mockLineup,
      },
      global: {
        components: {
          PlayersList,
        },
      },
    })

    const playerLists = wrapper.findAllComponents(PlayersList)
    expect(playerLists.length).toBe(2)
  })

  it('renders players section', () => {
    const wrapper = mount(TeamLineup, {
      props: {
        lineup: mockLineup,
      },
      global: {
        components: {
          PlayersList,
        },
      },
    })

    expect(wrapper.find('.players-section').exists()).toBe(true)
  })

  it('displays team lineup with empty substitutes', () => {
    const lineupWithoutSubstitutes = {
      ...mockLineup,
      substitutes: [],
    }

    const wrapper = mount(TeamLineup, {
      props: {
        lineup: lineupWithoutSubstitutes,
      },
      global: {
        components: {
          PlayersList,
        },
      },
    })

    expect(wrapper.find('.team-lineup').exists()).toBe(true)
  })
})
