# 🔧 Solution : Variables d'environnement non disponibles après import

## ⚠️ Problème identifié

Les variables SMTP sont importées mais pas disponibles dans les fonctions serverless. Cela signifie qu'elles ne sont probablement **pas liées au projet**.

## ✅ Solution : Vérifier et lier les variables au projet

### Étape 1 : Vérifier que les variables sont bien liées au projet

1. Allez sur **Vercel** → Votre projet → **Settings** → **Environment Variables**
2. Pour **chaque variable SMTP**, regardez la colonne "Linked To Projects"
3. **Si la colonne est vide ou ne mentionne pas votre projet**, c'est le problème !

### Étape 2 : Lier les variables au projet

**Option A : Si les variables NE SONT PAS liées au projet**

1. Cliquez sur les **"..."** (trois points) à droite de chaque variable
2. Cliquez sur **"Edit"**
3. Dans la section **"Link To Projects"** :
   - Cliquez sur le champ de recherche
   - Sélectionnez votre projet **novabank** (ou le nom de votre projet)
   - Le projet devrait apparaître dans la liste
4. Assurez-vous que **"Production"** est coché
5. Cliquez sur **"Save"**

**Option B : Supprimer et re-créer les variables (si Option A ne fonctionne pas)**

1. **Supprimez toutes les variables SMTP** (une par une, avec les "..." → Delete)
2. **Re-créez-les une par une** manuellement (sans utiliser Import) :
   - Cliquez sur **"Add New"**
   - Entrez la **Key** et la **Value**
   - **IMPORTANT** : Avant de cliquer sur "Save", cliquez sur **"Link To Projects"**
   - Sélectionnez votre projet dans la liste
   - Cochez **"Production"**
   - Cliquez sur **"Save"**

### Variables à créer (une par une) :

1. **SMTP_HOST** = `smtp.zoho.com`
2. **SMTP_PORT** = `587`
3. **SMTP_SECURE** = `false`
4. **SMTP_USER** = `contact@novabank.company`
5. **SMTP_PASSWORD** = `$V!6uGw7gzrvd4#`
6. **CONTACT_EMAIL** = `contact@novabank.company`
7. **FROM_EMAIL** = `contact@novabank.company`

⚠️ **Pour chaque variable** :
- ✅ Cocher **"Production"**
- ✅ Cocher **"Preview"** (optionnel mais recommandé)
- ✅ **S'assurer que le projet est sélectionné dans "Link To Projects"**

### Étape 3 : Redéployer depuis Vercel

1. Allez dans **"Deployments"**
2. Cliquez sur les **"..."** du dernier déploiement
3. Sélectionnez **"Redeploy"**
4. **DÉCOCHEZ** "Use existing Build Cache" si l'option est présente
5. Cliquez sur **"Redeploy"**

### Étape 4 : Vérifier

1. Attendez 1-2 minutes que le redéploiement se termine
2. Visitez `https://novabank.company/api/test-env`
3. Vous devriez maintenant voir `"SET"` au lieu de `"MISSING"` pour toutes les variables SMTP
4. Testez le formulaire de contact

## 🐛 Si ça ne fonctionne toujours pas

Si après ces étapes les variables sont toujours manquantes, il peut y avoir un problème avec :

1. **Le caractère `$` dans le mot de passe** : Essayez d'échapper le `$` en doublant : `$$V!6uGw7gzrvd4#`
2. **Les caractères spéciaux** : Vercel peut avoir des problèmes avec certains caractères. Essayez de changer temporairement le mot de passe pour tester.

