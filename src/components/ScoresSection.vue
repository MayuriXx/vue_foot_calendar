<script setup lang="ts">
import type { Match } from '@/types/football'

interface Props {
  match: Match
}

defineProps<Props>()
</script>

<template>
  <section v-if="match.score.halftime.home !== null" class="scores-section">
    <div class="score-row">
      <span>Mi-temps</span>
      <span class="score-value">{{ match.score.halftime.home }} - {{ match.score.halftime.away }}</span>
    </div>
    <div v-if="match.score.fulltime.home !== null" class="score-row">
      <span>Temps réglementaire</span>
      <span class="score-value">{{ match.score.fulltime.home }} - {{ match.score.fulltime.away }}</span>
    </div>
    <div v-if="match.score.extratime.home !== null" class="score-row">
      <span>Prolongations</span>
      <span class="score-value">{{ match.score.extratime.home }} - {{ match.score.extratime.away }}</span>
    </div>
    <div v-if="match.score.penalty.home !== null" class="score-row">
      <span>TAB</span>
      <span class="score-value">{{ match.score.penalty.home }} - {{ match.score.penalty.away }}</span>
    </div>
  </section>
</template>

<style scoped>
.scores-section {
  background: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.score-row {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #eee;
  font-size: 16px;
}

.score-row:last-child {
  border-bottom: none;
}

.score-value {
  font-weight: 600;
  color: var(--color-primary);
  font-size: 18px;
}
</style>
