import type { VercelRequest, VercelResponse } from '@vercel/node';
import nodemailer from 'nodemailer';

/**
 * Test endpoint to verify SMTP connection
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

  try {
    const smtpHost = process.env.SMTP_HOST || 'smtp.zoho.com';
    const smtpPort = parseInt(process.env.SMTP_PORT || '587');
    const smtpSecure = process.env.SMTP_SECURE === 'true' || smtpPort === 465;
    const smtpUser = process.env.SMTP_USER;
    const smtpPassword = process.env.SMTP_PASSWORD;

    if (!smtpUser || !smtpPassword) {
      return res.status(500).json({
        error: 'SMTP credentials not configured',
        hasUser: !!smtpUser,
        hasPassword: !!smtpPassword
      });
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpSecure,
      auth: {
        user: smtpUser,
        pass: smtpPassword,
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    // Test connection
    await transporter.verify();

    return res.status(200).json({
      success: true,
      message: 'SMTP connection successful',
      config: {
        host: smtpHost,
        port: smtpPort,
        secure: smtpSecure,
        user: smtpUser,
        passwordLength: smtpPassword.length,
        passwordStartsWith: smtpPassword.substring(0, 1) // First character only for debugging
      }
    });

  } catch (error: any) {
    console.error('SMTP test error:', {
      code: error.code,
      command: error.command,
      response: error.response,
      responseCode: error.responseCode,
      message: error.message
    });

    return res.status(500).json({
      success: false,
      error: 'SMTP connection failed',
      details: {
        code: error.code,
        responseCode: error.responseCode,
        message: error.message,
        response: error.response
      }
    });
  }
}

