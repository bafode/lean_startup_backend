import sgMail from '@sendgrid/mail';
import { config, logger } from '../config/';

const sendEmail = async (to: string, from: string, subject: string, text: string, html: string) => {
  // using Twilio SendGrid's v3 Node.js Library
  // https://github.com/sendgrid/sendgrid-nodejs

  sgMail.setApiKey(config.email.sendgridAPIKey);
  const msg = {
    to,
    from,
    subject,
    text,
    html,
  };
  sgMail.send(msg)
    .then(() => {
      logger.info(`📧 Email Sent to ${to}`);
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .catch((error: any) => {
      logger.warn(error);
    });
};


const sendResetPasswordEmail = async (to: string, newPassword: string) => {
  const subject = '🔐 Reset password';
  const text = `Dear user,
  Here your new password: ${newPassword}
  If you did not request any password resets, then please let us now.`;
  const html = `<p>Dear user,
  Here your new password: <b>${newPassword}</b>
  If you did not request any password resets, then please let us now.<p>`;
  await sendEmail(to, 'nodeApp', subject, text, html);
};


const sendVerificationEmail = async (to: string, token: number) => {
  const subject = 'Vérification de votre adresse e-mail';

  const text = `Bonjour,
  Votre code de vérification est ${token}.`;
  console.log(token);
  const html = `
       <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f8f8f8;">
        <div style="background-color: #5e17eb; padding: 20px; border-top-left-radius: 10px; border-top-right-radius: 10px; text-align: center;">
          <h2 style="color: #ffffff; margin: 0;">Confirmez votre adresse e-mail</h2>
        </div>
        <div style="padding: 20px;">
          <p style="font-size: 16px; color: #333;">Bonjour,</p>
          <p style="font-size: 16px; color: #333; line-height: 1.6;">
            Merci d'avoir créé un compte avec nous. Pour sécuriser votre compte, veuillez utiliser le code de vérification ci-dessous :
          </p>
          <div style="text-align: center; margin: 20px 0;">
            <span style="display: inline-block; font-size: 24px; color: #5e17eb; font-weight: bold; padding: 15px 25px; border: 2px solid #5e17eb; border-radius: 5px; background-color: #e5f7ef;">${token}</span>
          </div>
          <p style="font-size: 16px; color: #333; line-height: 1.6;">
            Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet e-mail en toute sécurité.
          </p>
          <p style="font-size: 16px; color: #333; line-height: 1.6;">
            Nous restons à votre disposition pour toute question ou assistance supplémentaire.
          </p>
          <p style="font-size: 16px; color: #333; margin-top: 30px;">Cordialement,<br>L'équipe Beehive</p>
        </div>
        <div style="background-color: #ffaf35; padding: 10px; border-bottom-left-radius: 10px; border-bottom-right-radius: 10px; text-align: center;">
          <p style="font-size: 14px; color: #ffffff; margin: 0;">Merci de faire partie de notre communauté. Nous sommes ravis de vous accueillir !</p>
        </div>
      </div> 
  `;

  await sendEmail(to, 'beehiveappcontact@gmail.com', subject, text, html);
};





export default {
  sendEmail,
  sendResetPasswordEmail,
  sendVerificationEmail,
};
