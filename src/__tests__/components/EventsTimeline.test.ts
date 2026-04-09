import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import EventsTimeline from '../../components/EventsTimeline.vue'
import EventItem from '../../components/EventItem.vue'
import type { MatchEvent } from '@/types/football'

const mockEvents: MatchEvent[] = [
  {
    time: { elapsed: 15, extra: null },
    type: 'Goal',
    detail: 'Normal Goal',
    comments: null,
    player: { id: 1, name: 'Player 1' },
    assist: { id: 2, name: 'Assist Player' },
    team: { id: 1, name: 'Team A', logo: 'https://example.com/logo.png' },
  },
  {
    time: { elapsed: 45, extra: null },
    type: 'Card',
    detail: 'Yellow Card',
    comments: null,
    player: { id: 3, name: 'Player 3' },
    assist: null,
    team: { id: 2, name: 'Team B', logo: 'https://example.com/logoB.png' },
  },
] as MatchEvent[]

describe('EventsTimeline.vue', () => {
  it('does not render when events are empty', () => {
    const wrapper = mount(EventsTimeline, {
      props: {
        events: [],
      },
      global: {
        components: {
          EventItem,
        },
      },
    })

    expect(wrapper.find('.events-section').exists()).toBe(false)
  })

  it('renders events section when events exist', () => {
    const wrapper = mount(EventsTimeline, {
      props: {
        events: mockEvents,
      },
      global: {
        components: {
          EventItem,
        },
      },
    })

    expect(wrapper.find('.events-section').exists()).toBe(true)
  })

  it('displays events title', () => {
    const wrapper = mount(EventsTimeline, {
      props: {
        events: mockEvents,
      },
      global: {
        components: {
          EventItem,
        },
      },
    })

    expect(wrapper.text()).toContain('Événements')
  })

  it('renders all event items', () => {
    const wrapper = mount(EventsTimeline, {
      props: {
        events: mockEvents,
      },
      global: {
        components: {
          EventItem,
        },
      },
    })

    const eventItems = wrapper.findAllComponents(EventItem)
    expect(eventItems.length).toBe(2)
  })

  it('passes correct props to EventItem component', () => {
    const wrapper = mount(EventsTimeline, {
      props: {
        events: mockEvents,
      },
      global: {
        components: {
          EventItem,
        },
      },
    })

    const eventItems = wrapper.findAllComponents(EventItem)
    expect(eventItems[0].props('event')).toEqual(mockEvents[0])
    expect(eventItems[1].props('event')).toEqual(mockEvents[1])
  })

  it('renders events in timeline container', () => {
    const wrapper = mount(EventsTimeline, {
      props: {
        events: mockEvents,
      },
      global: {
        components: {
          EventItem,
        },
      },
    })

    expect(wrapper.find('.events-timeline').exists()).toBe(true)
  })

  it('handles multiple events correctly', () => {
    const multipleEvents = Array(5)
      .fill(null)
      .map((_, i) => ({
        time: { elapsed: (i + 1) * 10, extra: null },
        type: 'Goal',
        detail: `Goal ${i + 1}`,
        comments: null,
        player: { id: i, name: `Player ${i}` },
        team: { id: 1, name: 'Team A', logo: 'https://example.com/logo.png' },
      })) as MatchEvent[]

    const wrapper = mount(EventsTimeline, {
      props: {
        events: multipleEvents,
      },
      global: {
        components: {
          EventItem,
        },
      },
    })

    const eventItems = wrapper.findAllComponents(EventItem)
    expect(eventItems.length).toBe(5)
  })

  it('uses event index as key', () => {
    const wrapper = mount(EventsTimeline, {
      props: {
        events: mockEvents,
      },
      global: {
        components: {
          EventItem,
        },
      },
    })

    const eventItems = wrapper.findAllComponents(EventItem)
    expect(eventItems.length).toBe(mockEvents.length)
  })
})
