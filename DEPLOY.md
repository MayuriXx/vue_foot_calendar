# Configuration GitHub Actions & Déploiement

## 📋 Prérequis

1. **Compte GitHub** avec votre repo
2. **Clé API** de [api-sports.io](https://api-sports.io)

---

## 🔑 Étape 1: Configurer les Secrets GitHub

1. Allez sur votre repo GitHub
2. **Settings** → **Secrets and variables** → **Actions**
3. Cliquez sur **New repository secret**
4. Ajoutez 2 secrets:

### Secret 1

- **Name:** `VITE_API_FOOTBALL_KEY`
- **Value:** Votre clé API (ex: `abc123xyz...`)

### Secret 2

- **Name:** `VITE_API_FOOTBALL_HOST`
- **Value:** `v3.football.api-sports.io`

---

## 💻 Étape 2: Configuration Local

```bash
# Copier l'exemple
cp .env.example .env.local

# Ajouter votre clé API dans .env.local
VITE_API_FOOTBALL_KEY=votre_clé_ici
VITE_API_FOOTBALL_HOST=v3.football.api-sports.io
```

⚠️ **Important:** `.env.local` est dans `.gitignore` - Ne le commitez jamais!

---

## 🚀 Étape 3: Activer GitHub Pages

1. Allez sur votre repo
2. **Settings** → **Pages**
3. **Build and deployment**
   - Source: **GitHub Actions** ✅
   - (Le workflow est déjà configuré)

---

## ✅ Étape 4: Deployment Automatique

Dès que vous poussez sur `main` ou `master`:

```bash
git add .
git commit -m "Deploy app"
git push origin main
```

**Le workflow s'exécute automatiquement!**

Allez à l'onglet **Actions** pour voir le statut en direct.

---

## 📱 Accéder à l'App

Une fois déployée:

```
https://votreusername.github.io/vue_foot_calendar/
```

---

## 🔄 Redéployer Manuellement

1. Allez à **Actions** dans votre repo
2. Choisissez le workflow **Deploy to GitHub Pages**
3. Cliquez **Run workflow**

---

## ⚠️ Troubleshooting

### "API key not configured"

- Vérifie que les secrets sont bien ajoutés
- Redéploie pour appliquer les changements

### Page 404

- Vérifie que `base: '/vue_foot_calendar/'` est dans `vite.config.ts`
- Remplace `vue_foot_calendar` par le nom exact de ton repo si c'est différent

### Build échoue

- Regarde l'onglet **Actions** > logs du workflow
- Vérifie que `npm run build` fonctionne localement

---

## 📝 Commandes Utiles

```bash
# Build local
npm run build

# Preview du build
npm run preview

# Dev local
npm run dev
```

---

Voilà! Ton app sera déployée automatiquement! 🎉
