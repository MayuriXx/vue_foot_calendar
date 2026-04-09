<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { onMounted } from 'vue'
import { useMatchDetail } from '@/composables/useMatchDetail'
import MatchHeader from '@/components/MatchHeader.vue'
import ScoresSection from '@/components/ScoresSection.vue'
import StatisticsSection from '@/components/StatisticsSection.vue'
import EventsTimeline from '@/components/EventsTimeline.vue'
import LineupsSection from '@/components/LineupsSection.vue'

const route = useRoute()
const router = useRouter()
const fixtureId = parseInt(route.params.fixtureId as string)
const { match, statistics, events, lineups, isLoading, error, loadMatchDetails } = useMatchDetail(fixtureId)

onMounted(() => {
  loadMatchDetails()
})

const goBack = () => {
  router.back()
}
</script>

<template>
  <div class="match-detail-container">
    <header class="detail-header">
      <button class="back-button" @click="goBack">← Retour</button>
      <h1>Détails du Match</h1>
      <div class="spacer"></div>
    </header>

    <main class="detail-main">
      <!-- Loading State -->
      <div v-if="isLoading" class="loading">
        <p>⏳ Chargement des détails...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="error-message">
        ⚠️ {{ error }}
      </div>

      <!-- Match Details -->
      <div v-else-if="match" class="detail-content">
        <!-- Match Header Component -->
        <MatchHeader :match="match" />

        <!-- Scores Section Component -->
        <ScoresSection :match="match" />

        <!-- Statistics Component -->
        <StatisticsSection v-if="statistics.length > 0" :statistics="statistics" />

        <!-- Events Timeline Component -->
        <EventsTimeline v-if="events.length > 0" :events="events" />

        <!-- Lineups Component -->
        <LineupsSection v-if="lineups.length > 0" :lineups="lineups" />
      </div>
    </main>
  </div>
</template>

<style scoped>
.match-detail-container {
  min-height: 100vh;
  background: linear-gradient(to bottom, #f5f5f5, #ffffff);
}

.detail-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 20px;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.back-button {
  padding: 8px 16px;
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
  white-space: nowrap;
}

.back-button:hover {
  background-color: rgba(255, 255, 255, 0.3);
}

.detail-header h1 {
  flex: 1;
  margin: 0;
  font-size: 24px;
}

.spacer {
  width: 100px;
}

.detail-main {
  padding: 30px 20px;
  max-width: 1000px;
  margin: 0 auto;
}

.loading,
.error-message {
  text-align: center;
  padding: 40px 20px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.error-message {
  background-color: #fadbd8;
  color: #e74c3c;
  border: 1px solid #e74c3c;
}

.detail-content {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

@media (max-width: 768px) {
  .detail-header {
    flex-wrap: wrap;
  }

  .detail-header h1 {
    order: 2;
    flex-basis: 100%;
    margin-top: 10px;
  }

  .spacer {
    display: none;
  }
}
</style>
