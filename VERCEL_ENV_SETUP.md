# Guide : Configuration des Variables d'Environnement sur Vercel

Ce guide vous explique étape par étape comment configurer les variables d'environnement SMTP pour le formulaire de contact sur Vercel.

## Étapes détaillées

### Étape 1 : Se connecter à Vercel

1. Allez sur https://vercel.com
2. Connectez-vous avec votre compte (GitHub, GitLab, ou Bitbucket)

### Étape 2 : Accéder à votre projet

1. Dans le tableau de bord Vercel, trouvez votre projet **novabank**
2. Cliquez sur le nom du projet pour l'ouvrir

### Étape 3 : Ouvrir les paramètres de l'environnement

1. En haut de la page du projet, cliquez sur l'onglet **"Settings"** (Paramètres)
2. Dans le menu de gauche, cliquez sur **"Environment Variables"** (Variables d'environnement)

### Étape 4 : Ajouter les variables une par une

Pour chaque variable, suivez ces étapes :

1. Cliquez sur le champ **"Key"** (Clé) et entrez le nom de la variable
2. Cliquez sur le champ **"Value"** (Valeur) et entrez la valeur
3. Cochez les environnements où vous voulez utiliser cette variable :
   - ✅ **Production** (pour le site en ligne)
   - ✅ **Preview** (pour les déploiements de prévisualisation)
   - ✅ **Development** (optionnel, pour le développement local)
4. Cliquez sur **"Add"** ou **"Save"**

#### Variable 1 : SMTP_HOST

- **Key** : `SMTP_HOST`
- **Value** : `smtp.zoho.com`
- **Environments** : ✅ Production, ✅ Preview

#### Variable 2 : SMTP_PORT

- **Key** : `SMTP_PORT`
- **Value** : `587`
- **Environments** : ✅ Production, ✅ Preview

#### Variable 3 : SMTP_SECURE

- **Key** : `SMTP_SECURE`
- **Value** : `false`
- **Environments** : ✅ Production, ✅ Preview

#### Variable 4 : SMTP_USER

- **Key** : `SMTP_USER`
- **Value** : `contact@novabank.company`
- **Environments** : ✅ Production, ✅ Preview

#### Variable 5 : SMTP_PASSWORD

- **Key** : `SMTP_PASSWORD`
- **Value** : `$V!6uGw7gzrvd4#`
- **Environments** : ✅ Production, ✅ Preview

⚠️ **Attention** : Vercel masquera cette valeur avec des points (••••) une fois sauvegardée, c'est normal.

#### Variable 6 : CONTACT_EMAIL

- **Key** : `CONTACT_EMAIL`
- **Value** : `contact@novabank.company`
- **Environments** : ✅ Production, ✅ Preview

#### Variable 7 : FROM_EMAIL

- **Key** : `FROM_EMAIL`
- **Value** : `contact@novabank.company`
- **Environments** : ✅ Production, ✅ Preview

### Étape 5 : Vérifier les variables ajoutées

Une fois toutes les variables ajoutées, vous devriez voir une liste avec 7 variables :
- SMTP_HOST
- SMTP_PORT
- SMTP_SECURE
- SMTP_USER
- SMTP_PASSWORD (masquée)
- CONTACT_EMAIL
- FROM_EMAIL

### Étape 6 : Redéployer l'application

Les variables d'environnement sont appliquées uniquement lors d'un nouveau déploiement. Vous devez redéployer :

#### Option A : Redéploiement depuis l'interface Vercel

1. Allez dans l'onglet **"Deployments"** (Déploiements)
2. Trouvez le dernier déploiement (celui qui vient d'être créé par le push Git)
3. Cliquez sur les **"..."** (trois points) à droite du déploiement
4. Sélectionnez **"Redeploy"** (Redéployer)
5. Confirmez le redéploiement

#### Option B : Redéploiement via un nouveau commit (automatique)

Si vous préférez, vous pouvez faire un commit vide pour déclencher un nouveau déploiement :

```bash
git commit --allow-empty -m "Trigger redeploy for environment variables"
git push origin main
```

### Étape 7 : Vérifier le déploiement

1. Attendez que le déploiement se termine (vous verrez un indicateur de progression)
2. Une fois terminé, cliquez sur votre site pour l'ouvrir
3. Allez sur la page **Contact**
4. Testez le formulaire

## Vérification

Pour vérifier que les variables sont bien configurées :

1. Dans Vercel, allez dans **Settings** → **Environment Variables**
2. Vous devriez voir toutes les 7 variables listées
3. Le mot de passe sera masqué (c'est normal et sécurisé)

## Dépannage

### Les variables ne semblent pas être prises en compte

- ✅ Assurez-vous d'avoir redéployé après avoir ajouté les variables
- ✅ Vérifiez que vous avez coché "Production" pour chaque variable
- ✅ Vérifiez qu'il n'y a pas d'espaces avant/après les valeurs

### Erreur "Email service not configured"

- ✅ Vérifiez que `SMTP_USER` et `SMTP_PASSWORD` sont bien définies
- ✅ Vérifiez qu'il n'y a pas de fautes de frappe dans les noms des variables
- ✅ Vérifiez les logs Vercel : **Functions** → **api/contact** → **Logs**

### Erreur "SMTP authentication failed"

- ✅ Vérifiez que le mot de passe est correct (copiez-collez pour éviter les erreurs)
- ✅ Vérifiez que l'email `contact@novabank.company` existe dans votre compte Zoho
- ✅ Si vous avez l'authentification à deux facteurs, utilisez un mot de passe d'application

## Modifier une variable plus tard

1. Allez dans **Settings** → **Environment Variables**
2. Trouvez la variable à modifier
3. Cliquez sur **"Edit"** (Modifier) ou sur la variable elle-même
4. Modifiez la valeur
5. Cliquez sur **"Save"**
6. **Redéployez** l'application pour appliquer les changements

## Supprimer une variable

1. Allez dans **Settings** → **Environment Variables**
2. Trouvez la variable à supprimer
3. Cliquez sur **"Delete"** (Supprimer)
4. Confirmez la suppression
5. **Redéployez** l'application

---

**Note importante** : Les variables d'environnement sont appliquées uniquement lors d'un nouveau déploiement. Si vous modifiez des variables, n'oubliez pas de redéployer !

