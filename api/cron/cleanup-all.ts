import { createClient } from '@supabase/supabase-js';
import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * Vercel Cron Job - Cleanup All (Combined)
 * Runs every 3 days at 3:00 AM UTC
 * Combines:
 * - Cleanup read messages (> 3 months)
 * - Delete very old messages from archive (> 1 year)
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
    const results = {
      cleanupRead: 0,
      deleteOld: 0,
      errors: [] as string[]
    };

    // 1. Cleanup read messages (> 3 months)
    try {
      const { data: cleanupData, error: cleanupError } = await supabase.rpc('cleanup_read_messages');
      if (cleanupError) {
        results.errors.push(`Cleanup read messages error: ${cleanupError.message}`);
      } else {
        results.cleanupRead = cleanupData || 0;
      }
    } catch (error: any) {
      results.errors.push(`Cleanup read messages exception: ${error.message}`);
    }

    // 2. Delete very old messages from archive (> 1 year)
    // Only run on the 1st of the month (check date)
    const today = new Date();
    if (today.getDate() === 1) {
      try {
        const { data: deleteData, error: deleteError } = await supabase.rpc('delete_very_old_messages');
        if (deleteError) {
          results.errors.push(`Delete old messages error: ${deleteError.message}`);
        } else {
          results.deleteOld = deleteData || 0;
        }
      } catch (error: any) {
        results.errors.push(`Delete old messages exception: ${error.message}`);
      }
    }

    return res.status(200).json({
      success: true,
      cleanupReadCount: results.cleanupRead,
      deleteOldCount: results.deleteOld,
      errors: results.errors.length > 0 ? results.errors : undefined,
      message: `Cleaned up ${results.cleanupRead} read messages${results.deleteOld > 0 ? ` and deleted ${results.deleteOld} very old messages` : ''}`
    });
  } catch (error: any) {
    console.error('Unexpected error:', error);
    return res.status(500).json({ error: error.message, success: false });
  }
}

