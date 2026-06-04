-- Function to delete a user completely (auth + profile + related data)
-- This function can only be called by admins
-- Usage: SELECT delete_user('user-id-to-delete');

CREATE OR REPLACE FUNCTION delete_user(target_user_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = auth, public
AS $$
DECLARE
  caller_user_id UUID;
  caller_role TEXT;
  target_user_name TEXT;
  target_user_email TEXT;
  deleted_count INTEGER := 0;
BEGIN
  -- Get the current user (admin calling this function)
  caller_user_id := auth.uid();
  
  IF caller_user_id IS NULL THEN
    RAISE EXCEPTION 'You must be authenticated to delete users';
  END IF;
  
  -- Verify caller is an admin
  SELECT role INTO caller_role
  FROM public.users
  WHERE id = caller_user_id;
  
  IF caller_role IS NULL OR caller_role != 'ADMIN' THEN
    RAISE EXCEPTION 'Only administrators can delete users';
  END IF;
  
  -- Prevent admin from deleting themselves
  IF caller_user_id = target_user_id THEN
    RAISE EXCEPTION 'You cannot delete your own account';
  END IF;
  
  -- Get target user info before deletion
  SELECT name, email INTO target_user_name, target_user_email
  FROM public.users
  WHERE id = target_user_id;
  
  IF target_user_name IS NULL THEN
    RAISE EXCEPTION 'User not found';
  END IF;
  
  -- Prevent deleting other admins
  IF EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = target_user_id AND role = 'ADMIN'
  ) THEN
    RAISE EXCEPTION 'Cannot delete administrator accounts';
  END IF;
  
  -- Delete from auth.users first (requires SECURITY DEFINER to have the right permissions)
  -- This will cascade delete public.users due to the foreign key ON DELETE CASCADE
  -- Note: This requires the function to be created by a superuser or have the right grants
  BEGIN
    DELETE FROM auth.users
    WHERE id = target_user_id;
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
  EXCEPTION
    WHEN insufficient_privilege THEN
      -- If we can't delete from auth.users, delete from public.users only
      -- The user won't be able to login anymore (no profile = no access)
      DELETE FROM public.users
      WHERE id = target_user_id;
      
      GET DIAGNOSTICS deleted_count = ROW_COUNT;
      
      -- Return warning that auth.users was not deleted
      RETURN json_build_object(
        'success', true,
        'warning', 'User profile deleted, but auth record may remain. Manual cleanup may be required.',
        'deleted_user', json_build_object(
          'id', target_user_id,
          'name', target_user_name,
          'email', target_user_email
        )
      );
  END;
  
  -- Return success message with user info
  RETURN json_build_object(
    'success', true,
    'message', 'User deleted successfully',
    'deleted_user', json_build_object(
      'id', target_user_id,
      'name', target_user_name,
      'email', target_user_email
    )
  );
EXCEPTION
  WHEN OTHERS THEN
    -- Return error as JSON
    RETURN json_build_object(
      'success', false,
      'error', SQLERRM
    );
END;
$$;

-- Grant execute permission to authenticated users (admin check is done inside the function)
GRANT EXECUTE ON FUNCTION delete_user(UUID) TO authenticated;

-- Add comment
COMMENT ON FUNCTION delete_user(UUID) IS 'Deletes a user completely from auth.users and public.users. Only admins can call this function.';

