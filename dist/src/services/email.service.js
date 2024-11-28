"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mail_1 = __importDefault(require("@sendgrid/mail"));
const config_1 = require("../config/");
const sendEmail = (to, from, subject, text, html) => __awaiter(void 0, void 0, void 0, function* () {
    // using Twilio SendGrid's v3 Node.js Library
    // https://github.com/sendgrid/sendgrid-nodejs
    mail_1.default.setApiKey(config_1.config.email.sendgridAPIKey);
    const msg = {
        to,
        from,
        subject,
        text,
        html,
    };
    mail_1.default.send(msg)
        .then(() => {
        config_1.logger.info(`📧 Email Sent to ${to}`);
    })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .catch((error) => {
        config_1.logger.warn(error);
    });
});
const sendResetPasswordEmail = (to, token) => __awaiter(void 0, void 0, void 0, function* () {
    const subject = '🔐 Réinitialisation de votre mot de passe';
    const text = `Bonjour,
  Vous avez demandé à réinitialiser votre mot de passe. Voici votre code de vérification : ${token}.
  Si vous n'êtes pas à l'origine de cette demande, veuillez ignorer cet e-mail.`;
    const html = `
       <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f8f8f8;">
        <div style="background-color: #5e17eb; padding: 20px; border-top-left-radius: 10px; border-top-right-radius: 10px; text-align: center;">
          <h2 style="color: #ffffff; margin: 0;">Réinitialisation de votre mot de passe</h2>
        </div>
        <div style="padding: 20px;">
          <p style="font-size: 16px; color: #333;">Bonjour,</p>
          <p style="font-size: 16px; color: #333; line-height: 1.6;">
            Vous avez demandé à réinitialiser votre mot de passe. Pour continuer, veuillez utiliser le code de vérification ci-dessous :
          </p>
          <div style="text-align: center; margin: 20px 0;">
            <span style="display: inline-block; font-size: 24px; color: #5e17eb; font-weight: bold; padding: 15px 25px; border: 2px solid #5e17eb; border-radius: 5px; background-color: #e5f7ef;">${token}</span>
          </div>
          <p style="font-size: 16px; color: #333; line-height: 1.6;">
            Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet e-mail. Aucun changement ne sera apporté à votre compte.
          </p>
          <p style="font-size: 16px; color: #333; margin-top: 30px;">
            Si vous avez besoin d'assistance supplémentaire, n'hésitez pas à nous contacter.
          </p>
          <p style="font-size: 16px; color: #333; margin-top: 30px;">Cordialement,<br>L'équipe Beehive</p>
        </div>
        <div style="background-color: #ffaf35; padding: 10px; border-bottom-left-radius: 10px; border-bottom-right-radius: 10px; text-align: center;">
          <p style="font-size: 14px; color: #ffffff; margin: 0;">Nous sommes là pour vous aider à protéger votre compte.</p>
        </div>
      </div> 
  `;
    yield sendEmail(to, 'beehiveappcontact@gmail.com', subject, text, html);
});
const sendVerificationEmail = (to, token) => __awaiter(void 0, void 0, void 0, function* () {
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
    yield sendEmail(to, 'beehiveappcontact@gmail.com', subject, text, html);
});
exports.default = {
    sendEmail,
    sendResetPasswordEmail,
    sendVerificationEmail,
};
//# sourceMappingURL=email.service.js.map