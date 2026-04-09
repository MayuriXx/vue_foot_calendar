<script setup lang="ts">
import type { MatchEvent } from '@/types/football'
import EventItem from './EventItem.vue'

interface Props {
  events: MatchEvent[]
}

defineProps<Props>()
</script>

<template>
  <section v-if="events.length > 0" class="events-section">
    <h2>📅 Événements</h2>
    <div class="events-timeline">
      <EventItem v-for="(event, index) in events" :key="index" :event="event" />
    </div>
  </section>
</template>

<style scoped>
.events-section {
  background: white;
  border-radius: 10px;
  padding: 25px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.events-section h2 {
  margin-top: 0;
  margin-bottom: 20px;
  color: #333;
}

.events-timeline {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
</style>
