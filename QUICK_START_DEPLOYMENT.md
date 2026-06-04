# 🚀 Guide Rapide de Déploiement

## ⚡ Déploiement en 5 Minutes

### 1️⃣ Préparer Git et GitHub

```bash
# Initialiser Git (si pas déjà fait)
git init
git add .
git commit -m "Initial commit: NovaBank ready for deployment"

# Créer un repository sur GitHub, puis :
git remote add origin https://github.com/VOTRE_USERNAME/VOTRE_REPO.git
git branch -M main
git push -u origin main
```

### 2️⃣ Déployer sur Vercel

1. **Aller sur [vercel.com](https://vercel.com)** et se connecter avec GitHub
2. **Cliquer sur "Add New Project"**
3. **Sélectionner votre repository**
4. **Configurer les variables d'environnement :**

```
VITE_SUPABASE_URL=votre_url_supabase
VITE_SUPABASE_ANON_KEY=votre_anon_key
SUPABASE_SERVICE_ROLE_KEY=votre_service_role_key
CRON_SECRET=votre_secret_aleatoire
```

**Où trouver ces valeurs :**
- **Supabase** → Settings → API → `Project URL` et `anon public` key
- **Supabase** → Settings → API → `service_role` key (⚠️ Secret !)
- **CRON_SECRET** : Générez avec `openssl rand -hex 32` ou [random.org](https://www.random.org/strings/)

5. **Cliquer sur "Deploy"**

### 3️⃣ Exécuter le Script SQL

1. **Aller sur Supabase** → SQL Editor
2. **Ouvrir** `scripts/optimize-chat-storage.sql`
3. **Copier-coller** le contenu
4. **Exécuter** le script

### 4️⃣ Vérifier les Cron Jobs

1. **Vercel Dashboard** → Votre projet → **Settings** → **Cron Jobs**
2. **Vérifier** que les 3 cron jobs sont listés :
   - `archive-messages` (tous les jours à 2h)
   - `cleanup-read-messages` (tous les 3 jours à 3h)
   - `delete-very-old-messages` (le 1er du mois à 4h)

### 5️⃣ Tester

```bash
# Tester manuellement un cron job
curl -X GET "https://VOTRE_URL_VERCEL/api/cron/archive-messages" \
  -H "Authorization: Bearer VOTRE_CRON_SECRET"
```

## ✅ C'est Fait !

Votre application est maintenant :
- ✅ Déployée sur Vercel
- ✅ Connectée à GitHub (déploiement automatique)
- ✅ Archivage automatique configuré
- ✅ Nettoyage automatique configuré

## 📚 Documentation Complète

Pour plus de détails, consultez [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

