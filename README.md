# NovaBank - Application Bancaire en Ligne

Application bancaire moderne avec authentification, transactions, chat en temps réel et gestion complète des utilisateurs.

## 🚀 Installation

### Prérequis
- Node.js 18+ 
- npm ou yarn
- Compte Supabase

### Étapes d'installation

1. **Cloner et installer les dépendances**
```bash
npm install
```

2. **Configurer les variables d'environnement**

Créez un fichier `.env` à la racine :
```
VITE_SUPABASE_URL=https://hjpgwitgyuzhtdljvnit.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhqcGd3aXRneXV6aHRkbGp2bml0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUzNDQyMjEsImV4cCI6MjA4MDkyMDIyMX0.qU-37ivumLBji7FaNPkc8-Qmwf5VyJjH9EvJvBcmKHo
```

3. **Configurer la base de données Supabase**

- Connectez-vous à votre dashboard Supabase
- Allez dans **SQL Editor**
- Exécutez le contenu du fichier `supabase-schema.sql`
- Vérifiez que toutes les tables, politiques RLS et triggers sont créés

4. **Démarrer l'application**
```bash
npm run dev
```

L'application sera accessible sur `http://localhost:3000`

## 📋 Fonctionnalités

### ✅ Implémenté
- **Authentification complète** : Inscription et connexion avec Supabase Auth
- **Gestion des utilisateurs** : Profils complets avec informations personnelles
- **Transactions bancaires** : Création et suivi des transactions
- **Transferts d'argent** : Système de transfert avec codes de sécurité
- **Chat en temps réel** : Communication entre utilisateurs et admin via Supabase Realtime
- **Tableau de bord admin** : Gestion des utilisateurs, balance, transactions
- **Stockage d'avatars** : Upload et stockage des photos de profil
- **Multi-langues** : Support de plusieurs langues

### 🔧 Architecture

- **Frontend** : React + TypeScript + Vite
- **Backend** : Supabase (PostgreSQL + Auth + Storage + Realtime)
- **Authentification** : Supabase Auth
- **Base de données** : PostgreSQL via Supabase
- **Stockage** : Supabase Storage pour les avatars
- **Temps réel** : Supabase Realtime pour le chat

## 🗄️ Structure de la base de données

- `users` : Profils utilisateurs
- `transactions` : Historique des transactions
- `messages` : Messages du chat
- `admin_logs` : Logs d'actions admin
- `active_transfers` : Transferts en cours

## 📝 Notes importantes

1. **Premier utilisateur Admin** : Après votre première inscription, mettez à jour manuellement le rôle dans Supabase :
   ```sql
   UPDATE public.users SET role = 'ADMIN' WHERE email = 'votre-email@example.com';
   ```

2. **Sécurité** : Les mots de passe sont hashés automatiquement par Supabase Auth

3. **Données persistantes** : Toutes les données sont stockées dans Supabase et persistent entre les sessions

4. **Chat temps réel** : Le chat fonctionne en temps réel grâce à Supabase Realtime

## 🚀 Déploiement

### Déploiement Rapide (5 minutes)

Consultez [QUICK_START_DEPLOYMENT.md](./QUICK_START_DEPLOYMENT.md) pour un guide rapide.

### Déploiement Complet

Consultez [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) pour un guide détaillé.

### Étapes Principales

1. **Préparer Git et GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/VOTRE_USERNAME/VOTRE_REPO.git
   git push -u origin main
   ```

2. **Déployer sur Vercel**
   - Connecter GitHub à Vercel
   - Configurer les variables d'environnement
   - Déployer automatiquement

3. **Configurer l'Archivage Automatique**
   - Exécuter `scripts/optimize-chat-storage.sql` dans Supabase
   - Les cron jobs Vercel s'activeront automatiquement

### Variables d'Environnement Requises

```
VITE_SUPABASE_URL=votre_url_supabase
VITE_SUPABASE_ANON_KEY=votre_anon_key
SUPABASE_SERVICE_ROLE_KEY=votre_service_role_key
CRON_SECRET=votre_secret_aleatoire
```

## 🔄 Archivage Automatique

L'application inclut un système d'archivage automatique pour optimiser le stockage :

- **Messages > 6 mois** → Archivés automatiquement
- **Messages lus > 3 mois** → Supprimés automatiquement
- **Messages > 1 an** → Supprimés définitivement

Les cron jobs s'exécutent automatiquement via Vercel :
- Archive : Tous les jours à 2h00 UTC
- Nettoyage : Tous les 3 jours à 3h00 UTC
- Suppression : Le 1er du mois à 4h00 UTC

## 📄 Licence

Ce projet est un prototype de démonstration.
