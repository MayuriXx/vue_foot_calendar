<script setup lang="ts">
import type { Standing } from '@/types/football'

interface Props {
  standings: Standing[]
  homeTeamId: number
  awayTeamId: number
  leagueName: string
}

defineProps<Props>()

const getTeamHighlight = (teamId: number, homeId: number, awayId: number) => {
  if (teamId === homeId) return 'home-highlight'
  if (teamId === awayId) return 'away-highlight'
  return ''
}
</script>

<template>
  <section class="standings-section">
    <h2>📊 Classement</h2>
    <div class="league-info-standings">{{ leagueName }}</div>

    <div class="standings-table">
      <div class="standings-header">
        <div class="rank">Pos</div>
        <div class="team">Équipe</div>
        <div class="stats">J</div>
        <div class="stats">G</div>
        <div class="stats">N</div>
        <div class="stats">P</div>
        <div class="stats">Diff</div>
        <div class="points">Pts</div>
      </div>

      <div
        v-for="standing in standings"
        :key="standing.team.id"
        class="standing-row"
        :class="getTeamHighlight(standing.team.id, homeTeamId, awayTeamId)"
      >
        <div class="rank">{{ standing.rank }}</div>

        <div class="team">
          <img :src="standing.team.logo" :alt="standing.team.name" class="team-logo" />
          <span class="team-name">{{ standing.team.name }}</span>
        </div>

        <div class="stats">{{ standing.all.played }}</div>
        <div class="stats">{{ standing.all.win }}</div>
        <div class="stats">{{ standing.all.draw }}</div>
        <div class="stats">{{ standing.all.lose }}</div>

        <div class="stats diff" :class="standing.goalsDiff > 0 ? 'positive' : standing.goalsDiff < 0 ? 'negative' : ''">
          {{ standing.goalsDiff > 0 ? '+' : '' }}{{ standing.goalsDiff }}
        </div>

        <div class="points">
          <strong>{{ standing.points }}</strong>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.standings-section {
  background: white;
  border-radius: 10px;
  padding: 25px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.standings-section h2 {
  margin-top: 0;
  margin-bottom: 15px;
  color: #333;
}

.league-info-standings {
  font-size: 12px;
  color: #999;
  margin-bottom: 20px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.standings-table {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
}

.standings-header {
  display: grid;
  grid-template-columns: 40px 1fr 35px 35px 35px 35px 50px 60px;
  gap: 8px;
  background: var(--gradient-primary);
  color: white;
  padding: 12px;
  font-weight: 600;
  font-size: 12px;
  text-align: center;
}

.rank {
  text-align: center;
}

.team {
  text-align: left;
}

.stats {
  text-align: center;
}

.points {
  text-align: center;
  font-weight: 600;
}

.standing-row {
  display: grid;
  grid-template-columns: 40px 1fr 35px 35px 35px 35px 50px 60px;
  gap: 8px;
  align-items: center;
  padding: 12px;
  border-bottom: 1px solid #f0f0f0;
  font-size: 13px;
  transition: background-color 0.2s;
}

.standing-row:last-child {
  border-bottom: none;
}

.standing-row:hover {
  background-color: #f9f9f9;
}

.standing-row.home-highlight {
  background-color: rgba(46, 213, 115, 0.1);
  border-left: 4px solid #2ed573;
  padding-left: 8px;
}

.standing-row.away-highlight {
  background-color: rgba(102, 126, 234, 0.1);
  border-left: 4px solid var(--color-primary);
  padding-left: 8px;
}

.rank {
  font-weight: 600;
  color: var(--color-primary);
  text-align: center;
}

.team {
  display: flex;
  align-items: center;
  gap: 10px;
  text-align: left;
}

.team-logo {
  width: 24px;
  height: 24px;
  object-fit: contain;
  flex-shrink: 0;
}

.team-name {
  font-weight: 500;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.stats {
  text-align: center;
  color: #666;
}

.diff {
  font-weight: 600;
}

.diff.positive {
  color: #2ed573;
}

.diff.negative {
  color: var(--color-error);
}

.points {
  text-align: center;
  font-weight: 700;
  color: var(--color-primary);
  font-size: 14px;
}

@media (max-width: 768px) {
  .standings-header,
  .standing-row {
    grid-template-columns: 30px 1fr 25px 25px 25px 25px 35px 45px;
    gap: 4px;
    font-size: 11px;
    padding: 8px;
  }

  .team-logo {
    width: 20px;
    height: 20px;
  }

  .team-name {
    font-size: 12px;
  }

  .standings-header {
    font-size: 10px;
  }
}
</style>
