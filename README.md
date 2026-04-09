# 📅 Vue Football Calendar

Une application de calendrier football moderne construite avec **Vue 3**, **TypeScript**, **Vite**, **Pinia** et **Vue Router**.

Comprend un système d'authentification complet avec stockage persistant et routes protégées.

---

## 🎯 Fonctionnalités

- ✅ **Système d'authentification** - Page de connexion avec validation
- ✅ **State Management** - Pinia pour la gestion d'état globale
- ✅ **Route Protection** - Guards pour les routes authentifiées
- ✅ **TypeScript** - Typage fort tout au long du projet
- ✅ **Persistance** - LocalStorage pour session utilisateur
- ✅ **Architecture modulaire** - Structure claire et scalable

---

## 📁 Structure du Projet

```text
src/
├── stores/                      # État global avec Pinia
│   └── auth.ts                  # Store authentification (user, token, isLoading)
│
├── services/                    # Services métier
│   ├── auth.service.ts          # Logique d'authentification
│   └── football.service.ts      # Client API-Football
│
├── composables/                 # Hooks réutilisables
│   └── useFootball.ts           # État et logique des matchs
│
├── views/                       # Pages principales (avec router)
│   ├── LoginView.vue            # Page de connexion
│   └── CalendarView.vue         # Calendrier avec matchs API-Football
│
├── components/                  # Composants réutilisables
│   └── (à remplir)              # Ex: CalendarCard, EventCard, etc.
│
├── router/                      # Configuration Vue Router
│   └── index.ts                 # Routes + guards
│
├── types/                       # Types TypeScript
│   ├── user.ts                  # Types authentification
│   └── football.ts              # Types API-Football
│
├── App.vue                      # App racine avec router-view
└── main.ts                      # Point d'entrée (Pinia + Router)
```

---

## 🔐 Flux d'Authentification

```text
Visite l'app
    ↓
Router guard vérifie si authentifié
    ↓
Si NON → Redirige vers /login
Si OUI → Affiche CalendarView
    ↓
Utilisateur rentre login + mot de passe
    ↓
authService.login() simule appel API
    ↓
Si succès → Store auth.ts sauvegarde user + token
           → localStorage persiste les données
           → Router redirige vers /calendar
    ↓
Bouton déconnexion → logout() nettoie tout
```

---

## 📦 Installation

### Prérequis

- Node.js 18+
- npm ou yarn

### Commandes

```bash
# 1. Installer les dépendances
npm install

# 2. Lancer le serveur de développement
npm run dev

# 3. Builder pour la production
npm run build

# 4. Prévisualiser la build
npm run preview
```

---

## 🚀 Comment ça Marche

### 1️⃣ **Le Store d'Authentification** (`stores/auth.ts`)

Gère l'état global de l'authentification avec Pinia :

```typescript
import { useAuthStore } from '@/stores/auth'

// Dans un composant
const authStore = useAuthStore()

// Accédez à l'état
console.log(authStore.user)          // { id, username, email }
console.log(authStore.isAuthenticated) // true/false
console.log(authStore.isLoading)     // true/false pendant une requête

// Actions disponibles
await authStore.login({ username: 'john', password: '1234' })
authStore.logout()
authStore.initializeAuth()  // Charge l'auth depuis localStorage
```

### 2️⃣ **Le Service d'Authentification** (`services/auth.service.ts`)

Logique métier pour la connexion :

```typescript
import authService from '@/services/auth.service'

const response = await authService.login(credentials)
// { success: true/false, message: string, user?, token? }

authService.logout()
const user = authService.getCurrentUser()
const isAuth = authService.isAuthenticated()
```

### 3️⃣ **Vue Router avec Guards** (`router/index.ts`)

Protège les routes et redirige automatiquement :

```typescript
// Routes disponibles
- /login    → Page connexion (accessible sans auth)
- /calendar → Page calendrier (nécessite auth)
- /         → Redirige vers /calendar
```

Le `beforeEach` hook protège les routes :

- Si vous accédez `/calendar` sans auth → Redirect `/login`
- Si vous accédez `/login` avec auth → Redirect `/calendar`

### 4️⃣ **Composable Football** (`composables/useFootball.ts`)

Récupère et organise les données de l'API-Football :

```typescript
import { useFootball } from '@/composables/useFootball'

const { 
  matches,           // Tous les matchs
  isLoading,         // État du chargement
  error,             // Messages d'erreur
  liveMatches,       // Matchs en direct
  upcomingMatches,   // Matchs à venir
  finishedMatches,   // Matchs terminés
  loadTodayMatches,  // Charge les matchs du jour
  loadMatchesByDateRange,
  loadTeamMatches,
  loadLeagueMatches,
} = useFootball()
```

---

## 🧪 Essayer la Démo

Après `npm run dev`, l'app sera disponible sur `http://localhost:5173`

### Identifiants de test (mode démo)

- **Utilisateur** : N'importe quel nom (ex: `john`, `alice`)
- **Mot de passe** : Minimum 3 caractères (ex: `1234`, `password`)

### Flux de test

1. Ouvrir l'app → Vous êtes redirigé vers `/login`
2. Entrer `test` / `1234` → Connexion simule 1 seconde
3. Page calendrier s'affiche → Matchs de l'API-Football chargés
4. Rafraîchir la page → Vous restez connecté (localStorage)
5. Cliquer "Déconnexion" → Retour au login

---

## 🌐 Données Provenant de l'API-Football

Toutes les données de matchs proviennent de [api-football.com](https://www.api-football.com/) :

- ✅ Matchs en direct et à venir
- ✅ Résultats et scores
- ✅ Équipes et ligues
- ✅ Logos et informations officielles

Les données sont récupérées automatiquement au chargement de la page calendrier via `useFootball()`.

---

## 📝 Types Disponibles

```typescript
// src/types/user.ts

interface User {
  id: string
  username: string
  email?: string
}

interface LoginCredentials {
  username: string
  password: string
}

interface AuthResponse {
  success: boolean
  message: string
  user?: User
  token?: string
}
```

---

## 🛠️ Dépendances Principales

| Package | Version | Usage |
| --- | --- | --- |
| `vue` | ^3.5.32 | Framework UI |
| `pinia` | Latest | State Management |
| `vue-router` | Latest | Routing |
| `axios` | Latest | Requêtes HTTP |
| `typescript` | ~6.0.2 | Typage |

---

## 📚 Prochaines Étapes

- [ ] Connecter une vrai API d'authentification
- [ ] Ajouter un calendrier fonctionnel
- [ ] Gérer les erreurs API plus robustement
- [ ] Ajouter des notifications (toasts)
- [ ] Implémenter un refresh token
- [ ] Ajouter des tests unitaires
- [ ] Design responsive mobile

---

## 💡 IDE Support

Pour la meilleure expérience de développement, installez :

- **VSCode** + **Volar** extension (remplace Vetur)
- **TypeScript Vue Plugin** (Volar)

---

## 📄 License

MIT
