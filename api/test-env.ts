import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * Test endpoint to check if environment variables are accessible
 * DELETE THIS FILE AFTER DEBUGGING
 */
export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  // Only allow GET requests for testing
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Get all environment variables (without exposing sensitive values)
  const allEnvKeys = Object.keys(process.env).sort();
  const smtpRelatedKeys = allEnvKeys.filter(key => 
    key.includes('SMTP') || key.includes('CONTACT') || key.includes('FROM')
  );
  
  const envCheck = {
    smtpHost: process.env.SMTP_HOST ? 'SET' : 'MISSING',
    smtpPort: process.env.SMTP_PORT ? 'SET' : 'MISSING',
    smtpSecure: process.env.SMTP_SECURE ? 'SET' : 'MISSING',
    smtpUser: process.env.SMTP_USER ? 'SET (value hidden)' : 'MISSING',
    smtpPassword: process.env.SMTP_PASSWORD ? 'SET (value hidden)' : 'MISSING',
    contactEmail: process.env.CONTACT_EMAIL ? 'SET' : 'MISSING',
    fromEmail: process.env.FROM_EMAIL ? 'SET' : 'MISSING',
    smtpRelatedKeys: smtpRelatedKeys.length > 0 ? smtpRelatedKeys : 'none found',
    totalEnvKeys: allEnvKeys.length,
    sampleEnvKeys: allEnvKeys.slice(0, 20), // First 20 env keys to see what's available
    vercelEnv: process.env.VERCEL_ENV,
    nodeEnv: process.env.NODE_ENV
  };

  return res.status(200).json({
    message: 'Environment variables check',
    env: envCheck,
    note: 'Check if SMTP_USER and SMTP_PASSWORD are SET. If MISSING, the variables are not accessible in this function.',
    allEnvKeys: allEnvKeys // Show ALL keys to debug
  });
}

