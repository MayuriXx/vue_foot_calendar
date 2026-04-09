<script setup lang="ts">
import type { MatchEvent } from '@/types/football'

interface Props {
  event: MatchEvent
}

defineProps<Props>()

const getEventIcon = (type: string) => {
  const icons: Record<string, string> = {
    'Goal': '⚽',
    'Card': '🟨',
    'subst': '🔄',
    'Var': '📹',
  }
  return icons[type] || '📌'
}

const getCardColor = (detail: string) => {
  if (detail.includes('Red Card')) return 'red-card'
  if (detail.includes('Yellow Card')) return 'yellow-card'
  return ''
}

const formatMins = (mins: number | null) => {
  if (mins === null || mins === undefined) return '--'
  return `${mins}'`
}
</script>

<template>
  <div class="event-item" :class="getCardColor(event.detail)">
    <div class="event-time">
      {{ formatMins(event.time.elapsed) }}
    </div>

    <div class="event-icon">
      {{ getEventIcon(event.type) }}
    </div>

    <div class="event-details">
      <div class="event-player">{{ event.player.name }}</div>
      <div class="event-type">{{ event.detail }}</div>
      <div v-if="event.assist" class="event-assist">
        Passe : {{ event.assist.name }}
      </div>
    </div>

    <div class="event-team">
      <img :src="event.team.logo" :alt="event.team.name" class="event-team-logo" />
    </div>
  </div>
</template>

<style scoped>
.event-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  background-color: #f9f9f9;
  border-radius: 8px;
  border-left: 4px solid #667eea;
  transition: background-color 0.2s;
}

.event-item:hover {
  background-color: #f0f0f0;
}

.event-item.yellow-card {
  border-left-color: #f1c40f;
  background-color: #fffbf0;
}

.event-item.red-card {
  border-left-color: #e74c3c;
  background-color: #fadbd8;
}

.event-time {
  min-width: 50px;
  font-weight: 600;
  color: #667eea;
  font-size: 16px;
}

.event-icon {
  font-size: 24px;
}

.event-details {
  flex: 1;
}

.event-player {
  font-weight: 600;
  color: #333;
  font-size: 15px;
}

.event-type {
  font-size: 13px;
  color: #666;
}

.event-assist {
  font-size: 12px;
  color: #999;
  font-style: italic;
}

.event-team-logo {
  width: 24px;
  height: 24px;
  object-fit: contain;
}
</style>
