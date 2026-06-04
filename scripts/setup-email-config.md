# Configuration Email Zoho SMTP pour le Formulaire de Contact

Ce guide explique comment configurer l'envoi d'emails depuis le formulaire de contact NovaBank en utilisant Zoho Mail via SMTP.

## Prérequis

1. Un compte Zoho Mail avec l'adresse `contact@novabank.company`
2. Accès aux paramètres de sécurité Zoho pour créer un mot de passe d'application

## Étapes de configuration

### 1. Créer un mot de passe d'application Zoho (Recommandé)

**Pourquoi ?** Un mot de passe d'application continue de fonctionner même si vous changez votre mot de passe principal.

1. Connectez-vous à votre compte Zoho : https://mail.zoho.com
2. Cliquez sur l'icône **Paramètres** (⚙️) en haut à droite
3. Allez dans **Sécurité** → **Mots de passe d'application**
4. Cliquez sur **Générer un nouveau mot de passe**
5. Donnez-lui un nom (ex: "NovaBank Contact Form")
6. Sélectionnez l'application : **Mail Client**
7. Copiez le mot de passe généré (vous ne pourrez le voir qu'une seule fois !)

**Important** : Notez ce mot de passe dans un endroit sûr, vous en aurez besoin pour la configuration.

### 2. Configurer les variables d'environnement

#### Sur Vercel (Production)

1. Allez dans votre projet Vercel
2. Cliquez sur **Settings** → **Environment Variables**
3. Ajoutez les variables suivantes :

```
SMTP_HOST=smtp.zoho.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=contact@novabank.company
SMTP_PASSWORD=votre_mot_de_passe_application_zoho
CONTACT_EMAIL=contact@novabank.company
FROM_EMAIL=contact@novabank.company
```

**Note** : Remplacez `votre_mot_de_passe_application_zoho` par le mot de passe d'application que vous venez de créer.

#### En local (Development)

Créez un fichier `.env.local` à la racine du projet :

```env
SMTP_HOST=smtp.zoho.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=contact@novabank.company
SMTP_PASSWORD=votre_mot_de_passe_application_zoho
CONTACT_EMAIL=contact@novabank.company
FROM_EMAIL=contact@novabank.company
```

**Important**: Ajoutez `.env.local` à votre `.gitignore` pour ne pas commiter vos mots de passe.

### 3. Configuration SMTP Zoho

Zoho Mail supporte deux ports SMTP :

#### Option A : Port 587 (TLS) - Recommandé

```env
SMTP_HOST=smtp.zoho.com
SMTP_PORT=587
SMTP_SECURE=false
```

#### Option B : Port 465 (SSL) - Alternative

```env
SMTP_HOST=smtp.zoho.com
SMTP_PORT=465
SMTP_SECURE=true
```

### 4. Redéployer l'application

Si vous modifiez les variables d'environnement sur Vercel, vous devez redéployer :

```bash
# Option 1: Via l'interface Vercel (recommandé)
# Allez dans votre projet → Deployments → "..." → Redeploy

# Option 2: Via Git
git commit --allow-empty -m "Trigger redeploy for SMTP env vars"
git push origin main
```

## Changer le mot de passe ou l'email

### Changer le mot de passe SMTP

**Avec mot de passe d'application (recommandé)** :

1. Créez un nouveau mot de passe d'application dans Zoho
2. Mettez à jour `SMTP_PASSWORD` dans les variables d'environnement
3. Supprimez l'ancien mot de passe d'application dans Zoho (optionnel, pour la sécurité)
4. Redéployez si nécessaire

**Avantage** : Si vous changez votre mot de passe principal Zoho, le mot de passe d'application continue de fonctionner !

**Avec mot de passe principal** :

1. Changez votre mot de passe dans Zoho
2. Mettez à jour `SMTP_PASSWORD` dans les variables d'environnement
3. Redéployez si nécessaire

**Note**: C'est pourquoi l'utilisation d'un mot de passe d'application est recommandée.

### Changer l'adresse email de réception

Pour changer l'email qui reçoit les messages de contact, modifiez simplement la variable `CONTACT_EMAIL` :

1. Sur Vercel : Settings → Environment Variables → Modifier `CONTACT_EMAIL`
2. En local : Modifier `.env.local`
3. Redéployer si nécessaire

**Note**: Vous n'avez pas besoin de changer le code, juste la variable d'environnement.

### Changer l'adresse email expéditeur

Pour changer l'email depuis lequel les messages sont envoyés :

1. Assurez-vous que cet email existe dans votre compte Zoho
2. Mettez à jour `FROM_EMAIL` dans les variables d'environnement
3. Si nécessaire, mettez à jour `SMTP_USER` pour correspondre
4. Redéployer si nécessaire

## Tester le formulaire

1. Allez sur la page Contact de votre site
2. Remplissez le formulaire avec vos informations
3. Cliquez sur "Envoyer"
4. Vérifiez que vous recevez l'email à l'adresse configurée dans `CONTACT_EMAIL`
5. Vous pouvez répondre directement depuis votre interface Zoho Mail

## Dépannage

### L'email n'arrive pas

1. **Vérifiez les logs Vercel** :
   - Allez dans votre projet Vercel
   - Cliquez sur **Functions** → **api/contact**
   - Vérifiez les logs pour voir les erreurs détaillées

2. **Vérifiez les credentials SMTP** :
   - Assurez-vous que `SMTP_USER` et `SMTP_PASSWORD` sont corrects
   - Si vous utilisez l'authentification à deux facteurs, vous DEVEZ utiliser un mot de passe d'application

3. **Vérifiez votre dossier spam** dans Zoho Mail

4. **Testez la connexion SMTP** :
   - Utilisez un client email (Thunderbird, Outlook) pour tester la connexion SMTP avec les mêmes credentials

### Erreur "SMTP authentication failed"

- Vérifiez que `SMTP_USER` correspond exactement à votre email Zoho
- Vérifiez que `SMTP_PASSWORD` est correct (copiez-collez pour éviter les erreurs de frappe)
- Si vous avez l'authentification à deux facteurs activée, utilisez un mot de passe d'application, pas votre mot de passe principal

### Erreur "Could not connect to SMTP server"

- Vérifiez que `SMTP_HOST` est `smtp.zoho.com`
- Vérifiez que le port est correct (587 pour TLS, 465 pour SSL)
- Vérifiez que `SMTP_SECURE` correspond au port utilisé :
  - Port 587 → `SMTP_SECURE=false`
  - Port 465 → `SMTP_SECURE=true`

### Limite d'emails atteinte

Vérifiez les limites de votre plan Zoho :
- Plan gratuit : généralement 100-200 emails/jour
- Plans payants : limites plus élevées

## Variables d'environnement disponibles

| Variable | Description | Défaut | Requis |
|----------|-------------|--------|--------|
| `SMTP_HOST` | Serveur SMTP | `smtp.zoho.com` | ❌ Non |
| `SMTP_PORT` | Port SMTP | `587` | ❌ Non |
| `SMTP_SECURE` | SSL/TLS | `false` | ❌ Non |
| `SMTP_USER` | Email Zoho | - | ✅ Oui |
| `SMTP_PASSWORD` | Mot de passe Zoho | - | ✅ Oui |
| `SMTP_EMAIL` | Alias pour SMTP_USER | - | ❌ Non |
| `CONTACT_EMAIL` | Email de réception | `contact@novabank.company` | ❌ Non |
| `FROM_EMAIL` | Email expéditeur | `contact@novabank.company` | ❌ Non |

## Sécurité

- ⚠️ **Ne commitez jamais** vos mots de passe dans Git
- ⚠️ Utilisez toujours des variables d'environnement pour les secrets
- ✅ **Utilisez un mot de passe d'application** plutôt que votre mot de passe principal
- ✅ Les emails sont envoyés via TLS/SSL (chiffrés)
- ✅ Vous pouvez révoquer un mot de passe d'application à tout moment dans Zoho

## Avantages de Zoho SMTP

✅ **Gratuit** (selon votre plan Zoho)  
✅ **Interface de gestion** : Lisez et répondez aux emails depuis Zoho Mail  
✅ **Application mobile** : Gérez les conversations depuis votre téléphone  
✅ **Contrôle total** : Vous gérez votre propre infrastructure email  
✅ **Pas de dépendance externe** : Pas besoin de service tiers  
✅ **Mot de passe d'application** : Changez votre mot de passe principal sans casser l'envoi d'emails  
