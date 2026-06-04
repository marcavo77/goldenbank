-- Script pour permettre aux admins de créer des transactions pour n'importe quel utilisateur
-- À exécuter dans SQL Editor de Supabase

-- Supprimer l'ancienne politique si elle existe
DROP POLICY IF EXISTS "Users can create their own transactions" ON public.transactions;

-- Créer une politique qui permet aux utilisateurs de créer leurs propres transactions
CREATE POLICY "Users can create their own transactions"
  ON public.transactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Créer une politique qui permet aux admins de créer des transactions pour n'importe quel utilisateur
CREATE POLICY "Admins can create transactions for any user"
  ON public.transactions FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'ADMIN'
    )
  );

-- Vérifier que les politiques sont bien créées
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'transactions'
ORDER BY policyname;

