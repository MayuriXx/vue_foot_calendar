<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'
import { useFootball } from '@/composables/useFootball'

const authStore = useAuthStore()
const router = useRouter()
const { matches, isLoading, error, loadTodayMatches, liveMatches, upcomingMatches, finishedMatches } = useFootball()

const handleLogout = async () => {
  authStore.logout()
  await router.push('/login')
}

onMounted(() => {
  loadTodayMatches()
})

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
  <div class="calendar-container">
    <header class="app-header">
      <div class="header-left">
        <h1>📅 Football Calendar</h1>
      </div>
      <div class="header-right">
        <span class="username">Bienvenue, {{ authStore.user?.username }}</span>
        <button @click="handleLogout" class="logout-button">Déconnexion</button>
      </div>
    </header>

    <main class="calendar-main">
      <div v-if="isLoading" class="loading">
        <p>⏳ Chargement des matchs...</p>
      </div>

      <div v-else-if="error" class="error-message">
        ⚠️ {{ error }}
      </div>

      <div v-else class="matches-container">
        <h2>Matchs d'aujourd'hui</h2>

        <div v-if="matches.length === 0" class="no-matches">
          <p>Aucun match aujourd'hui</p>
        </div>

        <!-- Live Matches -->
        <section v-if="liveMatches.length > 0" class="matches-section">
          <h3 class="section-title">🔴 En direct</h3>
          <div class="matches-grid">
            <div v-for="match in liveMatches" :key="match.fixture.id" class="match-card live">
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
                  <span class="score">{{ match.goals.home ?? '-' }} - {{ match.goals.away ?? '-' }}</span>
                  <span class="status-badge live">EN DIRECT</span>
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
          </div>
        </section>

        <!-- Upcoming Matches -->
        <section v-if="upcomingMatches.length > 0" class="matches-section">
          <h3 class="section-title">⏰ À venir</h3>
          <div class="matches-grid">
            <div v-for="match in upcomingMatches" :key="match.fixture.id" class="match-card">
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
                  <span class="score">vs</span>
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
          </div>
        </section>

        <!-- Finished Matches -->
        <section v-if="finishedMatches.length > 0" class="matches-section">
          <h3 class="section-title">✅ Terminés</h3>
          <div class="matches-grid">
            <div v-for="match in finishedMatches" :key="match.fixture.id" class="match-card finished">
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
                  <span class="score">{{ match.goals.home ?? '-' }} - {{ match.goals.away ?? '-' }}</span>
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
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<style scoped>
.calendar-container {
  min-height: 100vh;
  background: linear-gradient(to bottom, #f5f5f5, #ffffff);
}

.app-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-left h1 {
  margin: 0;
  font-size: 24px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 15px;
}

.username {
  font-size: 14px;
  opacity: 0.9;
}

.logout-button {
  padding: 8px 16px;
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
}

.logout-button:hover {
  background-color: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.6);
}

.calendar-main {
  padding: 30px 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.loading,
.no-matches {
  text-align: center;
  padding: 40px 20px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  color: #666;
  font-size: 16px;
}

.error-message {
  background-color: #fadbd8;
  color: #e74c3c;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  font-size: 16px;
  border: 1px solid #e74c3c;
}

.matches-container h2 {
  color: #333;
  margin-bottom: 30px;
  font-size: 28px;
}

.matches-section {
  margin-bottom: 40px;
}

.section-title {
  color: #667eea;
  font-size: 20px;
  margin-bottom: 20px;
  font-weight: 600;
}

.matches-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
}

.match-card {
  background: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
  border-left: 4px solid #667eea;
}

.match-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.match-card.live {
  border-left-color: #e74c3c;
  background: rgba(231, 76, 60, 0.05);
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
  color: #667eea;
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
  background-color: #e74c3c;
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

@media (max-width: 768px) {
  .header-left,
  .header-right {
    flex-direction: column;
  }

  .matches-grid {
    grid-template-columns: 1fr;
  }

  .calendar-main {
    padding: 20px 10px;
  }
}
</style>
