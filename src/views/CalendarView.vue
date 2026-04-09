<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const handleLogout = async () => {
  authStore.logout()
  await router.push('/login')
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
      <div class="placeholder">
        <h2>Calendrier du football</h2>
        <p>La page calendrier sera implémentée ici</p>
        <p class="user-info">Utilisateur connecté: <strong>{{ authStore.user?.username }}</strong></p>
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
  padding: 40px 20px;
}

.placeholder {
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
  padding: 40px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.placeholder h2 {
  color: #333;
  margin-bottom: 10px;
}

.placeholder p {
  color: #666;
  margin: 10px 0;
}

.user-info {
  margin-top: 20px;
  font-size: 14px;
  color: #667eea;
}

.user-info strong {
  color: #764ba2;
}
</style>
