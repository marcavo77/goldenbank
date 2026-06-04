# Création de l'utilisateur Admin

Pour créer l'utilisateur admin avec les identifiants :
- **Email** : `admin@azurbank.company`
- **Mot de passe** : `0123456789`

## Méthode 1 : Script automatique (Recommandé si vous avez la SERVICE_ROLE_KEY)

### Prérequis
Récupérez votre **SERVICE_ROLE_KEY** dans Supabase Dashboard :
1. Allez dans **Settings** > **API**
2. Copiez la **service_role** key (⚠️ gardez-la secrète!)

### Étapes

1. **Ajoutez la clé dans votre `.env`** :
```env
SUPABASE_SERVICE_ROLE_KEY=votre_service_role_key_ici
```

2. **Installez dotenv** (si pas déjà installé) :
```bash
npm install dotenv
```

3. **Exécutez le script** :
```bash
node scripts/create-admin.js
```

Le script créera automatiquement :
- L'utilisateur dans Supabase Auth
- Le profil dans la table `users` avec le rôle ADMIN

## Méthode 2 : Manuel (Sans SERVICE_ROLE_KEY)

### Étape 1 : Créer l'utilisateur dans Supabase Auth

1. Allez dans votre **Supabase Dashboard**
2. Navigation : **Authentication** > **Users**
3. Cliquez sur **"Add user"** > **"Create new user"**
4. Remplissez :
   - **Email** : `admin@azurbank.company`
   - **Password** : `0123456789`
   - Décochez **"Auto Confirm User"** (puis confirmez manuellement après création)
5. Cliquez sur **"Create user"**
6. **Important** : Notez l'**UUID** de l'utilisateur créé (ou vous pouvez le trouver dans la liste)

### Étape 2 : Créer/Mettre à jour le profil dans la base de données

1. Allez dans **SQL Editor** dans Supabase Dashboard
2. Copiez et exécutez le contenu du fichier `scripts/create-admin.sql`

Le script SQL :
- Trouvera automatiquement l'utilisateur par email
- Créera le profil dans la table `users` avec le rôle `ADMIN`
- Ou mettra à jour le rôle si le profil existe déjà

### Vérification

Après avoir exécuté le script SQL, vous devriez voir :
```
Profil admin créé/mis à jour avec succès
```

Et une ligne avec :
- name: Super Administrator
- email: admin@azurbank.company
- role: ADMIN
- balance: 999999999

## Connexion

Une fois créé, vous pouvez vous connecter à l'application avec :
- **Email** : `admin@azurbank.company`
- **Mot de passe** : `0123456789`

Vous serez redirigé vers le tableau de bord admin.

