<script setup lang="ts">
import type { MatchLineup } from '@/types/football'
import TeamLineup from './TeamLineup.vue'

interface Props {
  lineups: MatchLineup[]
}

defineProps<Props>()
</script>

<template>
  <section v-if="lineups.length > 0" class="lineups-section">
    <h2>⚽ Formations</h2>
    <div class="lineups-grid">
      <TeamLineup v-for="(lineup, index) in lineups" :key="index" :lineup="lineup" />
    </div>
  </section>
</template>

<style scoped>
.lineups-section {
  background: white;
  border-radius: 10px;
  padding: 25px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.lineups-section h2 {
  margin-top: 0;
  margin-bottom: 20px;
  color: #333;
}

.lineups-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
}

@media (max-width: 768px) {
  .lineups-grid {
    grid-template-columns: 1fr;
  }
}
</style>
