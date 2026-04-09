import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PlayersList from '../../components/PlayersList.vue'

const mockPlayers = [
  {
    player: {
      id: 1,
      name: 'Player 1',
      number: 1,
      pos: 'G',
    },
  },
  {
    player: {
      id: 2,
      name: 'Player 2',
      number: 2,
      pos: 'D',
    },
  },
]

describe('PlayersList.vue', () => {
  it('renders players list with title', () => {
    const wrapper = mount(PlayersList, {
      props: {
        title: 'Starting XI',
        players: mockPlayers,
      },
    })

    expect(wrapper.text()).toContain('Starting XI')
    expect(wrapper.find('.players-group').exists()).toBe(true)
  })

  it('displays all players', () => {
    const wrapper = mount(PlayersList, {
      props: {
        title: 'Starting XI',
        players: mockPlayers,
      },
    })

    const playerItems = wrapper.findAll('.player-item')
    expect(playerItems.length).toBe(2)
  })

  it('displays player information correctly', () => {
    const wrapper = mount(PlayersList, {
      props: {
        title: 'Starting XI',
        players: mockPlayers,
      },
    })

    expect(wrapper.text()).toContain('Player 1')
    expect(wrapper.text()).toContain('Player 2')
    expect(wrapper.text()).toContain('G')
    expect(wrapper.text()).toContain('D')
  })

  it('displays player numbers', () => {
    const wrapper = mount(PlayersList, {
      props: {
        title: 'Starting XI',
        players: mockPlayers,
      },
    })

    const playerNumbers = wrapper.findAll('.player-number')
    expect(playerNumbers[0].text()).toBe('1')
    expect(playerNumbers[1].text()).toBe('2')
  })

  it('does not apply substitute class by default', () => {
    const wrapper = mount(PlayersList, {
      props: {
        title: 'Starting XI',
        players: mockPlayers,
      },
    })

    const playerItems = wrapper.findAll('.player-item')
    expect(playerItems[0].classes()).not.toContain('substitute')
  })

  it('applies substitute class when isSubstitute is true', () => {
    const wrapper = mount(PlayersList, {
      props: {
        title: 'Substitutes',
        players: mockPlayers,
        isSubstitute: true,
      },
    })

    const playerItems = wrapper.findAll('.player-item')
    playerItems.forEach((item) => {
      expect(item.classes()).toContain('substitute')
    })
  })

  it('renders empty list when players array is empty', () => {
    const wrapper = mount(PlayersList, {
      props: {
        title: 'Starting XI',
        players: [],
      },
    })

    const playerItems = wrapper.findAll('.player-item')
    expect(playerItems.length).toBe(0)
  })

  it('displays player positions correctly', () => {
    const wrapper = mount(PlayersList, {
      props: {
        title: 'Starting XI',
        players: mockPlayers,
      },
    })

    const positions = wrapper.findAll('.player-pos')
    expect(positions[0].text()).toBe('G')
    expect(positions[1].text()).toBe('D')
  })

  it('displays multiple players with different positions', () => {
    const playersWithVariousPositions = [
      { player: { id: 1, name: 'Keeper', number: 1, pos: 'G' } },
      { player: { id: 2, name: 'Defender', number: 2, pos: 'D' } },
      { player: { id: 3, name: 'Midfielder', number: 5, pos: 'M' } },
      { player: { id: 4, name: 'Forward', number: 9, pos: 'F' } },
    ]

    const wrapper = mount(PlayersList, {
      props: {
        title: 'Squad',
        players: playersWithVariousPositions,
      },
    })

    expect(wrapper.findAll('.player-item').length).toBe(4)
    expect(wrapper.text()).toContain('G')
    expect(wrapper.text()).toContain('D')
    expect(wrapper.text()).toContain('M')
    expect(wrapper.text()).toContain('F')
  })
})
