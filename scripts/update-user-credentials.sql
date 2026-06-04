-- Function to update user email and/or password in auth.users
-- This function allows updating credentials directly in auth.users table
-- Usage: 
--   SELECT update_user_credentials('user-email@example.com', 'new-email@example.com', NULL); -- Update email only
--   SELECT update_user_credentials('user-email@example.com', NULL, 'newpassword'); -- Update password only
--   SELECT update_user_credentials('user-email@example.com', 'new-email@example.com', 'newpassword'); -- Update both

CREATE OR REPLACE FUNCTION update_user_credentials(
  old_email TEXT,
  new_email TEXT DEFAULT NULL,
  new_password TEXT DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = auth, public
AS $$
DECLARE
  user_record RECORD;
  encrypted_password TEXT;
BEGIN
  -- Find the user by old email
  SELECT * INTO user_record
  FROM auth.users
  WHERE email = old_email
  LIMIT 1;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'User with email % not found', old_email;
  END IF;
  
  -- Update email if provided
  IF new_email IS NOT NULL AND new_email != old_email THEN
    UPDATE auth.users
    SET
      email = new_email,
      email_confirmed_at = COALESCE(email_confirmed_at, NOW()),
      updated_at = NOW()
    WHERE id = user_record.id;
    
    -- Also update in public.users
    UPDATE public.users
    SET email = new_email
    WHERE id = user_record.id;
  END IF;
  
  -- Update password if provided
  IF new_password IS NOT NULL THEN
    -- Note: We need to hash the password using the same method Supabase uses
    -- Supabase uses crypt() function from pgcrypto extension
    encrypted_password := crypt(new_password, gen_salt('bf'));
    
    UPDATE auth.users
    SET
      encrypted_password = encrypted_password,
      updated_at = NOW()
    WHERE id = user_record.id;
  END IF;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION update_user_credentials(TEXT, TEXT, TEXT) TO authenticated;

-- Enable pgcrypto extension if not already enabled
CREATE EXTENSION IF NOT EXISTS pgcrypto;

