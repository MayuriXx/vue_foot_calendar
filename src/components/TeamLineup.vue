<script setup lang="ts">
import type { MatchLineup } from '@/types/football'
import PlayersList from './PlayersList.vue'

interface Props {
  lineup: MatchLineup
}

defineProps<Props>()
</script>

<template>
  <div class="team-lineup">
    <div class="lineup-header">
      <img :src="lineup.team.logo" :alt="lineup.team.name" class="team-logo" />
      <div class="lineup-info">
        <div class="team-name">{{ lineup.team.name }}</div>
        <div class="formation">Formation: {{ lineup.team.formation }}</div>
      </div>
    </div>

    <div class="players-section">
      <PlayersList title="Titulaires" :players="lineup.startXI" />
      <PlayersList title="Remplaçants" :players="lineup.substitutes" is-substitute />
    </div>
  </div>
</template>

<style scoped>
.team-lineup {
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;
}

.lineup-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 15px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.lineup-header .team-logo {
  width: 40px;
  height: 40px;
  object-fit: contain;
  background: white;
  padding: 5px;
  border-radius: 4px;
}

.lineup-info {
  flex: 1;
}

.lineup-info .team-name {
  font-weight: 600;
  font-size: 16px;
  margin-bottom: 3px;
}

.formation {
  font-size: 12px;
  opacity: 0.9;
}

.players-section {
  padding: 15px;
}
</style>
