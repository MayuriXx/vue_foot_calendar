<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'
import { useFootball } from '@/composables/useFootball'
import MatchCard from '@/components/MatchCard.vue'

const authStore = useAuthStore()
const router = useRouter()
const {
  matches,
  isLoading,
  error,
  loadTodayMatches,
  selectedStatus,
  selectedCountry,
  selectedLeague,
  countries,
  leagues,
  filteredMatchesByLeague,
  resetFilters,
} = useFootball()

/**
 * Vérifie si un match contient l'équipe favorite
 */
const isFavoriteTeamPlaying = (homeTeamId: number, awayTeamId: number) => {
  return authStore.favoriteTeamId === homeTeamId || authStore.favoriteTeamId === awayTeamId
}

const handleLogout = async () => {
  authStore.logout()
  await router.push('/login')
}

const goToProfile = () => {
  router.push('/profile')
}

const goToMatchDetail = (fixtureId: number) => {
  router.push(`/match/${fixtureId}`)
}

// Reset league when country changes
const handleCountryChange = () => {
  selectedLeague.value = 'all'
}

onMounted(() => {
  loadTodayMatches()
})
</script>

<template>
  <div class="calendar-container">
    <header class="app-header">
      <div class="header-left">
        <h1>📅 Football Calendar</h1>
      </div>
      <div class="header-right">
        <span class="username">Bienvenue, {{ authStore.user?.username }}</span>
        <button @click="goToProfile" class="profile-button">👤 Profil</button>
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

        <!-- Filtres Section -->
        <div class="filters-section">
          <!-- Filtre par Statut -->
          <div class="filter-group">
            <label for="status-filter">Statut:</label>
            <select id="status-filter" v-model="selectedStatus" class="filter-select">
              <option value="all">Tous les statuts</option>
              <option value="live">🔴 En direct</option>
              <option value="upcoming">⏰ À venir</option>
              <option value="finished">✅ Terminés</option>
            </select>
          </div>

          <!-- Filtre par Pays -->
          <div class="filter-group">
            <label for="country-filter">Pays:</label>
            <select
              id="country-filter"
              v-model="selectedCountry"
              @change="handleCountryChange"
              class="filter-select"
            >
              <option value="all">Tous les pays</option>
              <option v-for="country in countries" :key="country" :value="country">
                {{ country }}
              </option>
            </select>
          </div>

          <!-- Filtre par Championnat -->
          <div class="filter-group">
            <label for="league-filter">Championnat:</label>
            <select id="league-filter" v-model="selectedLeague" class="filter-select">
              <option value="all">Tous les championnats</option>
              <option v-for="league in leagues" :key="league" :value="league">
                {{ league.split('|')[1] }}
              </option>
            </select>
          </div>

          <!-- Bouton Réinitialiser -->
          <button @click="resetFilters" class="reset-button">↻ Réinitialiser</button>
        </div>

        <div v-if="matches.length === 0" class="no-matches">
          <p>Aucun match aujourd'hui</p>
        </div>

        <!-- Groupement par Ligue (Filtré) -->
        <div v-for="league in filteredMatchesByLeague" :key="league.id" class="league-section">
          <!-- Header de la Ligue -->
          <div class="league-header">
            <div class="league-info-left">
              <img v-if="league.flag" :src="league.flag" :alt="league.country" class="country-flag" />
              <img :src="league.logo" :alt="league.name" class="league-logo" />
              <div class="league-details">
                <span class="country-name">{{ league.country }}</span>
                <span class="league-name">{{ league.name }}</span>
              </div>
            </div>
            <div class="match-count">
              {{ league.live.length + league.upcoming.length + league.finished.length }} (matchs)
            </div>
          </div>

          <!-- Matchs en Direct -->
          <section v-if="league.live.length > 0" class="matches-section">
            <h3 class="section-title">🔴 En direct</h3>
            <div class="matches-grid">
              <div
                v-for="match in league.live"
                :key="match.fixture.id"
                class="match-wrapper"
                :class="{ 'favorite-match': isFavoriteTeamPlaying(match.teams.home.id, match.teams.away.id) }"
              >
                <MatchCard
                  :match="match"
                  is-live-match
                  @click="goToMatchDetail(match.fixture.id)"
                />
              </div>
            </div>
          </section>

          <!-- Matchs à Venir -->
          <section v-if="league.upcoming.length > 0" class="matches-section">
            <h3 class="section-title">⏰ À venir</h3>
            <div class="matches-grid">
              <div
                v-for="match in league.upcoming"
                :key="match.fixture.id"
                class="match-wrapper"
                :class="{ 'favorite-match': isFavoriteTeamPlaying(match.teams.home.id, match.teams.away.id) }"
              >
                <MatchCard
                  :match="match"
                  @click="goToMatchDetail(match.fixture.id)"
                />
              </div>
            </div>
          </section>

          <!-- Matchs Terminés -->
          <section v-if="league.finished.length > 0" class="matches-section">
            <h3 class="section-title">✅ Terminés</h3>
            <div class="matches-grid">
              <div
                v-for="match in league.finished"
                :key="match.fixture.id"
                class="match-wrapper"
                :class="{ 'favorite-match': isFavoriteTeamPlaying(match.teams.home.id, match.teams.away.id) }"
              >
                <MatchCard
                  :match="match"
                  is-past-match
                  @click="goToMatchDetail(match.fixture.id)"
                />
              </div>
            </div>
          </section>
        </div>

        <!-- Message si aucun résultat après filtrage -->
        <div v-if="filteredMatchesByLeague.length === 0 && matches.length > 0" class="no-matches">
          <p>Aucun match correspondant aux critères de filtre</p>
        </div>
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

.profile-button {
  padding: 8px 16px;
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
}

.profile-button:hover {
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
  margin-bottom: 25px;
  font-size: 28px;
}

/* Filtres Section */
.filters-section {
  background: white;
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 30px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
  align-items: flex-end;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filter-group label {
  font-size: 13px;
  font-weight: 600;
  color: #667eea;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.filter-select {
  padding: 10px 12px;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;
  color: #333;
  background: white;
  cursor: pointer;
  transition: all 0.3s;
  min-width: 180px;
}

.filter-select:hover {
  border-color: #667eea;
}

.filter-select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.reset-button {
  padding: 10px 20px;
  background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.reset-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(231, 76, 60, 0.4);
}

/* Groupement par Ligue */
.league-section {
  margin-bottom: 50px;
}

.league-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 25px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.2);
}

.league-info-left {
  display: flex;
  align-items: center;
  gap: 15px;
}

.country-flag {
  width: 32px;
  height: 24px;
  object-fit: contain;
  border-radius: 3px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.league-logo {
  width: 40px;
  height: 40px;
  object-fit: contain;
}

.league-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.country-name {
  font-size: 12px;
  opacity: 0.85;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.league-name {
  font-size: 16px;
  font-weight: 600;
}

.match-count {
  font-size: 13px;
  opacity: 0.8;
  background: rgba(255, 255, 255, 0.1);
  padding: 6px 12px;
  border-radius: 20px;
}

.matches-section {
  margin-bottom: 30px;
  margin-left: 10px;
}

.section-title {
  color: #667eea;
  font-size: 18px;
  margin-bottom: 18px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
}

.matches-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 18px;
}

.match-wrapper {
  transition: all 0.3s;
}

.match-wrapper.favorite-match {
  transform: scale(1.02);
  filter: drop-shadow(0 4px 12px rgba(102, 126, 234, 0.3));
}

.match-wrapper.favorite-match :deep(.match-card) {
  border-left: 4px solid #2ed573;
  background: rgba(46, 213, 115, 0.08);
  box-shadow: 0 2px 12px rgba(46, 213, 115, 0.2);
}

.match-wrapper.favorite-match :deep(.match-card):hover {
  box-shadow: 0 4px 16px rgba(46, 213, 115, 0.3);
  transform: translateY(-3px);
}

.match-card {
  background: white;
  border-radius: 10px;
  padding: 18px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
  border-left: 4px solid #667eea;
  cursor: pointer;
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

  .filters-section {
    flex-direction: column;
  }

  .filter-group {
    width: 100%;
  }

  .filter-select {
    width: 100%;
    min-width: unset;
  }

  .reset-button {
    width: 100%;
  }

  .matches-grid {
    grid-template-columns: 1fr;
  }

  .calendar-main {
    padding: 20px 10px;
  }

  .league-header {
    flex-direction: column;
    gap: 15px;
    align-items: flex-start;
  }

  .league-info-left {
    width: 100%;
  }

  .match-count {
    width: 100%;
    text-align: right;
  }
}
</style>
