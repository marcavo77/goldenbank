# 🔐 Guide d'Authentification GitHub

## Option 1 : Personal Access Token (Recommandé)

### 1. Créer un Token sur GitHub

1. Allez sur GitHub.com → **Settings** (votre profil) → **Developer settings**
2. Cliquez sur **Personal access tokens** → **Tokens (classic)**
3. Cliquez sur **Generate new token** → **Generate new token (classic)**
4. Donnez un nom au token (ex: "NovaBank Deployment")
5. Sélectionnez les scopes :
   - ✅ `repo` (Full control of private repositories)
6. Cliquez sur **Generate token**
7. **IMPORTANT** : Copiez le token immédiatement (vous ne le verrez plus après)

### 2. Utiliser le Token pour Push

Quand Git vous demande le mot de passe, utilisez le token au lieu du mot de passe.

**OU** modifiez l'URL pour inclure le token :

```bash
git remote set-url origin https://VOTRE_TOKEN@github.com/marcavo77/novabank.git
```

## Option 2 : GitHub CLI (Plus Simple)

Installez GitHub CLI et authentifiez-vous :

```bash
# Installer GitHub CLI (si pas déjà installé)
# Windows: winget install GitHub.cli
# Ou téléchargez depuis: https://cli.github.com

# S'authentifier
gh auth login
```

## Option 3 : GitHub Desktop

1. Téléchargez GitHub Desktop
2. Connectez-vous avec votre compte GitHub
3. Ajoutez le repository local
4. Push depuis l'interface graphique

## Option 4 : SSH (Si vous avez une clé SSH)

Si vous avez déjà configuré SSH :

```bash
git remote set-url origin git@github.com:marcavo77/novabank.git
git push -u origin main
```

