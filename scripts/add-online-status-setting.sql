-- Add show_online_status_to_user column to admin_chat_settings table
ALTER TABLE public.admin_chat_settings
ADD COLUMN IF NOT EXISTS show_online_status_to_user BOOLEAN NOT NULL DEFAULT true;

-- Update existing records to have the default value
UPDATE public.admin_chat_settings
SET show_online_status_to_user = true
WHERE show_online_status_to_user IS NULL;

-- Add comment to explain the column
COMMENT ON COLUMN public.admin_chat_settings.show_online_status_to_user IS 'If true, clients can see when the admin is online. If false, admin online status is hidden from clients.';

