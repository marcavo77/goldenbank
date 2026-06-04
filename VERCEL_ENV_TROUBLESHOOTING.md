# Solution : Variables d'environnement non détectées sur Vercel

## Problème identifié

Le test sur `/api/test-env` montre que toutes les variables d'environnement sont "MISSING", même si elles sont configurées sur Vercel.

## Solution : Redéployer depuis Vercel

Quand vous ajoutez des variables d'environnement sur Vercel, elles ne sont disponibles que pour les **nouveaux déploiements**. Si votre dernier déploiement a été fait AVANT d'ajouter les variables, elles ne seront pas disponibles.

### Option 1 : Redéployer depuis l'interface Vercel (RECOMMANDÉ)

1. Allez dans votre projet Vercel
2. Onglet **"Deployments"**
3. Trouvez le dernier déploiement (celui qui vient d'être fait)
4. Cliquez sur les **"..."** (trois points) à droite
5. Sélectionnez **"Redeploy"**
6. **IMPORTANT** : Vérifiez qu'il y a une option pour "Use existing Build Cache" - **DÉCOCHEZ-LA** si elle est cochée (pour forcer un rebuild complet)
7. Cliquez sur **"Redeploy"**

### Option 2 : Supprimer et re-ajouter une variable (pour forcer le refresh)

Parfois, Vercel a besoin qu'on "touche" les variables pour qu'elles soient prises en compte :

1. Allez dans **Settings** → **Environment Variables**
2. Sélectionnez `SMTP_USER`
3. Cliquez sur **Edit** (ou les trois points)
4. Ajoutez un espace à la fin de la valeur, puis supprimez-le
5. Cliquez sur **Save**
6. Faites la même chose pour `SMTP_PASSWORD`
7. Redéployez depuis **Deployments**

### Option 3 : Vérifier que les variables sont bien pour "Production"

1. **Settings** → **Environment Variables**
2. Pour chaque variable, vérifiez qu'elle a bien :
   - ✅ **Production** coché
   - ✅ **Preview** coché (optionnel mais recommandé)

## Vérification après redéploiement

1. Attendez que le redéploiement se termine (1-2 minutes)
2. Visitez `/api/test-env` à nouveau
3. Vous devriez maintenant voir `"SET"` au lieu de `"MISSING"` pour toutes les variables
4. Testez ensuite le formulaire de contact

## Si ça ne fonctionne toujours pas

1. Vérifiez les logs de la fonction :
   - **Functions** → **api/test-env** → **Logs**
   - Voyez s'il y a des erreurs

2. Vérifiez le nom exact des variables :
   - Assurez-vous qu'il n'y a pas d'espaces avant/après les noms
   - Les noms doivent être exactement : `SMTP_USER`, `SMTP_PASSWORD`, etc.

3. Essayez de supprimer toutes les variables et de les re-ajouter une par une

