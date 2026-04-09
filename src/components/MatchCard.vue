<script setup lang="ts">
import type { Match } from '@/types/football'

interface Props {
  match: Match
  isPastMatch?: boolean
  isLiveMatch?: boolean
}

withDefaults(defineProps<Props>(), {
  isPastMatch: false,
  isLiveMatch: false,
})

const emit = defineEmits<{
  click: []
}>()

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
}

const getStatusLabel = (status: string) => {
  const statusMap: Record<string, string> = {
    'NS': 'À venir',
    'PST': 'Reporté',
    '1H': 'Match en cours (1ère mi-temps)',
    '2H': 'Match en cours (2ème mi-temps)',
    'ET': 'Match en cours (prolongations)',
    'P': 'Match en cours (TAB)',
    'FT': 'Terminé',
    'AET': 'Terminé (après prolongations)',
    'PEN': 'Terminé (après TAB)',
  }
  return statusMap[status] || status
}
</script>

<template>
  <div class="match-card" :class="{ live: isLiveMatch, finished: isPastMatch }" @click="emit('click')">
    <div class="match-time">
      {{ formatDate(match.fixture.date) }}
    </div>

    <div class="league-info">
      <img :src="match.league.logo" :alt="match.league.name" class="league-logo" />
      <span class="league-name">{{ match.league.name }}</span>
    </div>

    <div class="teams-match">
      <div class="team home">
        <img :src="match.teams.home.logo" :alt="match.teams.home.name" class="team-logo" />
        <span class="team-name">{{ match.teams.home.name }}</span>
      </div>

      <div class="score-display">
        <span class="score">{{ isLiveMatch || isPastMatch ? `${match.goals.home ?? '-'} - ${match.goals.away ?? '-'}` : 'vs' }}</span>
        <span v-if="isLiveMatch" class="status-badge live">EN DIRECT</span>
      </div>

      <div class="team away">
        <span class="team-name">{{ match.teams.away.name }}</span>
        <img :src="match.teams.away.logo" :alt="match.teams.away.name" class="team-logo" />
      </div>
    </div>

    <div class="match-status">
      {{ getStatusLabel(match.fixture.status.short) }}
    </div>
  </div>
</template>

<style scoped>
.match-card {
  background: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
  border-left: 4px solid var(--color-primary);
  cursor: pointer;
}

.match-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.match-card.live {
  border-left-color: var(--color-error);
  background: rgba(255, 107, 107, 0.05);
}

.match-card.finished {
  border-left-color: #27ae60;
  opacity: 0.85;
}

.match-time {
  font-size: 12px;
  color: #999;
  margin-bottom: 10px;
  font-weight: 600;
}

.league-info {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.league-logo {
  width: 24px;
  height: 24px;
  object-fit: contain;
}

.league-name {
  font-size: 12px;
  color: #666;
  font-weight: 500;
}

.teams-match {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
}

.team {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
}

.team.home {
  justify-content: flex-start;
}

.team.away {
  justify-content: flex-end;
}

.team-logo {
  width: 32px;
  height: 32px;
  object-fit: contain;
}

.team-name {
  font-size: 13px;
  font-weight: 600;
  color: #333;
  text-align: center;
}

.score-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

.score {
  font-size: 24px;
  font-weight: bold;
  color: var(--color-primary);
  min-width: 60px;
  text-align: center;
}

.status-badge {
  font-size: 10px;
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: 600;
  text-transform: uppercase;
}

.status-badge.live {
  background-color: var(--color-error);
  color: white;
  animation: blink 1s infinite;
}

@keyframes blink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

.match-status {
  font-size: 11px;
  color: #999;
  text-align: center;
  font-style: italic;
}
</style>
