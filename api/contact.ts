import type { VercelRequest, VercelResponse } from '@vercel/node';
import nodemailer from 'nodemailer';

// Helper function to escape HTML to prevent XSS
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Declare SMTP vars outside try block so they're accessible in catch block
  const smtpHost = process.env.SMTP_HOST || process.env.VERCEL_ENV_SMTP_HOST || 'smtp.zoho.com';
  const smtpPort = parseInt(process.env.SMTP_PORT || process.env.VERCEL_ENV_SMTP_PORT || '587');

  try {
    const { firstName, lastName, email, message } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !message) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['firstName', 'lastName', 'email', 'message']
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Get SMTP configuration from environment variables
    const smtpSecure = (process.env.SMTP_SECURE || process.env.VERCEL_ENV_SMTP_SECURE) === 'true' || smtpPort === 465;
    const smtpUser = process.env.SMTP_USER || process.env.VERCEL_ENV_SMTP_USER || process.env.SMTP_EMAIL || process.env.VERCEL_ENV_SMTP_EMAIL;
    const smtpPassword = process.env.SMTP_PASS || process.env.VERCEL_ENV_SMTP_PASS || process.env.SMTP_PASSWORD || process.env.VERCEL_ENV_SMTP_PASSWORD;
    const recipientEmail = process.env.CONTACT_EMAIL || process.env.VERCEL_ENV_CONTACT_EMAIL || 'contact@goldenbank.company';
    const fromEmail = process.env.FROM_EMAIL || process.env.VERCEL_ENV_FROM_EMAIL || smtpUser || 'contact@goldenbank.company';

    // Debug: Log which variables are missing (without exposing values)
    if (!smtpUser || !smtpPassword) {
      console.error('Missing SMTP credentials:', {
        hasSMTP_USER: !!process.env.SMTP_USER,
        hasSMTP_EMAIL: !!process.env.SMTP_EMAIL,
        hasSMTP_PASSWORD: !!process.env.SMTP_PASSWORD,
        smtpUser: smtpUser || 'NOT SET',
        smtpPassword: smtpPassword ? 'SET (hidden)' : 'NOT SET'
      });
      // Get all SMTP-related env keys for debugging
      const smtpEnvKeys = Object.keys(process.env).filter(key => 
        key.includes('SMTP') || key.includes('CONTACT') || key.includes('FROM')
      );
      
      return res.status(500).json({ 
        error: 'Email service not configured',
        details: `SMTP credentials are missing. SMTP_USER: ${!!smtpUser ? 'SET' : 'MISSING'}, SMTP_PASSWORD: ${!!smtpPassword ? 'SET' : 'MISSING'}. Please configure SMTP_USER and SMTP_PASSWORD environment variables in Vercel Settings → Environment Variables. Make sure to select "Production" environment and redeploy after adding variables.`,
        debug: {
          smtpUserSet: !!smtpUser,
          smtpPasswordSet: !!smtpPassword,
          foundEnvKeys: smtpEnvKeys.length > 0 ? smtpEnvKeys.join(', ') : 'No SMTP-related env variables found'
        }
      });
    }

    // Create transporter for Zoho SMTP
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpSecure, // true for 465, false for other ports
      auth: {
        user: smtpUser,
        pass: smtpPassword,
      },
      // Zoho specific settings
      tls: {
        rejectUnauthorized: false // Some Zoho configurations may require this
      }
    });

    // Escape user input to prevent XSS
    const safeFirstName = escapeHtml(firstName);
    const safeLastName = escapeHtml(lastName);
    const safeEmail = escapeHtml(email);
    // For message, we allow line breaks but escape HTML
    const safeMessage = escapeHtml(message).replace(/\n/g, '<br>');

    // Email content
    const mailOptions = {
      from: `Golden Bank Contact Form <${fromEmail}>`,
      to: recipientEmail,
      replyTo: `${safeFirstName} ${safeLastName} <${safeEmail}>`,
      subject: `Nouveau message de contact - ${safeFirstName} ${safeLastName} (${safeEmail})`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #22e6e8; border-bottom: 2px solid #22e6e8; padding-bottom: 10px;">
            Nouveau message depuis le formulaire de contact
          </h2>
          
          <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Prénom:</strong> ${safeFirstName}</p>
            <p><strong>Nom:</strong> ${safeLastName}</p>
            <p><strong>Email:</strong> <a href="mailto:${safeEmail}">${safeEmail}</a></p>
          </div>
          
          <div style="background-color: #ffffff; padding: 20px; border-left: 4px solid #22e6e8; margin: 20px 0;">
            <h3 style="color: #1f2937; margin-top: 0;">Message:</h3>
            <p style="color: #4b5563; white-space: pre-wrap; line-height: 1.6;">${safeMessage}</p>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 12px;">
            <p>Ce message a été envoyé depuis le formulaire de contact d'Golden Bank.</p>
            <p>Vous pouvez répondre directement à cet email pour répondre à ${safeFirstName} ${safeLastName}.</p>
          </div>
        </div>
      `,
      text: `
Nouveau message depuis le formulaire de contact Golden Bank

Prénom: ${firstName}
Nom: ${lastName}
Email: ${email}

Message:
${message}

---
Ce message a été envoyé depuis le formulaire de contact d'Golden Bank.
Vous pouvez répondre directement à cet email pour répondre à ${firstName} ${lastName}.
      `.trim(),
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);

    return res.status(200).json({ 
      success: true,
      messageId: info.messageId,
      message: 'Email sent successfully'
    });

  } catch (error: any) {
    console.error('Error processing contact form:', {
      code: error.code,
      command: error.command,
      response: error.response,
      responseCode: error.responseCode,
      message: error.message,
      stack: error.stack
    });
    
    // Provide more specific error messages
    let errorMessage = 'Internal server error';
    let errorDetails: any = {};
    
    if (error.code === 'EAUTH') {
      errorMessage = 'SMTP authentication failed. Please check your email credentials (username and password).';
      errorDetails = { code: 'EAUTH', suggestion: 'Verify SMTP_USER and SMTP_PASSWORD are correct in Vercel environment variables' };
    } else if (error.code === 'ECONNECTION') {
      errorMessage = 'Could not connect to SMTP server. Please check your SMTP settings.';
      errorDetails = { code: 'ECONNECTION', host: smtpHost, port: smtpPort, suggestion: 'Verify SMTP_HOST and SMTP_PORT are correct' };
    } else if (error.responseCode) {
      errorMessage = `SMTP server error (code ${error.responseCode}): ${error.response || error.message}`;
      errorDetails = { responseCode: error.responseCode, response: error.response };
    } else if (error.message) {
      errorMessage = error.message;
      errorDetails = { message: error.message };
    }

    return res.status(500).json({ 
      error: 'Failed to send email',
      details: errorMessage,
      debug: errorDetails
    });
  }
}
