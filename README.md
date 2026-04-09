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
- ✅ **Calendrier avec filtres** - Catégorisation par pays, championnat, statut
- ✅ **Détails des matchs** - Scores, statistiques, événements, formations
- ✅ **Classement en direct** - Standings actualisé avec mise en évidence des équipes
- ✅ **API-Football intégrée** - Données live en temps réel
- ✅ **Optimisation API** - Cache localStorage + Lazy loading pour économiser les requêtes
- ✅ **Équipe Favorite** - Sélection et mise en avant des matchs de l'équipe préférée
- ✅ **Page Profil** - Gestion des préférences utilisateur

---

## 🚀 Optimisation API - Limiter les Requêtes

Avec la limite de 100 requêtes/jour sur API-Football v3, l'app implémente **3 stratégies** pour réduire la consommation :

### 1️⃣ Cache localStorage (2-4h)

Les données sont automatiquement mises en cache avec un TTL :

| Donnée | TTL | Cas d'usage |
| --- | --- | --- |
| **Matchs d'aujourd'hui** | 60 min | Scores peuvent changer (LIVE) |
| **Matchs futurs** | 120 min | Données stables |
| **Standings (LIVE)** | 30 min | Classement très dynamique |
| **Standings (autres)** | 120 min | Voir l'historique |

Quand des données existent en cache et ne sont pas expirées :

- ✅ Données servies **instantanément** du localStorage
- ✅ **Pas d'appel API effectué**
- ✅ Parfait pour les rafraîchissages de page

### 2️⃣ Lazy Loading des Standings

Le classement n'est **pas chargé automatiquement** sur la page de détail d'un match :

- **Intercepteur de scroll** : Standings chargé seulement quand l'utilisateur scroll jusqu'à la section
- **Fallback (2 sec)** : Si pas de scroll, les standings se chargent après 2 secondes
- **Résultat** : -1 requête par page de détail (économie de 10-15% des requêtes)

### 3️⃣ TTL Adaptatif

Le TTL du cache change selon le statut du match :

```typescript
// Matchs EN DIRECT - 30 min
// → Classements changent rapidement (buts, cards)

// Matchs À VENIR - 120 min  
// → Données stables jusqu'à démarrage

// Matchs TERMINÉS - 120 min
// → Classement ne changera plus
```

### 📊 Estimation de réduction

Avant optimisation (usage intensif des filtres) :

- ~90-100 requêtes/jour → Dépassement du quota

Après optimisations :

- ✅ **~30-40 requêtes/jour** → 60-70% de réduction
- ✅ Cachées : 5-10 requêtes économisées par utilisateur/jour
- ✅ Lazy loading standings : 2-3 requêtes économisées

### 🔧 Debugging - Voir le cache

Dans la console du navigateur :

```javascript
// Vérifier le cache
import cacheService from '@/services/cache.service'
cacheService.getStats()  // { totalEntries: 5, storageUsed: "45.23 KB" }

// Vider le cache manuellement
cacheService.clear()
```

Logs automatiques lors du chargement :

```
✓ Matchs aujourd'hui mis en cache (60 min)
ℹ️ Matchs aujourd'hui chargés du cache
✓ Standings Premier League mis en cache (30 min)
```

---

## 📁 Structure du Projet

```text
src/
├── stores/                      # État global avec Pinia
│   └── auth.ts                  # Store authentification (user, token, isLoading)
│
├── services/                    # Services métier
│   ├── auth.service.ts          # Logique d'authentification
│   ├── football.service.ts      # Client API-Football
│   └── cache.service.ts         # Cache localStorage avec TTL
│
├── composables/                 # Hooks réutilisables
│   ├── useFootball.ts           # État et logique des matchs
│   └── useMatchDetail.ts        # État et logique des détails d'un match
│
├── views/                       # Pages principales (avec router)
│   ├── LoginView.vue            # Page de connexion
│   ├── CalendarView.vue         # Calendrier avec matchs (utilise MatchCard)
│   ├── MatchDetailView.vue      # Détails d'un match (composé de sous-composants)
│   └── ProfileView.vue          # Page profil utilisateur (équipe favorite)
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
│   ├── PlayersList.vue          # Liste de joueurs (titulaires ou remplaçants)
│   └── StandingsSection.vue     # Classement en direct du championnat
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

Récupère, organise et filtre les données de l'API-Football :

```typescript
import { useFootball } from '@/composables/useFootball'

const { 
  // État
  matches,           // Tous les matchs bruts
  isLoading,         // État du chargement
  error,             // Messages d'erreur
  
  // Filtres (réactifs)
  selectedStatus,    // 'all' | 'live' | 'upcoming' | 'finished'
  selectedCountry,   // Nom du pays ou 'all'
  selectedLeague,    // ID|Name de la ligue ou 'all'
  
  // Listes pour les selects
  countries,         // Array de pays disponibles
  leagues,           // Array de ligues (filtrées par pays)
  
  // Données filtrées
  filteredMatches,        // Matchs qui répondent aux critères
  filteredMatchesByLeague, // Matchs filtrés regroupés par ligue
  
  // Données sans filtrage
  matchesByLeague,   // Tous les matchs groupés par ligue
  liveMatches,       // Tous les matchs en direct
  upcomingMatches,   // Tous les matchs à venir
  finishedMatches,   // Tous les matchs terminés
  
  // Méthodes
  loadTodayMatches,  // Charge les matchs du jour
  loadMatchesByDateRange,
  loadTeamMatches,
  loadLeagueMatches,
  resetFilters,      // Réinitialise tous les filtres
} = useFootball()
```

**Utilisation dans CalendarView** :

```vue
<!-- Affiche les filtres -->
<select v-model="selectedStatus">
  <option value="all">Tous les statuts</option>
  <option value="live">En direct</option>
  <option value="upcoming">À venir</option>
  <option value="finished">Terminés</option>
</select>

<select v-model="selectedCountry" @change="selectedLeague = 'all'">
  <option value="all">Tous les pays</option>
  <option v-for="country in countries" :value="country">{{ country }}</option>
</select>

<select v-model="selectedLeague">
  <option value="all">Tous les championnats</option>
  <option v-for="league in leagues" :value="league">
    {{ league.split('|')[1] }}
  </option>
</select>

<!-- Affiche les matchs filtrés -->
<div v-for="league in filteredMatchesByLeague" :key="league.id">
  <!-- Contenu de la ligue -->
</div>

<!-- Réinitialise les filtres -->
<button @click="resetFilters">Réinitialiser</button>
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

## 🌍 Catégorisation par Championnat

L'application affiche automatiquement les matchs **organisés par championnat/pays** :

- 🇬🇧 **Premier League** (England)
- 🇪🇸 **La Liga** (Spain)  
- 🇮🇹 **Serie A** (Italy)
- 🇩🇪 **Bundesliga** (Germany)
- 🇫🇷 **Ligue 1** (France)
- *...et autres championats disponibles à l'API*

Lors du chargement des matchs, chaque championnat affiche :

- ✅ **Drapeau du pays** - Identifie le pays
- ✅ **Logo du championnat** - Identifie la ligue
- ✅ **Nom du pays et du championnat** - Texte descriptif
- ✅ **Nombres de matchs** - Total des matchs dans ce championnat
- ✅ **Sections par statut** - Matchs groupés en *En direct / À venir / Terminés*

Les matchs sont automatiquement **triés par pays puis par nom de ligue** pour une meilleure organisation.

---

## 🔍 Filtres Dynamiques

L'application propose **3 niveaux de filtrage** pour affiner l'affichage des matchs :

### 1️⃣ **Filtre par Statut**

- 🔴 **En direct** - Matchs en cours
- ⏰ **À venir** - Matchs futurs
- ✅ **Terminés** - Matchs passés
- Tous les statuts (défaut)

### 2️⃣ **Filtre par Pays**

- Sélectionnez un pays pour voir uniquement ses championnats
- Liste générée automatiquement depuis les données
- Le filtre de ligue se réinitialise quand vous changez de pays
- Option "Tous les pays" (défaut)

### 3️⃣ **Filtre par Championnat**

- Sélectionnez une ligue spécifique
- La liste s'adapte selon le pays sélectionné
- Option "Tous les championnats" (défaut)

### 🔄 **Bouton Réinitialiser**

- Restaure tous les filtres à leurs valeurs par défaut

**Exemple** : Regarder les matchs **terminés** de la **Premier League** :

1. Statut → ✅ Terminés
2. Pays → England
3. Championnat → Premier League
4. Les matchs affichés seront uniquement ceux de la PL qui sont terminés

**À savoir** :

- Les trois filtres fonctionnent ensemble (ET logique)
- L'interface affiche "Aucun match correspondant aux critères" si aucun match ne match
- Les filtres sont conservés lors de la navigation (state local)

---

## 🏆 Classement en Direct

Sur la **page de détail d'un match**, le **classement en direct du championnat** s'affiche automatiquement, quel que soit le statut du match :

- ✅ Matchs **en direct** (LIVE)
- ✅ Matchs **à venir** (UPCOMING)
- ✅ Matchs **terminés** (FINISHED)

### Affichage du Classement

Le tableau montre :

| Colonne | Description |
| --- | --- |
| **Pos** | Position dans le classement |
| **Équipe** | Logo + nom de l'équipe |
| **J** | Matchs joués |
| **G** | Victoires |
| **N** | Nuls |
| **P** | Défaites |
| **Diff** | Différence de buts (+/- vert/rouge) |
| **Pts** | Points accumulés |

### Mise en Évidence

- 🟢 **Équipe à domicile** (Home) - Bordure verte + fond clair
- 🔵 **Équipe en déplacement** (Away) - Bordure bleue + fond clair

Le système met automatiquement en évidence les deux équipes du match pour voir rapidement leur positionnement dans le classement.

### Exemple

Pour le match Tottenham vs Liverpool en Premier League :

- La ligne de **Tottenham** s'affiche avec une **bordure verte**
- La ligne de **Liverpool** s'affiche avec une **bordure bleue**
- Les autres équipes du classement sont affichées en contexte

### Gestion des Erreurs

Si le classement n'est pas disponible pour une ligue spécifique, un message explicite s'affiche :

```
Classement non disponible pour cette ligue
```

Cela peut se produire pour :

- Les ligues régionales ou divisions mineures non supportées par l'API-Football
- Les futurs championnats (absence de classement établi)
- Les problèmes de connectivité temporaires

Le classement est mis à jour **en temps réel** depuis l'API-Football v3 et reflète l'état actuel du championnat.

---

## ⚽ Équipe Favorite

Chaque utilisateur peut sélectionner et suivre **son équipe favorite**.

### 📍 Où configurer ?

**Page de Profil** (`/profile`) - Accessible via le bouton **👤 Profil** en haut à droite du calendrier.

### ✨ Fonctionnalités

1. **Sélectionner une équipe**
   - Parcourir 5 ligues majeures : Premier League, La Liga, Serie A, Bundesliga, Ligue 1
   - Chercher une équipe par son nom
   - Voir la liste complète de toutes les équipes

2. **Mise en avant sur le calendrier**
   - Les matchs de votre équipe favorite sont **surlignés en vert** 📊
   - Bordure verte + fond clair pour une visibilité maximale
   - La carte du match est légèrement agrandie pour attirer l'attention

3. **Persistance**
   - Votre sélection est automatiquement sauvegardée dans localStorage
   - Même après un rafraîchissement de page, votre équipe reste sélectionnée

### 🎨 Visuel

**Avant sélection :**

- Matchs affichés en couleur standard (bordure bleue)

**Après sélection (ex: Liverpool) :**

- Tous les matchs impliquant Liverpool affichent :
  - ✅ Bordure verte (#2ed573)
  - ✅ Fond vert clair (10% opacité)
  - ✅ Légère agrandissement au hover
  - ✅ Shadow verte pour effet de profondeur

### 🔄 Changer d'équipe

Sur la page de profil :

1. Si une équipe est déjà sélectionnée, cliquer le bouton **✕ Changer**
2. Sélectionner une nouvelle équipe
3. La mise en avant se met à jour instantanément sur le calendrier

### 📋 Infos Utilisateur

La page de profil affiche aussi :

- Votre nom d'utilisateur
- Votre email (si disponible)
- Votre équipe favorite actuellement sélectionnée

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
- [x] Catégoriser les matchs par championnat/pays
- [x] Ajouter des filtres par statut, pays et championnat
- [x] Afficher le classement en direct du championnat
- [x] Ajouter une équipe favorite (avec mise en avant sur le calendrier)
- [x] Créer une page de profil utilisateur
- [x] Optimisation API (cache + lazy loading)
- [ ] Connecter une vrai API d'authentification
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
