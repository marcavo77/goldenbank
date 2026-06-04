-- Create admin_chat_settings table
CREATE TABLE IF NOT EXISTS public.admin_chat_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  show_read_receipts_to_user BOOLEAN NOT NULL DEFAULT true,
  show_typing_to_user BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(admin_id)
);

-- Enable RLS
ALTER TABLE public.admin_chat_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policy: All authenticated users can view admin chat settings (needed for clients to respect settings)
CREATE POLICY "All users can view admin chat settings"
  ON public.admin_chat_settings FOR SELECT
  USING (
    auth.uid() IS NOT NULL AND
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid()
    )
  );

-- RLS Policy: Only admins can view their own settings (keeping for backward compatibility)
CREATE POLICY "Admins can view their own chat settings"
  ON public.admin_chat_settings FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'ADMIN'
    )
  );

CREATE POLICY "Admins can update their own chat settings"
  ON public.admin_chat_settings FOR UPDATE
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

CREATE POLICY "Admins can insert their own chat settings"
  ON public.admin_chat_settings FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'ADMIN'
    )
    AND admin_id = auth.uid()
  );

-- Initialize default settings for existing admin users
INSERT INTO public.admin_chat_settings (admin_id, show_read_receipts_to_user, show_typing_to_user)
SELECT id, true, true
FROM public.users
WHERE role = 'ADMIN'
ON CONFLICT (admin_id) DO NOTHING;

