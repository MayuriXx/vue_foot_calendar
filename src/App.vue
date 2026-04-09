<script setup lang="ts">
import { ref, onMounted } from 'vue'
import LoginPage from './components/LoginPage.vue'
import HelloWorld from './components/HelloWorld.vue'

const isLoggedIn = ref(false)
const username = ref('')

onMounted(() => {
  const loggedIn = localStorage.getItem('isLoggedIn')
  const user = localStorage.getItem('user')
  
  if (loggedIn === 'true' && user) {
    isLoggedIn.value = true
    username.value = user
  }
})

const handleLogout = () => {
  localStorage.removeItem('isLoggedIn')
  localStorage.removeItem('user')
  isLoggedIn.value = false
  username.value = ''
}
</script>

<template>
  <LoginPage v-if="!isLoggedIn" />
  <div v-else class="app-main">
    <header class="app-header">
      <h2>Football Calendar</h2>
      <div class="user-section">
        <span class="username">Bienvenue, {{ username }}</span>
        <button @click="handleLogout" class="logout-button">Déconnexion</button>
      </div>
    </header>
    <main>
      <HelloWorld />
    </main>
  </div>
</template>

<style scoped>
.app-main {
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

.app-header h2 {
  margin: 0;
  font-size: 24px;
}

.user-section {
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

main {
  padding: 20px;
}
</style>
