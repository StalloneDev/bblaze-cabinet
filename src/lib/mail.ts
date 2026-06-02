import nodemailer from "nodemailer";

export async function sendContactNotificationEmail(data: {
  name: string;
  email: string;
  phone?: string | null;
  subject: string;
  message: string;
}) {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM || user || "noreply@bblaze.fr";
  const to = process.env.NOTIFICATION_EMAIL_TO;

  if (!host || !user || !pass || !to) {
    console.warn(
      "⚠️ SMTP non configuré dans le fichier .env (SMTP_HOST, SMTP_USER, SMTP_PASS, NOTIFICATION_EMAIL_TO). L'email n'a pas été envoyé.",
      "\nDétails du message client :",
      data
    );
    return { success: false, error: "SMTP non configuré" };
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: {
        user,
        pass,
      },
    });

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body {
              font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
              background-color: #f7f9fc;
              color: #1e293b;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 40px auto;
              background-color: #ffffff;
              border-radius: 12px;
              box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06);
              border: 1px solid #e2e8f0;
              overflow: hidden;
            }
            .header {
              background-color: #0b192c;
              padding: 30px;
              text-align: center;
              border-bottom: 3px solid #d4af37;
            }
            .header h1 {
              color: #ffffff;
              margin: 0;
              font-size: 24px;
              letter-spacing: 1px;
            }
            .header p {
              color: #d4af37;
              margin: 5px 0 0 0;
              text-transform: uppercase;
              font-size: 11px;
              font-weight: bold;
              letter-spacing: 2px;
            }
            .content {
              padding: 40px 30px;
            }
            .intro {
              font-size: 16px;
              line-height: 1.6;
              margin-bottom: 30px;
            }
            .card {
              background-color: #f8fafc;
              border: 1px solid #f1f5f9;
              border-radius: 8px;
              padding: 20px;
              margin-bottom: 30px;
            }
            .field {
              margin-bottom: 15px;
            }
            .field:last-child {
              margin-bottom: 0;
            }
            .label {
              font-size: 12px;
              color: #64748b;
              text-transform: uppercase;
              font-weight: bold;
              margin-bottom: 4px;
            }
            .value {
              font-size: 15px;
              font-weight: 500;
              color: #0f172a;
            }
            .message-text {
              background-color: #ffffff;
              border: 1px solid #e2e8f0;
              border-radius: 6px;
              padding: 15px;
              font-size: 14px;
              line-height: 1.6;
              white-space: pre-wrap;
              color: #334155;
              margin-top: 10px;
            }
            .btn-container {
              text-align: center;
              margin-top: 30px;
            }
            .btn {
              background-color: #d4af37;
              color: #1e293b;
              font-weight: bold;
              text-decoration: none;
              padding: 12px 28px;
              border-radius: 6px;
              display: inline-block;
            }
            .footer {
              background-color: #f1f5f9;
              padding: 20px;
              text-align: center;
              font-size: 12px;
              color: #94a3b8;
              border-top: 1px solid #e2e8f0;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>BBLAZE</h1>
              <p>Cabinet Conseil & Expertise Juridique</p>
            </div>
            <div class="content">
              <p class="intro">Bonjour,</p>
              <p class="intro">Vous avez reçu une nouvelle demande de contact depuis le formulaire de votre site web BBLAZE.</p>
              
              <div class="card">
                <div class="field">
                  <div class="label">Nom complet</div>
                  <div class="value">${data.name}</div>
                </div>
                <div class="field">
                  <div class="label">Adresse Email</div>
                  <div class="value"><a href="mailto:${data.email}" style="color: #d4af37; text-decoration: none;">${data.email}</a></div>
                </div>
                ${data.phone ? `
                <div class="field">
                  <div class="label">Téléphone</div>
                  <div class="value"><a href="tel:${data.phone}" style="color: #d4af37; text-decoration: none;">${data.phone}</a></div>
                </div>
                ` : ""}
                <div class="field">
                  <div class="label">Sujet</div>
                  <div class="value">${data.subject}</div>
                </div>
                <div class="field">
                  <div class="label">Message</div>
                  <div class="message-text">${data.message}</div>
                </div>
              </div>
              
              <div class="btn-container">
                <a href="http://localhost:3000/admin/dashboard" class="btn" style="color: #1e293b;">Accéder à l'Administration</a>
              </div>
            </div>
            <div class="footer">
              Cet email a été généré automatiquement par le site BBLAZE.<br>
              &copy; ${new Date().getFullYear()} BBLAZE. Tous droits réservés.
            </div>
          </div>
        </body>
      </html>
    `;

    const info = await transporter.sendMail({
      from: `"BBLAZE Contact" <${from}>`,
      to,
      subject: `Nouveau Message Client - ${data.subject}`,
      text: `Nouveau message de ${data.name} (${data.email}):\nSujet: ${data.subject}\nMessage: ${data.message}`,
      html: htmlContent,
    });

    console.log("📨 Message de notification email envoyé : %s", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("❌ Erreur d'envoi SMTP :", error);
    return { success: false, error };
  }
}
