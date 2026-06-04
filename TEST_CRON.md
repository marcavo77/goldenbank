# 🧪 Tester les Cron Jobs

## Obtenir votre URL Vercel

Votre application est déployée sur une URL comme :
- `https://novabank.vercel.app` (ou similaire)

## Tester manuellement

### 1. Tester l'archivage

Remplacez `VOTRE_URL_VERCEL` par votre URL et `VOTRE_CRON_SECRET` par votre secret :

```bash
curl -X GET "https://VOTRE_URL_VERCEL/api/cron/archive-messages" \
  -H "Authorization: Bearer VOTRE_CRON_SECRET"
```

### 2. Tester le nettoyage

```bash
curl -X GET "https://VOTRE_URL_VERCEL/api/cron/cleanup-all" \
  -H "Authorization: Bearer VOTRE_CRON_SECRET"
```

## Réponse attendue

Si tout fonctionne, vous devriez voir :
```json
{
  "success": true,
  "archivedCount": 0,
  "message": "Archived 0 messages"
}
```

## Vérifier les statistiques dans Supabase

Dans Supabase SQL Editor, exécutez :

```sql
SELECT * FROM get_messages_storage_stats();
```

