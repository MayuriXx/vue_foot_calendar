<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import footballService from '@/services/football.service'
import type { Team } from '@/types/football'

const router = useRouter()
const authStore = useAuthStore()

const allTeams = ref<Team[]>([])
const isLoadingTeams = ref(false)
const error = ref<string | null>(null)
const selectedLeagueId = ref<number>(39) // Premier League par défaut
const searchQuery = ref('')

// Ligues populaires pour le select
const popularLeagues = [
  { id: 39, name: 'Premier League', country: 'England' },
  { id: 140, name: 'La Liga', country: 'Spain' },
  { id: 135, name: 'Serie A', country: 'Italy' },
  { id: 78, name: 'Bundesliga', country: 'Germany' },
  { id: 61, name: 'Ligue 1', country: 'France' },
]

// Teams filtrées par recherche
const filteredTeams = computed(() => {
  if (!searchQuery.value) {
    return allTeams.value
  }
  return allTeams.value.filter((team) =>
    team.team.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

// Équipe sélectionnée
const selectedTeam = computed(() => {
  if (!authStore.favoriteTeamId) return null
  return allTeams.value.find((t) => t.team.id === authStore.favoriteTeamId)
})

/**
 * Charge les équipes pour une ligue
 */
const loadTeams = async (leagueId: number) => {
  isLoadingTeams.value = true
  error.value = null

  try {
    selectedLeagueId.value = leagueId
    // Utiliser 2025 pour les données stables (2026 n'a pas de données encore)
    const season = 2025
    console.log(`Chargement des équipes pour la ligue ${leagueId}, saison ${season}...`)
    allTeams.value = await footballService.getTeams(leagueId, season)
    console.log(`✓ ${allTeams.value.length} équipes chargées`)
    searchQuery.value = '' // Réinitialiser la recherche
  } catch (err) {
    error.value = 'Erreur lors du chargement des équipes'
    console.error('Error loading teams:', err)
    allTeams.value = []
  } finally {
    isLoadingTeams.value = false
  }
}

/**
 * Définit l'équipe favorite
 */
const selectTeam = (teamId: number) => {
  authStore.setFavoriteTeam(teamId)
}

/**
 * Retire l'équipe favorite
 */
const removeFavorite = () => {
  authStore.setFavoriteTeam(null)
}

/**
 * Retour au calendrier
 */
const goBack = () => {
  router.back()
}

/**
 * Déconnexion
 */
const logout = () => {
  authStore.logout()
  router.push('/login')
}

onMounted(() => {
  loadTeams(selectedLeagueId.value)
})
</script>

<template>
  <div class="profile-container">
    <!-- Header -->
    <header class="profile-header">
      <div class="header-content">
        <button class="back-button" @click="goBack">← Retour</button>
        <h1>👤 Mon Profil</h1>
        <button class="logout-btn" @click="logout">Déconnexion</button>
      </div>
    </header>

    <!-- Profile Content -->
    <main class="profile-main">
      <!-- User Info -->
      <section class="user-section">
        <h2>Informations Utilisateur</h2>
        <div class="user-info">
          <div class="info-item">
            <span class="label">Utilisateur :</span>
            <span class="value">{{ authStore.user?.username }}</span>
          </div>
          <div class="info-item">
            <span class="label">Email :</span>
            <span class="value">{{ authStore.user?.email || 'Non défini' }}</span>
          </div>
        </div>
      </section>

      <!-- Favorite Team Section -->
      <section class="favorite-team-section">
        <h2>⚽ Mon Équipe Favorite</h2>

        <!-- Current Favorite -->
        <div v-if="selectedTeam" class="current-favorite">
          <div class="favorite-card">
            <img :src="selectedTeam.team.logo" :alt="selectedTeam.team.name" class="team-logo-large" />
            <div class="team-info">
              <h3>{{ selectedTeam.team.name }}</h3>
              <p>{{ selectedTeam.team.country }}</p>
            </div>
            <button class="remove-btn" @click="removeFavorite">✕ Changer</button>
          </div>
        </div>

        <!-- Select Team -->
        <div v-else class="select-team">
          <p>Sélectionnez votre équipe favorite</p>
        </div>

        <!-- League Selector -->
        <div class="league-selector">
          <h3>Choisir une Ligue :</h3>
          <div class="league-buttons">
            <button
              v-for="league in popularLeagues"
              :key="league.id"
              class="league-btn"
              :class="{ active: selectedLeagueId === league.id }"
              @click="loadTeams(league.id)"
            >
              {{ league.name }}
            </button>
          </div>
        </div>

        <!-- Search -->
        <div class="search-box">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Chercher une équipe..."
            class="search-input"
          />
        </div>

        <!-- Loading State -->
        <div v-if="isLoadingTeams" class="loading">
          <p>⏳ Chargement des équipes...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="error-message">
          ⚠️ {{ error }}
        </div>

        <!-- Teams Grid -->
        <div v-else class="teams-grid">
          <button
            v-for="team in filteredTeams"
            :key="team.team.id"
            class="team-card"
            :class="{ selected: authStore.favoriteTeamId === team.team.id }"
            @click="selectTeam(team.team.id)"
          >
            <img :src="team.team.logo" :alt="team.team.name" class="team-logo" />
            <span class="team-name">{{ team.team.name }}</span>
            <span v-if="authStore.favoriteTeamId === team.team.id" class="checkmark">✓</span>
          </button>
        </div>

        <!-- Empty State -->
        <div v-if="filteredTeams.length === 0 && !isLoadingTeams && !error" class="empty-state">
          <p>Aucune équipe trouvée</p>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
.profile-container {
  min-height: 100vh;
  background: linear-gradient(to bottom, #f5f5f5, #ffffff);
}

.profile-header {
  background: var(--gradient-primary);
  color: white;
  padding: 30px 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
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
  order: -1;
}

.back-button:hover {
  background-color: rgba(255, 255, 255, 0.3);
}

.profile-header h1 {
  margin: 0;
  font-size: 28px;
}

.logout-btn {
  padding: 10px 20px;
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
}

.logout-btn:hover {
  background-color: rgba(255, 255, 255, 0.3);
}

.profile-main {
  padding: 40px 20px;
  max-width: 1200px;
  margin: 0 auto;
}

section {
  background: white;
  border-radius: 10px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

section h2 {
  margin-top: 0;
  margin-bottom: 25px;
  color: #333;
  font-size: 22px;
  border-bottom: 2px solid var(--color-primary);
  padding-bottom: 10px;
}

/* User Section */
.user-info {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 12px;
  background: #f9f9f9;
  border-radius: 5px;
}

.label {
  font-weight: 600;
  color: var(--color-primary);
  min-width: 100px;
}

.value {
  color: #333;
}

/* Favorite Team Section */
.current-favorite {
  margin-bottom: 30px;
}

.favorite-card {
  background: var(--gradient-primary);
  color: white;
  padding: 25px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 20px;
  position: relative;
}

.team-logo-large {
  width: 80px;
  height: 80px;
  object-fit: contain;
}

.favorite-card .team-info {
  flex: 1;
}

.favorite-card h3 {
  margin: 0;
  font-size: 24px;
}

.favorite-card p {
  margin: 5px 0 0 0;
  opacity: 0.9;
}

.remove-btn {
  padding: 10px 15px;
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
}

.remove-btn:hover {
  background-color: rgba(255, 255, 255, 0.3);
}

.select-team {
  background: #f0f0f0;
  padding: 20px;
  border-radius: 5px;
  text-align: center;
  color: #999;
  margin-bottom: 30px;
}

/* League Selector */
.league-selector {
  margin-bottom: 30px;
}

.league-selector h3 {
  margin: 0 0 15px 0;
  color: #333;
}

.league-buttons {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 10px;
}

.league-btn {
  padding: 10px;
  background: #f0f0f0;
  border: 2px solid #ddd;
  border-radius: 5px;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.3s;
  font-weight: 500;
}

.league-btn:hover {
  border-color: var(--color-primary);
  background: #f9f9f9;
}

.league-btn.active {
  background: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}

/* Search Box */
.search-box {
  margin-bottom: 30px;
}

.search-input {
  width: 100%;
  padding: 12px 15px;
  border: 2px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
  transition: border 0.3s;
}

.search-input:focus {
  outline: none;
  border-color: var(--color-primary);
}

/* Teams Grid */
.teams-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 15px;
}

.team-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 20px;
  background: #f9f9f9;
  border: 2px solid #ddd;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
  min-height: 160px;
}

.team-card:hover {
  border-color: var(--color-primary);
  background: #f0f0f8;
  transform: translateY(-2px);
}

.team-card.selected {
  border-color: #2ed573;
  background: rgba(46, 213, 115, 0.1);
}

.team-logo {
  width: 60px;
  height: 60px;
  object-fit: contain;
}

.team-name {
  text-align: center;
  font-size: 13px;
  font-weight: 500;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.checkmark {
  position: absolute;
  top: 5px;
  right: 5px;
  background: #2ed573;
  color: white;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
}

/* Loading & Error States */
.loading,
.error-message,
.empty-state {
  text-align: center;
  padding: 40px;
  background: #f9f9f9;
  border-radius: 8px;
  color: #666;
}

.error-message {
  background: #fadbd8;
  color: var(--color-error);
}

/* Responsive */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }

  .favorite-card {
    flex-direction: column;
    text-align: center;
  }

  .favorite-card .remove-btn {
    width: 100%;
  }

  .profile-main {
    padding: 20px 10px;
  }

  section {
    padding: 20px;
  }

  .league-buttons {
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  }

  .teams-grid {
    grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
    gap: 10px;
  }

  .team-card {
    min-height: 140px;
    padding: 15px;
  }

  .team-logo {
    width: 50px;
    height: 50px;
  }
}
</style>
