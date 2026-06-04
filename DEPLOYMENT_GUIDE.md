# 🚀 Guide de Déploiement - GitHub + Vercel

Ce guide vous accompagne étape par étape pour déployer NovaBank sur GitHub et Vercel avec archivage automatique.

## 📋 Prérequis

- Compte GitHub
- Compte Vercel (gratuit)
- Compte Supabase (gratuit)
- Git installé sur votre machine

## 🔧 Étape 1 : Préparer le Projet Git

### 1.1 Initialiser Git (si pas déjà fait)

```bash
# Vérifier si Git est déjà initialisé
git status

# Si erreur, initialiser Git
git init
```

### 1.2 Vérifier le .gitignore

Assurez-vous que votre `.gitignore` contient :
```
node_modules
dist
.env
.env.local
*.log
```

### 1.3 Ajouter tous les fichiers

```bash
git add .
git commit -m "Initial commit: NovaBank application"
```

## 📦 Étape 2 : Créer le Repository GitHub

### 2.1 Créer un nouveau repository sur GitHub

1. Allez sur [GitHub.com](https://github.com)
2. Cliquez sur **"New repository"**
3. Nommez-le (ex: `novabank`)
4. **Ne cochez PAS** "Initialize with README"
5. Cliquez sur **"Create repository"**

### 2.2 Lier le projet local à GitHub

```bash
# Remplacez USERNAME et REPO_NAME par vos valeurs
git remote add origin https://github.com/USERNAME/REPO_NAME.git
git branch -M main
git push -u origin main
```

## 🌐 Étape 3 : Déployer sur Vercel

### 3.1 Connecter Vercel à GitHub

1. Allez sur [vercel.com](https://vercel.com)
2. Cliquez sur **"Sign Up"** ou **"Log In"**
3. Choisissez **"Continue with GitHub"**
4. Autorisez Vercel à accéder à vos repositories

### 3.2 Importer le Projet

1. Cliquez sur **"Add New Project"**
2. Sélectionnez votre repository `novabank`
3. Cliquez sur **"Import"**

### 3.3 Configurer les Variables d'Environnement

Dans la section **"Environment Variables"**, ajoutez :

```
VITE_SUPABASE_URL=votre_url_supabase
VITE_SUPABASE_ANON_KEY=votre_anon_key
SUPABASE_SERVICE_ROLE_KEY=votre_service_role_key
CRON_SECRET=votre_secret_aleatoire
```

**Important :**
- `VITE_SUPABASE_URL` : Trouvable dans Supabase → Settings → API
- `VITE_SUPABASE_ANON_KEY` : Trouvable dans Supabase → Settings → API
- `SUPABASE_SERVICE_ROLE_KEY` : Trouvable dans Supabase → Settings → API (⚠️ Secret, ne partagez jamais)
- `CRON_SECRET` : Générez un secret aléatoire (ex: `openssl rand -hex 32`)

### 3.4 Configurer le Build

Vercel détectera automatiquement :
- **Framework Preset** : Vite
- **Build Command** : `npm run build`
- **Output Directory** : `dist`

Cliquez sur **"Deploy"**

## ⏰ Étape 4 : Configurer les Cron Jobs

### 4.1 Activer les Cron Jobs sur Vercel

Les cron jobs sont déjà configurés dans `vercel.json`. Vercel les activera automatiquement après le déploiement.

**Cron Jobs configurés :**
- **Archive Messages** : Tous les jours à 2h00 UTC (`/api/cron/archive-messages`)
- **Cleanup Read Messages** : Tous les 3 jours à 3h00 UTC (`/api/cron/cleanup-read-messages`)
- **Delete Very Old Messages** : Le 1er de chaque mois à 4h00 UTC (`/api/cron/delete-very-old-messages`)

### 4.2 Vérifier les Cron Jobs

1. Allez dans votre projet Vercel
2. Cliquez sur **"Settings"** → **"Cron Jobs"**
3. Vérifiez que les 3 cron jobs sont listés

### 4.3 Tester un Cron Job Manuellement

Vous pouvez tester un cron job en appelant l'URL directement :

```bash
# Remplacez VERCEL_URL par votre URL Vercel
# Remplacez CRON_SECRET par votre secret
curl -X GET "https://VERCEL_URL/api/cron/archive-messages" \
  -H "Authorization: Bearer CRON_SECRET"
```

## 🗄️ Étape 5 : Exécuter le Script SQL d'Optimisation

### 5.1 Dans Supabase SQL Editor

1. Allez sur votre projet Supabase
2. Cliquez sur **"SQL Editor"**
3. Ouvrez le fichier `scripts/optimize-chat-storage.sql`
4. Copiez-collez le contenu dans l'éditeur
5. Cliquez sur **"Run"**

### 5.2 Vérifier les Fonctions

```sql
-- Vérifier que les fonctions existent
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name IN ('archive_old_messages', 'cleanup_read_messages', 'delete_very_old_messages');
```

## ✅ Étape 6 : Vérifier le Déploiement

### 6.1 Vérifier l'Application

1. Allez sur votre URL Vercel (ex: `https://novabank.vercel.app`)
2. Testez l'application
3. Vérifiez que tout fonctionne

### 6.2 Vérifier les Cron Jobs

1. Allez dans Vercel → **"Deployments"**
2. Cliquez sur un déploiement
3. Allez dans **"Functions"**
4. Vérifiez que les 3 fonctions cron sont listées

### 6.3 Vérifier les Logs

1. Dans Vercel, allez dans **"Logs"**
2. Attendez le prochain exécution d'un cron job
3. Vérifiez les logs pour confirmer l'exécution

## 🔍 Étape 7 : Monitoring

### 7.1 Vérifier les Statistiques de Stockage

Dans Supabase SQL Editor :

```sql
SELECT * FROM get_messages_storage_stats();
```

### 7.2 Vérifier les Cron Jobs Vercel

1. Vercel Dashboard → **"Settings"** → **"Cron Jobs"**
2. Vérifiez l'historique d'exécution
3. Vérifiez les logs pour chaque exécution

## 🛠️ Dépannage

### Problème : Les Cron Jobs ne s'exécutent pas

**Solution :**
1. Vérifiez que `CRON_SECRET` est bien configuré dans Vercel
2. Vérifiez que les fonctions existent dans Supabase
3. Testez manuellement avec curl

### Problème : Erreur "Unauthorized"

**Solution :**
- Vérifiez que `CRON_SECRET` dans Vercel correspond à celui dans le code
- Vérifiez que l'en-tête `Authorization` est correct

### Problème : Erreur "Missing Supabase environment variables"

**Solution :**
- Vérifiez que toutes les variables d'environnement sont configurées dans Vercel
- Redéployez après avoir ajouté les variables

### Problème : Les fonctions SQL n'existent pas

**Solution :**
- Exécutez `scripts/optimize-chat-storage.sql` dans Supabase SQL Editor
- Vérifiez que les fonctions sont créées avec `SELECT routine_name FROM information_schema.routines`

## 📝 Checklist de Déploiement

- [ ] Git initialisé et commit effectué
- [ ] Repository GitHub créé et lié
- [ ] Projet déployé sur Vercel
- [ ] Variables d'environnement configurées
- [ ] Script SQL d'optimisation exécuté
- [ ] Cron jobs visibles dans Vercel
- [ ] Test manuel d'un cron job réussi
- [ ] Application fonctionnelle sur Vercel
- [ ] Logs vérifiés

## 🎉 Félicitations !

Votre application est maintenant déployée avec :
- ✅ Déploiement automatique via GitHub
- ✅ Archivage automatique des messages
- ✅ Nettoyage automatique des données anciennes
- ✅ Monitoring et logs disponibles

## 📚 Ressources

- [Documentation Vercel](https://vercel.com/docs)
- [Documentation Vercel Cron](https://vercel.com/docs/cron-jobs)
- [Documentation Supabase](https://supabase.com/docs)
- [Guide d'Optimisation](./scripts/chat-optimization-guide.md)

