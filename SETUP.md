# NovaBank - Setup Guide

## Configuration Supabase

### 1. Exécuter le schéma SQL

Connectez-vous à votre dashboard Supabase et allez dans **SQL Editor**. Exécutez le contenu du fichier `supabase-schema.sql` pour créer toutes les tables, politiques RLS, et triggers nécessaires.

### 2. Variables d'environnement

Créez un fichier `.env` à la racine du projet avec le contenu suivant :

```
VITE_SUPABASE_URL=https://hjpgwitgyuzhtdljvnit.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhqcGd3aXRneXV6aHRkbGp2bml0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUzNDQyMjEsImV4cCI6MjA4MDkyMDIyMX0.qU-37ivumLBji7FaNPkc8-Qmwf5VyJjH9EvJvBcmKHo
```

### 3. Créer un utilisateur Admin (optionnel)

Pour créer un compte admin, vous pouvez :

1. **Via l'interface** : Inscrivez-vous normalement, puis dans Supabase Dashboard, allez dans Authentication > Users, trouvez votre utilisateur, et modifiez manuellement le champ `role` dans la table `users` à `ADMIN`.

2. **Via SQL** : Après vous être inscrit, exécutez cette requête SQL dans le SQL Editor :
```sql
UPDATE public.users 
SET role = 'ADMIN' 
WHERE email = 'votre-email@example.com';
```

### 4. Installation et démarrage

```bash
npm install
npm run dev
```

L'application sera accessible sur `http://localhost:3000`

## Fonctionnalités

- ✅ Authentification complète avec Supabase Auth
- ✅ Inscription de nouveaux utilisateurs
- ✅ Gestion des profils utilisateurs
- ✅ Transactions bancaires
- ✅ Chat en temps réel entre utilisateurs et admin
- ✅ Transferts d'argent avec codes de sécurité
- ✅ Tableau de bord admin
- ✅ Stockage des avatars (à configurer)

## Notes importantes

- Les mots de passe sont gérés par Supabase Auth (hashés automatiquement)
- Les données sont persistées dans Supabase
- Le chat fonctionne en temps réel via Supabase Realtime
- Tous les utilisateurs peuvent créer des comptes sans restriction

