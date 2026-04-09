import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import EventItem from '../../components/EventItem.vue'
import type { MatchEvent } from '@/types/football'

const mockEvent: MatchEvent = {
  time: {
    elapsed: 45,
    extra: null,
  },
  type: 'Goal',
  detail: 'Normal Goal',
  comments: null,
  player: {
    id: 1,
    name: 'Player Name',
  },
  assist: {
    id: 2,
    name: 'Assist Player',
  },
  team: {
    id: 1,
    name: 'Team A',
    logo: 'https://example.com/logo.png',
  },
} as MatchEvent

describe('EventItem.vue', () => {
  it('renders event item correctly', () => {
    const wrapper = mount(EventItem, {
      props: {
        event: mockEvent,
      },
    })

    expect(wrapper.find('.event-item').exists()).toBe(true)
    expect(wrapper.text()).toContain('Player Name')
    expect(wrapper.text()).toContain('Normal Goal')
  })

  it('displays correct elapsed time', () => {
    const wrapper = mount(EventItem, {
      props: {
        event: mockEvent,
      },
    })

    expect(wrapper.find('.event-time').text()).toContain("45'")
  })

  it('displays assist player when it exists', () => {
    const wrapper = mount(EventItem, {
      props: {
        event: mockEvent,
      },
    })

    expect(wrapper.text()).toContain('Assist Player')
    expect(wrapper.text()).toContain('Passe :')
  })

  it('displays goal icon for goal event', () => {
    const wrapper = mount(EventItem, {
      props: {
        event: mockEvent,
      },
    })

    expect(wrapper.find('.event-icon').text()).toBe('⚽')
  })

  it('displays card icon for card event', () => {
    const cardEvent = {
      ...mockEvent,
      type: 'Card',
      detail: 'Yellow Card',
    } as MatchEvent

    const wrapper = mount(EventItem, {
      props: {
        event: cardEvent,
      },
    })

    expect(wrapper.find('.event-icon').text()).toBe('🟨')
  })

  it('applies yellow-card class for yellow cards', () => {
    const yellowCardEvent = {
      ...mockEvent,
      type: 'Card',
      detail: 'Yellow Card',
    } as MatchEvent

    const wrapper = mount(EventItem, {
      props: {
        event: yellowCardEvent,
      },
    })

    expect(wrapper.find('.event-item.yellow-card').exists()).toBe(true)
  })

  it('applies red-card class for red cards', () => {
    const redCardEvent = {
      ...mockEvent,
      type: 'Card',
      detail: 'Red Card',
    } as MatchEvent

    const wrapper = mount(EventItem, {
      props: {
        event: redCardEvent,
      },
    })

    expect(wrapper.find('.event-item.red-card').exists()).toBe(true)
  })

  it('displays team logo', () => {
    const wrapper = mount(EventItem, {
      props: {
        event: mockEvent,
      },
    })

    expect(wrapper.find('.event-team-logo').exists()).toBe(true)
  })

  it('handles null elapsed time', () => {
    const eventWithoutTime = {
      ...mockEvent,
      time: {
        elapsed: null,
        extra: null,
      },
    } as MatchEvent

    const wrapper = mount(EventItem, {
      props: {
        event: eventWithoutTime,
      },
    })

    expect(wrapper.find('.event-time').text()).toContain('--')
  })
})
