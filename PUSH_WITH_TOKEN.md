# 🔐 Comment pousser avec un Personal Access Token

## Méthode 1 : Utiliser le token directement

Quand Git vous demande le mot de passe, utilisez le token au lieu de votre mot de passe.

```bash
git push -u origin main
# Username: marcavo77
# Password: [COLLEZ VOTRE TOKEN ICI]
```

## Méthode 2 : L'intégrer dans l'URL (Optionnel)

Si vous voulez éviter de le taper à chaque fois (mais moins sécurisé) :

```bash
git remote set-url origin https://VOTRE_TOKEN@github.com/marcavo77/novabank.git
git push -u origin main
```

## Méthode 3 : Utiliser Git Credential Manager (Recommandé)

Le token sera sauvegardé de manière sécurisée :

```bash
git push -u origin main
# Quand demandé :
# Username: marcavo77
# Password: [VOTRE TOKEN]
# Git sauvegardera le token automatiquement
```

