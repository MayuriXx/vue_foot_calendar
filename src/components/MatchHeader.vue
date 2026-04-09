<script setup lang="ts">
import type { Match } from '@/types/football'

interface Props {
  match: Match
}

defineProps<Props>()
</script>

<template>
  <section class="match-header">
    <div class="league-info">
      <img :src="match.league.logo" :alt="match.league.name" class="league-logo" />
      <span class="league-name">{{ match.league.name }} - {{ match.fixture.status.long }}</span>
    </div>

    <div class="match-score">
      <div class="team home">
        <img :src="match.teams.home.logo" :alt="match.teams.home.name" class="team-logo" />
        <span class="team-name">{{ match.teams.home.name }}</span>
      </div>

      <div class="score-box">
        <div class="score">{{ match.goals.home ?? '-' }} - {{ match.goals.away ?? '-' }}</div>
        <div class="date">{{ new Date(match.fixture.date).toLocaleDateString('fr-FR') }}</div>
        <div class="time">{{ new Date(match.fixture.date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) }}</div>
      </div>

      <div class="team away">
        <span class="team-name">{{ match.teams.away.name }}</span>
        <img :src="match.teams.away.logo" :alt="match.teams.away.name" class="team-logo" />
      </div>
    </div>

    <div v-if="match.fixture.venue.name" class="venue-info">
      📍 {{ match.fixture.venue.name }}, {{ match.fixture.venue.city }}
    </div>
  </section>
</template>

<style scoped>
.match-header {
  background: white;
  border-radius: 10px;
  padding: 30px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.league-info {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
  font-size: 14px;
  color: #666;
}

.league-logo {
  width: 24px;
  height: 24px;
  object-fit: contain;
}

.match-score {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 20px;
}

.team {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  flex: 1;
}

.team-logo {
  width: 60px;
  height: 60px;
  object-fit: contain;
}

.team-name {
  font-weight: 600;
  font-size: 16px;
  color: #333;
}

.score-box {
  min-width: 150px;
}

.score {
  font-size: 48px;
  font-weight: bold;
  color: var(--color-primary);
  margin-bottom: 10px;
}

.date {
  font-size: 12px;
  color: #999;
}

.time {
  font-size: 12px;
  color: #999;
}

.venue-info {
  font-size: 14px;
  color: #666;
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #eee;
}

@media (max-width: 768px) {
  .match-score {
    flex-direction: column;
  }

  .score {
    font-size: 36px;
  }
}
</style>
