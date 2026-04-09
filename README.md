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
│   ├── useFootball.ts           # État et logique des matchs
│   └── useMatchDetail.ts        # État et logique des détails d'un match
│
├── views/                       # Pages principales (avec router)
│   ├── LoginView.vue            # Page de connexion
│   ├── CalendarView.vue         # Calendrier avec matchs (utilise MatchCard)
│   └── MatchDetailView.vue      # Détails d'un match (composé de sous-composants)
│
├── components/                  # Composants réutilisables
│   ├── MatchCard.vue            # Carte affichant un match
│   ├── MatchHeader.vue          # En-tête du match (teams, score, date, venue)
│   ├── ScoresSection.vue        # Section scores (mi-temps, temps réglementaire, etc.)
│   ├── StatisticsSection.vue    # Section statistiques (possession, tirs, etc.)
│   ├── EventsTimeline.vue       # Timeline des événements du match
│   ├── EventItem.vue            # Événement individuel (goal, card, subst)
│   ├── LineupsSection.vue       # Section formations des deux équipes
│   ├── TeamLineup.vue           # Formation d'une équipe
│   └── PlayersList.vue          # Liste de joueurs (titulaires ou remplaçants)
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

### 5️⃣ **Architecture Composante Modulaire**

La vue `MatchDetailView` utilise une architecture composante pour une meilleure réutilisabilité :

```typescript
// MatchDetailView.vue utilise ces composants :
<MatchHeader :match="match" />              <!-- En-tête du match -->
<ScoresSection :match="match" />            <!-- Scores (mi-temps, etc.) -->
<StatisticsSection :statistics="statistics" /> <!-- Statistiques -->
<EventsTimeline :events="events" />         <!-- Timeline des événements -->
<LineupsSection :lineups="lineups" />       <!-- Formations -->
```

Chaque composant :

- ✅ Est indépendant et testable
- ✅ Reçoit des props typées
- ✅ Gère son propre rendu
- ✅ Peut être réutilisé ailleurs

**Composants Disponibles** :

| Composant | Props | Usage |
| --- | --- | --- |
| `MatchCard` | `match`, `isLiveMatch?`, `isPastMatch?` | Affiche un match en carte (calendrier) |
| `MatchHeader` | `match` | En-tête du match (teams, score) |
| `ScoresSection` | `match` | Scores détaillés (mi-temps, FT, etc.) |
| `StatisticsSection` | `statistics` | Comparaison stats des deux équipes |
| `EventsTimeline` | `events` | Timeline interactive des événements |
| `EventItem` | `event` | Événement individuel (goal, card, sub) |
| `LineupsSection` | `lineups` | Container pour les formations |
| `TeamLineup` | `lineup` | Formation d'une équipe avec joueurs |
| `PlayersList` | `title`, `players`, `isSubstitute?` | Liste réutilisable de joueurs |

### 6️⃣ **Flux d'Utilisation des Composants**

```text
CalendarView.vue
    ↓
    └─→ MatchCard.vue × N
            ↓ (click) → /match/:fixtureId
            
MatchDetailView.vue
    ↓
    ├─→ MatchHeader.vue
    ├─→ ScoresSection.vue
    ├─→ StatisticsSection.vue
    ├─→ EventsTimeline.vue
    │   └─→ EventItem.vue × N
    └─→ LineupsSection.vue
        └─→ TeamLineup.vue × 2
            └─→ PlayersList.vue × 2
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

- [x] Créer une page de connexion avec validation
- [x] Implémenter Pinia pour la gestion d'état
- [x] Configurer Vue Router avec guards
- [x] Intégrer l'API-Football pour les données live
- [x] Créer une architecture modulaire avec composants
- [ ] Connecter une vrai API d'authentification
- [ ] Ajouter des filtres de calendrier avancés
- [ ] Gérer les erreurs API plus robustement
- [ ] Ajouter des notifications (toasts)
- [ ] Implémenter un refresh token
- [ ] Ajouter des tests unitaires (Vitest)
- [ ] Design responsive mobile (optimiser pour petits écrans)
- [ ] Ajouter des animations de transition entre pages

---

## 💡 IDE Support

Pour la meilleure expérience de développement, installez :

- **VSCode** + **Volar** extension (remplace Vetur)
- **TypeScript Vue Plugin** (Volar)

---

## 📄 License

MIT
