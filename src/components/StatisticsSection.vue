<script setup lang="ts">
import type { MatchStatistics } from '@/types/football'

interface Props {
  statistics: MatchStatistics[]
}

defineProps<Props>()
</script>

<template>
  <section v-if="statistics.length > 0" class="statistics-section">
    <h2>📊 Statistiques</h2>
    <div class="stats-grid">
      <div v-for="(stat, index) in statistics" :key="index" class="team-stats">
        <h3>{{ stat.team.name }}</h3>
        <div class="stats-list">
          <div v-for="(item, i) in stat.statistics" :key="i" class="stat-item">
            <span class="stat-type">{{ item.type }}</span>
            <span class="stat-value">{{ item.value }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.statistics-section {
  background: white;
  border-radius: 10px;
  padding: 25px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.statistics-section h2 {
  margin-top: 0;
  margin-bottom: 20px;
  color: #333;
}

.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
}

.team-stats h3 {
  color: #667eea;
  font-size: 16px;
  margin-bottom: 15px;
  text-align: center;
}

.stats-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #eee;
  font-size: 14px;
}

.stat-type {
  color: #666;
}

.stat-value {
  font-weight: 600;
  color: #333;
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
