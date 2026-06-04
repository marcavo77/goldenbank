# 🔐 Configuration d'un Mot de Passe d'Application Zoho

## ⚠️ Problème identifié

Zoho **ne permet pas** d'utiliser le mot de passe principal du compte pour l'authentification SMTP. Vous devez créer un **"App Password"** (Mot de passe d'application) spécialement pour les applications tierces.

## ✅ Solution : Créer un Mot de Passe d'Application Zoho

### Étape 1 : Activer l'authentification à deux facteurs (si pas déjà fait)

Les mots de passe d'application nécessitent généralement que l'authentification à deux facteurs (2FA) soit activée sur votre compte Zoho.

1. Allez sur https://accounts.zoho.com
2. Connectez-vous avec votre compte
3. Allez dans **Security** (Sécurité) ou **Two-Factor Authentication** (Authentification à deux facteurs)
4. Activez l'authentification à deux facteurs si ce n'est pas déjà fait

### Étape 2 : Générer un Mot de Passe d'Application

1. Allez sur https://accounts.zoho.com/home#security/app-passwords
   - Ou : **Accounts** → **Security** → **App Passwords** (Mots de passe d'application)
2. Cliquez sur **Generate New Password** (Générer un nouveau mot de passe)
3. Donnez un nom descriptif : `NovaBank Contact Form` ou `SMTP Zoho`
4. Cliquez sur **Generate**
5. **IMPORTANT** : Copiez immédiatement le mot de passe généré (il ne sera affiché qu'une seule fois !)
   - Il ressemblera à quelque chose comme : `abcd1234efgh5678`
   - Il fait généralement 16 caractères, sans caractères spéciaux complexes

### Étape 3 : Mettre à jour la variable SMTP_PASSWORD sur Vercel

1. Allez sur **Vercel** → Votre projet → **Settings** → **Environment Variables**
2. Trouvez la variable `SMTP_PASSWORD`
3. Cliquez sur les **"..."** (trois points) → **Edit**
4. Remplacez la valeur actuelle par le nouveau mot de passe d'application que vous venez de générer
5. **Note** : Le mot de passe d'application Zoho ne contient généralement pas de caractères spéciaux comme `$`, donc vous pouvez l'utiliser tel quel (pas besoin de `$$`)
6. Vérifiez que **"Production"** est coché
7. Cliquez sur **"Save"**

### Étape 4 : Redéployer

1. Allez dans **Deployments**
2. Cliquez sur les **"..."** du dernier déploiement
3. Sélectionnez **"Redeploy"**
4. Attendez 1-2 minutes

### Étape 5 : Tester

1. Visitez `https://novabank.company/api/test-smtp`
   - Vous devriez voir `"success": true` et `"SMTP connection successful"`
2. Testez le formulaire de contact sur votre site
   - L'email devrait maintenant être envoyé avec succès

## 📝 Notes importantes

- Le mot de passe d'application est **différent** du mot de passe principal du compte
- Vous pouvez créer plusieurs mots de passe d'application pour différentes applications
- Si vous perdez un mot de passe d'application, vous devez le supprimer et en créer un nouveau
- Le mot de passe d'application ne peut pas être utilisé pour se connecter à l'interface web Zoho

## 🔒 Sécurité

- Les mots de passe d'application sont plus sûrs car ils sont limités à des applications spécifiques
- Si un mot de passe d'application est compromis, vous pouvez le révoquer sans affecter votre mot de passe principal
- Ne partagez jamais votre mot de passe d'application publiquement

