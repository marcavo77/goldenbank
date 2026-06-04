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

// Translations for transaction validation email
const VALIDATION_EMAIL_TRANSLATIONS: Record<string, Record<string, string>> = {
  fr: {
    subject: 'Code de validation requis pour votre transfert - Golden Bank',
    greeting: 'Bonjour',
    title: 'Vérification de Sécurité Requise',
    message1: 'Votre transfert nécessite une vérification de sécurité.',
    message2: 'Un code de validation unique a été généré et transmis à l\'administrateur.',
    message3: 'Pour continuer le transfert et libérer les fonds, veuillez contacter l\'administrateur pour obtenir le code de validation et l\'entrer dans l\'application Golden Bank.',
    progress: 'Progression du transfert',
    amount: 'Montant',
    recipient: 'Bénéficiaire',
    securityDesc: 'Protocole de sécurité activé. Un code de validation unique a été transmis à l\'administrateur.',
    securityDesc2: 'Veuillez entrer le code pour libérer les fonds.',
    codeLabel: 'Votre code de validation',
    instructions: 'Instructions',
    instruction1: '1. Ouvrez votre application Golden Bank',
    instruction2: '2. Allez sur la page de transfert',
    instruction3: '3. Contactez l\'administrateur pour obtenir le code de validation',
    instruction4: '4. Entrez le code dans le champ de validation et cliquez sur "VALIDER"',
    footer: 'Cordialement,',
    footerTeam: 'L\'équipe Golden Bank',
    footerNote: 'Cet email a été envoyé automatiquement pour votre sécurité. Ne partagez jamais ce code avec personne.',
    footerSecurity: 'Pour votre sécurité, ce code expire une fois utilisé ou après un certain temps.'
  },
  en: {
    subject: 'Validation code required for your transfer - Golden Bank',
    greeting: 'Hello',
    title: 'Security Verification Required',
    message1: 'Your transfer requires security verification.',
    message2: 'A unique validation code has been generated and sent to the administrator.',
    message3: 'To continue the transfer and release the funds, please contact the administrator to obtain the validation code and enter it in the Golden Bank application.',
    progress: 'Transfer progress',
    amount: 'Amount',
    recipient: 'Recipient',
    securityDesc: 'Security protocol activated. A unique validation code has been sent to the administrator.',
    securityDesc2: 'Please enter the code to release the funds.',
    codeLabel: 'Your validation code',
    instructions: 'Instructions',
    instruction1: '1. Open your Golden Bank application',
    instruction2: '2. Go to the transfer page',
    instruction3: '3. Contact the administrator to obtain the validation code',
    instruction4: '4. Enter the code in the validation field and click "VALIDATE"',
    footer: 'Best regards,',
    footerTeam: 'The Golden Bank Team',
    footerNote: 'This email was sent automatically for your security. Never share this code with anyone.',
    footerSecurity: 'For your security, this code expires once used or after a certain time.'
  },
  es: {
    subject: 'Código de validación requerido para su transferencia - Golden Bank',
    greeting: 'Hola',
    title: 'Verificación de Seguridad Requerida',
    message1: 'Su transferencia requiere verificación de seguridad.',
    message2: 'Se ha generado y enviado un código de validación único al administrador.',
    message3: 'Para continuar la transferencia y liberar los fondos, por favor contacte al administrador para obtener el código de validación e ingréselo en la aplicación Golden Bank.',
    progress: 'Progreso de la transferencia',
    amount: 'Cantidad',
    recipient: 'Beneficiario',
    securityDesc: 'Protocolo de seguridad activado. Se ha enviado un código de validación único al administrador.',
    securityDesc2: 'Por favor, ingrese el código para liberar los fondos.',
    codeLabel: 'Su código de validación',
    instructions: 'Instrucciones',
    instruction1: '1. Abra su aplicación Golden Bank',
    instruction2: '2. Vaya a la página de transferencia',
    instruction3: '3. Contacte al administrador para obtener el código de validación',
    instruction4: '4. Ingrese el código en el campo de validación y haga clic en "VALIDAR"',
    footer: 'Saludos cordiales,',
    footerTeam: 'El equipo Golden Bank',
    footerNote: 'Este correo electrónico fue enviado automáticamente para su seguridad. Nunca comparta este código con nadie.',
    footerSecurity: 'Para su seguridad, este código expira una vez usado o después de cierto tiempo.'
  },
  de: {
    subject: 'Validierungscode für Ihre Überweisung erforderlich - Golden Bank',
    greeting: 'Hallo',
    title: 'Sicherheitsüberprüfung Erforderlich',
    message1: 'Ihre Überweisung erfordert eine Sicherheitsüberprüfung.',
    message2: 'Ein eindeutiger Validierungscode wurde generiert und an den Administrator gesendet.',
    message3: 'Um die Überweisung fortzusetzen und die Gelder freizugeben, kontaktieren Sie bitte den Administrator, um den Validierungscode zu erhalten und geben Sie ihn in der Golden Bank-Anwendung ein.',
    progress: 'Überweisungsfortschritt',
    amount: 'Betrag',
    recipient: 'Empfänger',
    securityDesc: 'Sicherheitsprotokoll aktiviert. Ein eindeutiger Validierungscode wurde an den Administrator gesendet.',
    securityDesc2: 'Bitte geben Sie den Code ein, um die Gelder freizugeben.',
    codeLabel: 'Ihr Validierungscode',
    instructions: 'Anweisungen',
    instruction1: '1. Öffnen Sie Ihre Golden Bank-Anwendung',
    instruction2: '2. Gehen Sie zur Überweisungsseite',
    instruction3: '3. Kontaktieren Sie den Administrator, um den Validierungscode zu erhalten',
    instruction4: '4. Geben Sie den Code in das Validierungsfeld ein und klicken Sie auf "VALIDIEREN"',
    footer: 'Mit freundlichen Grüßen,',
    footerTeam: 'Das Golden Bank Team',
    footerNote: 'Diese E-Mail wurde automatisch zu Ihrer Sicherheit gesendet. Teilen Sie diesen Code niemals mit jemandem.',
    footerSecurity: 'Zu Ihrer Sicherheit läuft dieser Code ab, sobald er verwendet wurde oder nach einer bestimmten Zeit.'
  },
  it: {
    subject: 'Codice di validazione richiesto per il tuo trasferimento - Golden Bank',
    greeting: 'Ciao',
    title: 'Verifica di Sicurezza Richiesta',
    message1: 'Il tuo trasferimento richiede una verifica di sicurezza.',
    message2: 'È stato generato e inviato un codice di validazione univoco all\'amministratore.',
    message3: 'Per continuare il trasferimento e rilasciare i fondi, contatta l\'amministratore per ottenere il codice di validazione e inseriscilo nell\'applicazione Golden Bank.',
    progress: 'Progresso del trasferimento',
    amount: 'Importo',
    recipient: 'Beneficiario',
    securityDesc: 'Protocollo di sicurezza attivato. Un codice di validazione univoco è stato inviato all\'amministratore.',
    securityDesc2: 'Si prega di inserire il codice per rilasciare i fondi.',
    codeLabel: 'Il tuo codice di validazione',
    instructions: 'Istruzioni',
    instruction1: '1. Apri la tua applicazione Golden Bank',
    instruction2: '2. Vai alla pagina di trasferimento',
    instruction3: '3. Contatta l\'amministratore per ottenere il codice di validazione',
    instruction4: '4. Inserisci il codice nel campo di validazione e clicca su "VALIDA"',
    footer: 'Cordiali saluti,',
    footerTeam: 'Il team Golden Bank',
    footerNote: 'Questa email è stata inviata automaticamente per la tua sicurezza. Non condividere mai questo codice con nessuno.',
    footerSecurity: 'Per la tua sicurezza, questo codice scade una volta utilizzato o dopo un certo tempo.'
  },
  pt: {
    subject: 'Código de validação necessário para sua transferência - Golden Bank',
    greeting: 'Olá',
    title: 'Verificação de Segurança Necessária',
    message1: 'Sua transferência requer verificação de segurança.',
    message2: 'Um código de validação único foi gerado e enviado ao administrador.',
    message3: 'Para continuar a transferência e liberar os fundos, por favor entre em contato com o administrador para obter o código de validação e digitá-lo no aplicativo Golden Bank.',
    progress: 'Progresso da transferência',
    amount: 'Valor',
    recipient: 'Beneficiário',
    securityDesc: 'Protocolo de segurança ativado. Um código de validação único foi enviado ao administrador.',
    securityDesc2: 'Por favor, digite o código para liberar os fundos.',
    codeLabel: 'Seu código de validação',
    instructions: 'Instruções',
    instruction1: '1. Abra seu aplicativo Golden Bank',
    instruction2: '2. Vá para a página de transferência',
    instruction3: '3. Entre em contato com o administrador para obter o código de validação',
    instruction4: '4. Digite o código no campo de validação e clique em "VALIDAR"',
    footer: 'Atenciosamente,',
    footerTeam: 'A equipe Golden Bank',
    footerNote: 'Este e-mail foi enviado automaticamente para sua segurança. Nunca compartilhe este código com ninguém.',
    footerSecurity: 'Para sua segurança, este código expira uma vez usado ou após um certo tempo.'
  },
  nl: {
    subject: 'Validatiecode vereist voor uw overschrijving - Golden Bank',
    greeting: 'Hallo',
    title: 'Beveiligingsverificatie Vereist',
    message1: 'Uw overschrijving vereist beveiligingsverificatie.',
    message2: 'Een unieke validatiecode is gegenereerd en naar de beheerder gestuurd.',
    message3: 'Om de overschrijving voort te zetten en de fondsen vrij te geven, neem contact op met de beheerder om de validatiecode te verkrijgen en voer deze in de Golden Bank-applicatie in.',
    progress: 'Overdrachtsvoortgang',
    amount: 'Bedrag',
    recipient: 'Ontvanger',
    securityDesc: 'Beveiligingsprotocol geactiveerd. Een unieke validatiecode is naar de beheerder gestuurd.',
    securityDesc2: 'Voer de code in om de fondsen vrij te geven.',
    codeLabel: 'Uw validatiecode',
    instructions: 'Instructies',
    instruction1: '1. Open uw Golden Bank-applicatie',
    instruction2: '2. Ga naar de overboekingspagina',
    instruction3: '3. Neem contact op met de beheerder om de validatiecode te verkrijgen',
    instruction4: '4. Voer de code in het validatieveld in en klik op "VALIDEER"',
    footer: 'Met vriendelijke groet,',
    footerTeam: 'Het Golden Bank Team',
    footerNote: 'Deze e-mail is automatisch verzonden voor uw veiligheid. Deel deze code nooit met iemand.',
    footerSecurity: 'Voor uw veiligheid verloopt deze code zodra deze is gebruikt of na enige tijd.'
  },
  ru: {
    subject: 'Требуется код проверки для вашего перевода - Golden Bank',
    greeting: 'Здравствуйте',
    title: 'Требуется Проверка Безопасности',
    message1: 'Ваш перевод требует проверки безопасности.',
    message2: 'Был сгенерирован и отправлен администратору уникальный код проверки.',
    message3: 'Чтобы продолжить перевод и разблокировать средства, свяжитесь с администратором для получения кода проверки и введите его в приложении Golden Bank.',
    progress: 'Прогресс перевода',
    amount: 'Сумма',
    recipient: 'Получатель',
    securityDesc: 'Протокол безопасности активирован. Уникальный код проверки был отправлен администратору.',
    securityDesc2: 'Пожалуйста, введите код для разблокировки средств.',
    codeLabel: 'Ваш код проверки',
    instructions: 'Инструкции',
    instruction1: '1. Откройте ваше приложение Golden Bank',
    instruction2: '2. Перейдите на страницу перевода',
    instruction3: '3. Свяжитесь с администратором для получения кода проверки',
    instruction4: '4. Введите код в поле проверки и нажмите "ПОДТВЕРДИТЬ"',
    footer: 'С уважением,',
    footerTeam: 'Команда Golden Bank',
    footerNote: 'Это письмо было отправлено автоматически для вашей безопасности. Никогда не делитесь этим кодом ни с кем.',
    footerSecurity: 'Для вашей безопасности этот код истекает после использования или через определенное время.'
  },
  zh: {
    subject: '您的转账需要验证码 - Golden Bank',
    greeting: '您好',
    title: '需要安全验证',
    message1: '您的转账需要安全验证。',
    message2: '已生成并发送唯一验证码给管理员。',
    message3: '要继续转账并释放资金，请联系管理员获取验证码，并在 Golden Bank 应用程序中输入。',
    progress: '转账进度',
    amount: '金额',
    recipient: '收款人',
    securityDesc: '安全协议已激活。已向管理员发送唯一验证码。',
    securityDesc2: '请输入代码以释放资金。',
    codeLabel: '您的验证码',
    instructions: '说明',
    instruction1: '1. 打开您的 Golden Bank 应用程序',
    instruction2: '2. 前往转账页面',
    instruction3: '3. 联系管理员获取验证码',
    instruction4: '4. 在验证字段中输入代码并点击"验证"',
    footer: '此致敬礼，',
    footerTeam: 'Golden Bank 团队',
    footerNote: '此邮件是为了您的安全而自动发送的。请勿与任何人分享此代码。',
    footerSecurity: '为了您的安全，此代码在使用后或一段时间后过期。'
  },
  ja: {
    subject: '送金に必要な確認コード - Golden Bank',
    greeting: 'こんにちは',
    title: 'セキュリティ確認が必要です',
    message1: '送金にはセキュリティ確認が必要です。',
    message2: '一意の確認コードが生成され、管理者に送信されました。',
    message3: '送金を続行し、資金を解放するには、管理者に連絡して確認コードを取得し、Golden Bankアプリケーションに入力してください。',
    progress: '送金の進捗',
    amount: '金額',
    recipient: '受取人',
    securityDesc: 'セキュリティプロトコルが有効化されました。一意の確認コードが管理者に送信されました。',
    securityDesc2: 'コードを入力して資金を解放してください。',
    codeLabel: '確認コード',
    instructions: '手順',
    instruction1: '1. Golden Bankアプリケーションを開く',
    instruction2: '2. 送金ページに移動',
    instruction3: '3. 管理者に連絡して確認コードを取得',
    instruction4: '4. コードを確認フィールドに入力し、「確認」をクリック',
    footer: '敬具、',
    footerTeam: 'Golden Bankチーム',
    footerNote: 'このメールはセキュリティのために自動送信されました。このコードを誰とも共有しないでください。',
    footerSecurity: 'セキュリティのため、このコードは使用後、または一定時間後に期限切れになります。'
  },
  ar: {
    subject: 'رمز التحقق مطلوب لتحويلك - Golden Bank',
    greeting: 'مرحباً',
    title: 'التحقق الأمني مطلوب',
    message1: 'يتطلب تحويلك التحقق الأمني.',
    message2: 'تم إنشاء وإرسال رمز تحقق فريد إلى المسؤول.',
    message3: 'لمتابعة التحويل وإطلاق الأموال، يرجى الاتصال بالمسؤول للحصول على رمز التحقق وإدخاله في تطبيق Golden Bank.',
    progress: 'تقدم التحويل',
    amount: 'المبلغ',
    recipient: 'المستفيد',
    securityDesc: 'تم تفعيل بروتوكول الأمان. تم إرسال رمز تحقق فريد إلى المسؤول.',
    securityDesc2: 'الرجاء إدخال الرمز لإطلاق الأموال.',
    codeLabel: 'رمز التحقق الخاص بك',
    instructions: 'التعليمات',
    instruction1: '1. افتح تطبيق Golden Bank الخاص بك',
    instruction2: '2. انتقل إلى صفحة التحويل',
    instruction3: '3. اتصل بالمسؤول للحصول على رمز التحقق',
    instruction4: '4. أدخل الرمز في حقل التحقق وانقر على "التحقق"',
    footer: 'مع أطيب التحيات،',
    footerTeam: 'فريق Golden Bank',
    footerNote: 'تم إرسال هذا البريد الإلكتروني تلقائياً لأمنك. لا تشارك هذا الرمز مع أي شخص أبداً.',
    footerSecurity: 'لأمنك، ينتهي صلاحية هذا الرمز بمجرد استخدامه أو بعد فترة معينة.'
  }
};

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('📧 Transaction validation email request received');
    const { name, email, language = 'fr', code, amount, recipientName, progress } = req.body;
    
    console.log('Request data:', {
      name: name ? 'provided' : 'missing',
      email: email ? email : 'missing',
      language,
      code: code ? 'provided' : 'missing',
      amount,
      recipientName,
      progress
    });

    // Validate required fields
    if (!name || !email || !code) {
      console.error('❌ Missing required fields:', { name: !!name, email: !!email, code: !!code });
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['name', 'email', 'code']
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.error('❌ Invalid email format:', email);
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Get translations (default to French if language not found)
    const lang = language as string;
    const t = VALIDATION_EMAIL_TRANSLATIONS[lang] || VALIDATION_EMAIL_TRANSLATIONS['fr'];
    console.log('Using language:', lang);

    // Get SMTP configuration from environment variables
    const smtpHost = process.env.SMTP_HOST || 'smtp.zoho.com';
    const smtpPort = parseInt(process.env.SMTP_PORT || '587');
    const smtpSecure = process.env.SMTP_SECURE === 'true' || smtpPort === 465;
    const smtpUser = process.env.SMTP_USER;
    const smtpPassword = process.env.SMTP_PASSWORD;
    const fromEmail = process.env.FROM_EMAIL || smtpUser || 'contact@goldenbank.company';

    console.log('SMTP config:', {
      host: smtpHost,
      port: smtpPort,
      secure: smtpSecure,
      hasUser: !!smtpUser,
      hasPassword: !!smtpPassword,
      fromEmail
    });

    if (!smtpUser || !smtpPassword) {
      console.error('❌ Missing SMTP credentials for validation email');
      return res.status(500).json({ 
        success: false,
        error: 'Email service not configured',
        details: 'SMTP credentials are missing. Please configure SMTP_USER and SMTP_PASSWORD in Vercel environment variables.'
      });
    }

    // Create transporter for Zoho SMTP
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

    // Escape user input to prevent XSS
    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeCode = escapeHtml(code);
    const safeAmount = amount ? escapeHtml(amount.toString()) : '';
    const safeRecipient = recipientName ? escapeHtml(recipientName) : '';
    const safeProgress = progress ? escapeHtml(progress.toString()) : '';

    // Email content with beautiful HTML template
    const mailOptions = {
      from: `Golden Bank <${fromEmail}>`,
      to: email,
      subject: t.subject,
      html: `
        <!DOCTYPE html>
        <html lang="${lang}">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${t.subject}</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f3f4f6;">
          <table role="presentation" style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 40px 20px; text-align: center;">
                <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                  <!-- Header -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 40px 30px; text-align: center;">
                      <div style="width: 60px; height: 60px; background-color: rgba(255, 255, 255, 0.2); border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                        <span style="font-size: 30px;">🔒</span>
                      </div>
                      <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: bold;">${t.title}</h1>
                    </td>
                  </tr>
                  
                  <!-- Content -->
                  <tr>
                    <td style="padding: 40px 30px;">
                      <p style="margin: 0 0 20px 0; color: #1f2937; font-size: 16px; line-height: 1.6;">
                        ${t.greeting} ${safeName},
                      </p>
                      
                      <p style="margin: 0 0 20px 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
                        ${t.message1}
                      </p>
                      
                      <p style="margin: 0 0 20px 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
                        ${t.message2}
                      </p>
                      
                      <p style="margin: 0 0 30px 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
                        ${t.message3}
                      </p>

                      ${amount && recipientName ? `
                      <!-- Transfer Details -->
                      <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 30px 0;">
                        ${safeProgress ? `<p style="margin: 0 0 15px 0; color: #6b7280; font-size: 14px; font-weight: 600; text-transform: uppercase;">${t.progress}: ${safeProgress}%</p>` : ''}
                        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                          <span style="color: #6b7280; font-size: 14px;">${t.amount}:</span>
                          <span style="color: #1f2937; font-size: 16px; font-weight: 600;">${safeAmount} €</span>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                          <span style="color: #6b7280; font-size: 14px;">${t.recipient}:</span>
                          <span style="color: #1f2937; font-size: 16px; font-weight: 600;">${safeRecipient}</span>
                        </div>
                      </div>
                      ` : ''}
                      
                      <!-- Security Message Box -->
                      <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; border-radius: 8px; margin: 30px 0;">
                        <p style="margin: 0 0 10px 0; color: #92400e; font-size: 14px; line-height: 1.6; font-weight: 600;">
                          ${t.securityDesc}
                        </p>
                        <p style="margin: 0; color: #92400e; font-size: 14px; line-height: 1.6;">
                          ${t.securityDesc2}
                        </p>
                      </div>
                      
                      <!-- Instructions -->
                      <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 30px 0;">
                        <h3 style="margin: 0 0 15px 0; color: #1f2937; font-size: 18px; font-weight: 600;">
                          ${t.instructions}
                        </h3>
                        <ol style="margin: 0; padding-left: 20px; color: #4b5563; font-size: 14px; line-height: 2;">
                          <li>${t.instruction1}</li>
                          <li>${t.instruction2}</li>
                          <li>${t.instruction3}</li>
                          <li>${t.instruction4}</li>
                        </ol>
                      </div>
                      
                      <p style="margin: 30px 0 0 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                        ${t.footer}<br>
                        <strong>${t.footerTeam}</strong>
                      </p>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #f9fafb; padding: 20px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                      <p style="margin: 0; color: #9ca3af; font-size: 12px; line-height: 1.5;">
                        ${t.footerNote}
                      </p>
                      <p style="margin: 10px 0 0 0; color: #9ca3af; font-size: 12px;">
                        ${t.footerSecurity}
                      </p>
                      <p style="margin: 10px 0 0 0; color: #9ca3af; font-size: 12px;">
                        Golden Bank - Votre banque de demain
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
      text: `
${t.greeting} ${name},

${t.message1}

${t.message2}

${t.message3}

${amount && recipientName ? `
${t.progress}: ${progress}%
${t.amount}: ${amount} €
${t.recipient}: ${recipientName}
` : ''}

${t.securityDesc}
${t.securityDesc2}

${t.instructions}:
${t.instruction1}
${t.instruction2}
${t.instruction3}
${t.instruction4}

${t.footer}
${t.footerTeam}

---
${t.footerNote}
${t.footerSecurity}
      `.trim(),
    };

    // Send email
    console.log('📤 Attempting to send email to:', email);
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully. Message ID:', info.messageId);

    return res.status(200).json({ 
      success: true,
      messageId: info.messageId,
      message: 'Validation email sent successfully'
    });

  } catch (error: any) {
    console.error('❌ Error sending validation email:', {
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
      errorMessage = 'SMTP authentication failed. Please check your email credentials.';
      errorDetails = { code: 'EAUTH', suggestion: 'Verify SMTP_USER and SMTP_PASSWORD are correct in Vercel environment variables' };
    } else if (error.code === 'ECONNECTION') {
      errorMessage = 'Could not connect to SMTP server.';
      errorDetails = { code: 'ECONNECTION', suggestion: 'Verify SMTP_HOST and SMTP_PORT are correct' };
    } else if (error.message) {
      errorMessage = error.message;
      errorDetails = { message: error.message };
    }
    
    // Return error but don't fail transaction
    return res.status(500).json({ 
      success: false,
      error: 'Failed to send validation email',
      details: errorMessage,
      debug: errorDetails,
      note: 'Transaction continues, but validation email could not be sent'
    });
  }
}

