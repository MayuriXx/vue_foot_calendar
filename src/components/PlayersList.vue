<script setup lang="ts">
interface Player {
  player: {
    id: number
    name: string
    number: number
    pos: string
  }
}

interface Props {
  title: string
  players: Player[]
  isSubstitute?: boolean
}

withDefaults(defineProps<Props>(), {
  isSubstitute: false,
})
</script>

<template>
  <div class="players-group">
    <h4>{{ title }}</h4>
    <div class="players-list">
      <div
        v-for="(item, i) in players"
        :key="`${title}-${i}`"
        class="player-item"
        :class="{ substitute: isSubstitute }"
      >
        <span class="player-number">{{ item.player.number }}</span>
        <span class="player-name">{{ item.player.name }}</span>
        <span class="player-pos">{{ item.player.pos }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.players-group {
  margin-bottom: 20px;
}

.players-group:last-child {
  margin-bottom: 0;
}

.players-group h4 {
  color: #667eea;
  font-size: 13px;
  font-weight: 600;
  margin: 0 0 10px 0;
  text-transform: uppercase;
}

.players-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.player-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 0;
  font-size: 13px;
  border-bottom: 1px solid #f0f0f0;
}

.player-item.substitute {
  opacity: 0.7;
}

.player-number {
  min-width: 25px;
  font-weight: 600;
  color: #667eea;
  text-align: center;
  background: #f0f0f0;
  padding: 3px 6px;
  border-radius: 3px;
}

.player-name {
  flex: 1;
  color: #333;
  font-weight: 500;
}

.player-pos {
  font-size: 11px;
  color: #999;
  background: #f9f9f9;
  padding: 2px 6px;
  border-radius: 3px;
}
</style>
