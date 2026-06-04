# Configuration de la suppression de compte utilisateur

## Système simple et automatique

La suppression de compte utilisateur fonctionne maintenant via une fonction SQL dans Supabase. C'est simple, fonctionne en local ET en ligne, sans configuration supplémentaire !

## Installation (une seule fois)

### 1. Exécuter la fonction SQL dans Supabase

1. Allez sur votre [Supabase Dashboard](https://app.supabase.com/)
2. Sélectionnez votre projet
3. Allez dans **SQL Editor**
4. Ouvrez le fichier `scripts/delete-user-function.sql`
5. Copiez tout le contenu
6. Collez-le dans l'éditeur SQL
7. Cliquez sur **Run** (ou appuyez sur `Ctrl+Enter`)

C'est tout ! La fonction est maintenant disponible dans votre base de données.

## Comment ça fonctionne

Quand un admin supprime un client depuis le dashboard :

1. ✅ Vérifie que l'utilisateur est bien un administrateur
2. ✅ Empêche la suppression de son propre compte
3. ✅ Empêche la suppression d'autres administrateurs
4. ✅ Supprime l'utilisateur de `auth.users` (authentification)
5. ✅ Supprime le profil de `public.users` (cascade automatique)
6. ✅ Supprime toutes les données associées (transactions, messages, etc.)

## Utilisation

Une fois la fonction installée, la suppression fonctionne automatiquement depuis le dashboard admin :

1. Connectez-vous en tant qu'administrateur
2. Trouvez le client à supprimer dans la liste
3. Cliquez sur l'icône **poubelle** (🗑️)
4. Confirmez la suppression dans la modale

Le compte sera supprimé complètement !

## Avantages de cette approche

- ✅ **Simple** : Une seule fonction SQL à installer
- ✅ **Fonctionne partout** : En local ET en ligne
- ✅ **Sécurisé** : Vérifie les permissions avant suppression
- ✅ **Automatique** : Supprime tout en cascade
- ✅ **Pas de configuration** : Pas besoin de variables d'environnement supplémentaires

## Dépannage

### La fonction retourne une erreur de permissions

Si vous voyez une erreur comme "insufficient_privilege", la fonction essaiera quand même de supprimer au moins le profil utilisateur. L'utilisateur ne pourra plus se connecter, mais l'enregistrement dans `auth.users` pourrait rester.

**Solution** : Exécutez la fonction SQL en tant que superuser dans Supabase, ou contactez le support Supabase pour obtenir les permissions nécessaires.

### L'utilisateur n'est pas supprimé complètement

Si seulement le profil est supprimé mais pas l'authentification :
- Le client ne pourra plus se connecter (pas de profil = pas d'accès)
- Vous pouvez nettoyer manuellement `auth.users` depuis le dashboard Supabase si nécessaire

### Test de la fonction

Pour tester la fonction directement :

```sql
-- Remplacez 'user-id-here' par l'ID d'un utilisateur à supprimer
SELECT delete_user('user-id-here');
```

## Support

Si vous rencontrez des problèmes :
1. Vérifiez que la fonction est bien installée dans Supabase
2. Vérifiez les logs dans la console du navigateur
3. Vérifiez les logs Supabase dans le dashboard

