# Configuration Email - Formulaire de Contact (Zoho SMTP)

## Vue d'ensemble

Le formulaire de contact utilise Zoho Mail via SMTP pour envoyer des emails. Toutes les configurations sont gérées via des variables d'environnement, ce qui permet de changer facilement le mot de passe ou l'email sans modifier le code.

## Variables d'environnement requises

Créez un fichier `.env.local` à la racine du projet (ou configurez-les sur Vercel) :

```env
# Configuration SMTP Zoho
SMTP_HOST=smtp.zoho.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=contact@novabank.company
SMTP_PASSWORD=votre_mot_de_passe_zoho
SMTP_EMAIL=contact@novabank.company

# Configuration Email
CONTACT_EMAIL=contact@novabank.company
FROM_EMAIL=contact@novabank.company
```

### Description des variables

- **SMTP_HOST** (optionnel) : Serveur SMTP. Défaut: `smtp.zoho.com`
- **SMTP_PORT** (optionnel) : Port SMTP. Défaut: `587` (TLS) ou utilisez `465` (SSL)
- **SMTP_SECURE** (optionnel) : `true` pour SSL (port 465), `false` pour TLS (port 587). Défaut: `false`
- **SMTP_USER** (requis) : Votre adresse email Zoho (ex: `contact@novabank.company`)
- **SMTP_PASSWORD** (requis) : Votre mot de passe Zoho ou mot de passe d'application
- **SMTP_EMAIL** (optionnel) : Alias pour SMTP_USER si différent
- **CONTACT_EMAIL** (optionnel) : L'email qui recevra les messages. Défaut: `contact@novabank.company`
- **FROM_EMAIL** (optionnel) : L'email depuis lequel les messages sont envoyés. Défaut: `contact@novabank.company`

## Configuration Zoho Mail

### Option 1 : Utiliser votre mot de passe Zoho (simple)

1. Utilisez votre adresse email Zoho : `contact@novabank.company`
2. Utilisez votre mot de passe Zoho normal
3. Configurez les variables :
   ```
   SMTP_USER=contact@novabank.company
   SMTP_PASSWORD=votre_mot_de_passe_zoho
   SMTP_PORT=587
   SMTP_SECURE=false
   ```

### Option 2 : Utiliser un mot de passe d'application (recommandé pour la sécurité)

1. Connectez-vous à votre compte Zoho : https://mail.zoho.com
2. Allez dans **Paramètres** → **Sécurité** → **Mots de passe d'application**
3. Créez un nouveau mot de passe d'application pour "SMTP"
4. Copiez le mot de passe généré (visible une seule fois)
5. Utilisez ce mot de passe dans `SMTP_PASSWORD`

**Avantage** : Si vous changez votre mot de passe principal, le mot de passe d'application continue de fonctionner.

## Ports SMTP Zoho

- **Port 587 (TLS)** : Recommandé, `SMTP_SECURE=false`
- **Port 465 (SSL)** : Alternative, `SMTP_SECURE=true`

## Changer le mot de passe ou l'email

### Pour changer le mot de passe

1. **Si vous utilisez un mot de passe d'application** :
   - Créez un nouveau mot de passe d'application dans Zoho
   - Mettez à jour `SMTP_PASSWORD` dans les variables d'environnement
   - Redéployez si nécessaire (sur Vercel, c'est automatique)

2. **Si vous utilisez votre mot de passe principal** :
   - Changez votre mot de passe dans Zoho
   - Mettez à jour `SMTP_PASSWORD` dans les variables d'environnement
   - **OU** créez un mot de passe d'application (recommandé) pour éviter ce problème

**Aucune modification de code nécessaire !**

### Pour changer l'email de réception

1. Modifiez la variable `CONTACT_EMAIL` dans les variables d'environnement
2. Redéployez si nécessaire

### Pour changer l'email expéditeur

1. Modifiez la variable `FROM_EMAIL` dans les variables d'environnement
2. Assurez-vous que cet email existe dans votre compte Zoho
3. Redéployez si nécessaire

## Tests

1. Remplissez le formulaire de contact sur votre site
2. Vérifiez que vous recevez l'email à l'adresse configurée dans `CONTACT_EMAIL`
3. Vous pouvez répondre directement depuis votre interface Zoho Mail

## Dépannage

### Erreur "SMTP authentication failed"

- Vérifiez que `SMTP_USER` et `SMTP_PASSWORD` sont corrects
- Si vous utilisez l'authentification à deux facteurs, utilisez un mot de passe d'application
- Vérifiez que l'email existe dans votre compte Zoho

### Erreur "Could not connect to SMTP server"

- Vérifiez que `SMTP_HOST` est correct (`smtp.zoho.com`)
- Vérifiez que le port est correct (587 pour TLS, 465 pour SSL)
- Vérifiez que `SMTP_SECURE` correspond au port utilisé

### Email n'arrive pas

- Vérifiez les logs Vercel pour voir les erreurs détaillées
- Vérifiez votre dossier spam dans Zoho Mail
- Testez la connexion SMTP avec un client email externe

### Limites Zoho

- Vérifiez les limites d'envoi de votre plan Zoho
- Le plan gratuit peut avoir des limites (généralement 100-200 emails/jour)

## Avantages de Zoho SMTP

✅ **Gratuit** (selon votre plan Zoho)  
✅ **Interface de gestion** : Vous pouvez lire et répondre aux emails depuis Zoho Mail  
✅ **Application mobile** : Gestion des conversations depuis votre téléphone  
✅ **Contrôle total** : Vous gérez votre propre infrastructure email  
✅ **Pas de dépendance externe** : Pas besoin de service tiers comme Resend  

## Sécurité

- ⚠️ **Ne commitez jamais** vos mots de passe dans Git
- ⚠️ Utilisez toujours des variables d'environnement pour les secrets
- ✅ Utilisez un mot de passe d'application plutôt que votre mot de passe principal
- ✅ Les emails sont envoyés via TLS/SSL (chiffrés)
