# 🔧 Recréer les Variables SMTP sur Vercel

## ⚠️ Problème : Le caractère `$` dans le mot de passe

Le caractère `$` dans le mot de passe peut poser problème sur Vercel. Il faut l'échapper en le doublant : `$$`.

## ✅ Solution : Supprimer et recréer les variables

### Étape 1 : Supprimer toutes les variables SMTP

1. Allez sur **Vercel** → Votre projet → **Settings** → **Environment Variables**
2. Pour **chaque variable SMTP** :
   - Cliquez sur les **"..."** (trois points) à droite
   - Cliquez sur **"Delete"**
   - Confirmez la suppression

### Étape 2 : Recréer les variables une par une (manuellement)

**Important** : Ne pas utiliser "Import", créer chaque variable manuellement !

Pour chaque variable, suivez ces étapes :

1. Cliquez sur le bouton **"Add New"** (ou "Add Another")
2. Dans **"Key"** : Entrez le nom de la variable
3. Dans **"Value"** : Entrez la valeur
4. Cochez **"Production"** ✅
5. Cochez **"Preview"** ✅ (optionnel mais recommandé)
6. Cliquez sur **"Save"**

### Liste des variables à créer :

#### 1. SMTP_HOST
- **Key** : `SMTP_HOST`
- **Value** : `smtp.zoho.com`
- **Environments** : ✅ Production, ✅ Preview

#### 2. SMTP_PORT
- **Key** : `SMTP_PORT`
- **Value** : `587`
- **Environments** : ✅ Production, ✅ Preview

#### 3. SMTP_SECURE
- **Key** : `SMTP_SECURE`
- **Value** : `false`
- **Environments** : ✅ Production, ✅ Preview

#### 4. SMTP_USER
- **Key** : `SMTP_USER`
- **Value** : `contact@novabank.company`
- **Environments** : ✅ Production, ✅ Preview

#### 5. SMTP_PASSWORD ⚠️
- **Key** : `SMTP_PASSWORD`
- **Value** : `$$V!6uGw7gzrvd4#` (notez le **double dollar** `$$` au début)
- **Environments** : ✅ Production, ✅ Preview

#### 6. CONTACT_EMAIL
- **Key** : `CONTACT_EMAIL`
- **Value** : `contact@novabank.company`
- **Environments** : ✅ Production, ✅ Preview

#### 7. FROM_EMAIL
- **Key** : `FROM_EMAIL`
- **Value** : `contact@novabank.company`
- **Environments** : ✅ Production, ✅ Preview

### Étape 3 : Redéployer

1. Allez dans l'onglet **"Deployments"**
2. Cliquez sur les **"..."** (trois points) du dernier déploiement
3. Sélectionnez **"Redeploy"**
4. Si vous voyez une option "Use existing Build Cache", **DÉCOCHEZ-LA**
5. Cliquez sur **"Redeploy"**

### Étape 4 : Vérifier

1. Attendez 1-2 minutes que le redéploiement se termine
2. Visitez `https://novabank.company/api/test-env`
3. Vous devriez voir `"SET"` au lieu de `"MISSING"` pour toutes les variables
4. Testez le formulaire de contact

## 🔍 Note importante

Si après cette procédure le problème persiste, il se peut que Vercel nécessite un format différent pour le mot de passe. Dans ce cas, vous pouvez essayer :
- Mettre le mot de passe entre guillemets : `"$V!6uGw7gzrvd4#"`
- Ou contacter le support Zoho pour générer un nouveau mot de passe d'application sans caractères spéciaux

