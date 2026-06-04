-- ============================================
-- OPTIMISATION DU STOCKAGE DES MESSAGES
-- Pour rester dans le plan gratuit Supabase
-- ============================================

-- 1. CRÉER UNE TABLE D'ARCHIVE POUR LES MESSAGES ANCIENS
-- Les messages > 6 mois seront déplacés ici (consomme moins d'espace)
CREATE TABLE IF NOT EXISTS public.messages_archive (
  id UUID PRIMARY KEY,
  sender_id UUID NOT NULL,
  receiver_id UUID NOT NULL,
  content TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL,
  archived_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index pour recherche rapide dans l'archive
CREATE INDEX IF NOT EXISTS idx_messages_archive_sender ON public.messages_archive(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_archive_receiver ON public.messages_archive(receiver_id);
CREATE INDEX IF NOT EXISTS idx_messages_archive_created ON public.messages_archive(created_at);

-- RLS pour l'archive
ALTER TABLE public.messages_archive ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view archived messages they sent or received"
  ON public.messages_archive FOR SELECT
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

-- 2. FONCTION POUR ARCHIVER LES MESSAGES ANCIENS (> 6 mois)
CREATE OR REPLACE FUNCTION archive_old_messages()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  archived_count INTEGER;
BEGIN
  -- Déplacer les messages > 6 mois vers l'archive
  INSERT INTO public.messages_archive (id, sender_id, receiver_id, content, is_read, created_at)
  SELECT id, sender_id, receiver_id, content, is_read, created_at
  FROM public.messages
  WHERE created_at < NOW() - INTERVAL '6 months';
  
  GET DIAGNOSTICS archived_count = ROW_COUNT;
  
  -- Supprimer les messages archivés de la table principale
  DELETE FROM public.messages
  WHERE created_at < NOW() - INTERVAL '6 months';
  
  RETURN archived_count;
END;
$$;

-- 3. FONCTION POUR SUPPRIMER LES MESSAGES TRÈS ANCIENS (> 1 an)
-- Les messages > 1 an dans l'archive seront supprimés définitivement
CREATE OR REPLACE FUNCTION delete_very_old_messages()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  -- Supprimer les messages > 1 an dans l'archive
  DELETE FROM public.messages_archive
  WHERE created_at < NOW() - INTERVAL '1 year';
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  
  RETURN deleted_count;
END;
$$;

-- 4. FONCTION POUR NETTOYER LES MESSAGES LUS ET ANCIENS (> 3 mois)
-- Les messages lus > 3 mois peuvent être supprimés directement (pas besoin d'archive)
CREATE OR REPLACE FUNCTION cleanup_read_messages()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  -- Supprimer les messages lus > 3 mois
  DELETE FROM public.messages
  WHERE is_read = TRUE 
    AND created_at < NOW() - INTERVAL '3 months';
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  
  RETURN deleted_count;
END;
$$;

-- 5. AJOUTER UNE CONTRAINTE DE LONGUEUR MAXIMALE AU CONTENU
-- Limiter à 2000 caractères par message (réduit significativement l'espace)
ALTER TABLE public.messages 
  ADD CONSTRAINT check_content_length 
  CHECK (LENGTH(content) <= 2000);

ALTER TABLE public.messages_archive 
  ADD CONSTRAINT check_archive_content_length 
  CHECK (LENGTH(content) <= 2000);

-- 6. CRÉER UN INDEX PARTIEL POUR LES MESSAGES NON LUS
-- Optimise les requêtes pour les notifications (messages non lus récents)
CREATE INDEX IF NOT EXISTS idx_messages_unread_recent 
  ON public.messages(created_at DESC) 
  WHERE is_read = FALSE;

-- 7. OPTIMISER L'INDEX EXISTANT SUR CREATED_AT
-- Index pour tri rapide par date
CREATE INDEX IF NOT EXISTS idx_messages_created_at 
  ON public.messages(created_at DESC);

-- 8. FONCTION POUR OBTENIR LES STATISTIQUES DE STOCKAGE
CREATE OR REPLACE FUNCTION get_messages_storage_stats()
RETURNS TABLE (
  total_messages BIGINT,
  archived_messages BIGINT,
  messages_size_mb NUMERIC,
  archive_size_mb NUMERIC,
  oldest_message_date TIMESTAMPTZ,
  messages_to_archive BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    (SELECT COUNT(*) FROM public.messages)::BIGINT as total_messages,
    (SELECT COUNT(*) FROM public.messages_archive)::BIGINT as archived_messages,
    (SELECT pg_size_pretty(pg_total_relation_size('public.messages'))::TEXT)::NUMERIC as messages_size_mb,
    (SELECT pg_size_pretty(pg_total_relation_size('public.messages_archive'))::TEXT)::NUMERIC as archive_size_mb,
    (SELECT MIN(created_at) FROM public.messages) as oldest_message_date,
    (SELECT COUNT(*) FROM public.messages WHERE created_at < NOW() - INTERVAL '6 months')::BIGINT as messages_to_archive;
END;
$$;

-- 9. CRÉER UN JOB AUTOMATIQUE (via pg_cron si disponible)
-- Note: pg_cron nécessite l'extension activée sur Supabase
-- Sinon, utilisez un cron externe ou un service cloud (Vercel Cron, etc.)

-- Activer pg_cron (si disponible)
-- CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Planifier l'archivage automatique (tous les jours à 2h du matin)
-- SELECT cron.schedule(
--   'archive-old-messages',
--   '0 2 * * *', -- Tous les jours à 2h
--   $$SELECT archive_old_messages();$$
-- );

-- Planifier le nettoyage des messages lus (tous les 3 jours à 3h)
-- SELECT cron.schedule(
--   'cleanup-read-messages',
--   '0 3 */3 * *', -- Tous les 3 jours à 3h
--   $$SELECT cleanup_read_messages();$$
-- );

-- Planifier la suppression des messages très anciens (tous les mois)
-- SELECT cron.schedule(
--   'delete-very-old-messages',
--   '0 4 1 * *', -- Le 1er de chaque mois à 4h
--   $$SELECT delete_very_old_messages();$$
-- );

-- ============================================
-- INSTRUCTIONS D'UTILISATION
-- ============================================
-- 1. Exécutez ce script dans Supabase SQL Editor
-- 2. Pour archiver manuellement : SELECT archive_old_messages();
-- 3. Pour voir les stats : SELECT * FROM get_messages_storage_stats();
-- 4. Pour automatiser, utilisez un cron externe ou activez pg_cron sur Supabase

