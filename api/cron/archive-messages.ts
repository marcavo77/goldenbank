import { createClient } from '@supabase/supabase-js';
import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * Vercel Cron Job - Archive Old Messages
 * Runs daily at 2:00 AM UTC
 * Archives messages older than 6 months
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Verify the request is from Vercel Cron
  const authHeader = req.headers.authorization;
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    return res.status(500).json({ error: 'Missing Supabase environment variables' });
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    // Call the archive_old_messages function
    const { data, error } = await supabase.rpc('archive_old_messages');

    if (error) {
      console.error('Error archiving messages:', error);
      return res.status(500).json({ error: error.message, success: false });
    }

    return res.status(200).json({ 
      success: true, 
      archivedCount: data || 0,
      message: `Archived ${data || 0} messages`
    });
  } catch (error: any) {
    console.error('Unexpected error:', error);
    return res.status(500).json({ error: error.message, success: false });
  }
}

