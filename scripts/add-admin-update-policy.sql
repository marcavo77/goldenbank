-- Add RLS policy to allow admins to update any user's balance
-- This is required for admin dashboard operations

-- Drop the policy if it exists (to allow re-running this script)
DROP POLICY IF EXISTS "Admins can update any user" ON public.users;

-- Create policy for admins to update any user
CREATE POLICY "Admins can update any user"
  ON public.users FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'ADMIN'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'ADMIN'
    )
  );

