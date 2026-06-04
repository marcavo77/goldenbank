-- Function to confirm user email in auth.users
-- This function can be called after updating an email to automatically confirm it
-- Usage: SELECT confirm_user_email('user-email@example.com');

CREATE OR REPLACE FUNCTION confirm_user_email(user_email TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE auth.users
  SET
    email_confirmed_at = COALESCE(email_confirmed_at, NOW()),
    updated_at = NOW(),
    email = user_email
  WHERE email = user_email;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'User with email % not found', user_email;
  END IF;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION confirm_user_email(TEXT) TO authenticated;

