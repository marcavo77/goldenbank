# Dépannage : Erreur "Email service not configured"

Si vous voyez l'erreur "Email service not configured", cela signifie que les variables d'environnement SMTP ne sont pas correctement configurées sur Vercel.

## Vérifications à faire

### 1. Vérifier que les variables sont bien ajoutées

1. Allez sur Vercel → Votre projet → **Settings** → **Environment Variables**
2. Vérifiez que vous voyez bien ces 7 variables :
   - `SMTP_HOST`
   - `SMTP_PORT`
   - `SMTP_SECURE`
   - `SMTP_USER`
   - `SMTP_PASSWORD`
   - `CONTACT_EMAIL`
   - `FROM_EMAIL`

### 2. Vérifier que les variables sont cochées pour "Production"

Pour chaque variable, vous devez voir une colonne "Environments" avec **Production** coché ✅.

**IMPORTANT** : Si "Production" n'est pas coché, les variables ne seront pas disponibles sur votre site en ligne !

Pour corriger :
1. Cliquez sur une variable
2. Cochez la case **"Production"**
3. Cliquez sur **"Save"**
4. Répétez pour toutes les variables

### 3. Vérifier les noms des variables (sans espaces, sans fautes)

Les noms doivent être EXACTEMENT :
- `SMTP_HOST` (pas `SMTP_HOST ` avec un espace)
- `SMTP_USER` (pas `SMTP_USER_EMAIL`)
- `SMTP_PASSWORD` (pas `SMTP_PASS`)

### 4. Vérifier que le déploiement est bien terminé

1. Allez dans **Deployments**
2. Vérifiez que le dernier déploiement est marqué **"Ready"** avec un point vert
3. Si c'est encore en cours, attendez qu'il se termine

### 5. Redéployer après avoir ajouté/modifié les variables

**Les variables d'environnement ne sont appliquées QUE lors d'un nouveau déploiement.**

Si vous avez ajouté les variables APRÈS le dernier déploiement, vous devez redéployer :

1. Allez dans **Deployments**
2. Cliquez sur les **"..."** du dernier déploiement
3. Sélectionnez **"Redeploy"**
4. Attendez que le déploiement se termine

### 6. Vérifier les logs Vercel pour plus de détails

1. Allez dans **Functions** → **api/contact**
2. Cliquez sur **"Logs"** ou **"View Logs"**
3. Regardez les logs pour voir quelles variables sont manquantes

## Vérification rapide

Pour vérifier rapidement si les variables sont bien configurées, regardez l'erreur détaillée dans le formulaire. Elle devrait maintenant indiquer :
- `SMTP_USER: SET` ou `SMTP_USER: MISSING`
- `SMTP_PASSWORD: SET` ou `SMTP_PASSWORD: MISSING`

Cela vous dira exactement quelle variable manque.

## Solution rapide

1. **Vérifiez les variables sur Vercel** : Settings → Environment Variables
2. **Assurez-vous que "Production" est coché** pour chaque variable
3. **Redéployez** : Deployments → "..." → Redeploy
4. **Testez à nouveau** le formulaire

Si le problème persiste, vérifiez les logs Vercel pour voir les détails exacts.

