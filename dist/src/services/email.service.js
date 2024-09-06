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
const sendResetPasswordEmail = (to, newPassword) => __awaiter(void 0, void 0, void 0, function* () {
    const subject = '🔐 Reset password';
    const text = `Dear user,
  Here your new password: ${newPassword}
  If you did not request any password resets, then please let us now.`;
    const html = `<p>Dear user,
  Here your new password: <b>${newPassword}</b>
  If you did not request any password resets, then please let us now.<p>`;
    yield sendEmail(to, 'nodeApp', subject, text, html);
});
const sendVerificationEmail = (to, token) => __awaiter(void 0, void 0, void 0, function* () {
    const subject = 'Email Verification';
    // TODO: -- replace this url with the link to the email verification service back-end app
    const text = `Dear user,
  Your verification code is ${token}.`;
    const html = `<p>Dear user,
  Your verification code is ${token}  <br>
  If you did not create an account, then ignore this email.`;
    yield sendEmail(to, 'beehiveappcontact@gmail.com', subject, text, html);
});
exports.default = {
    sendEmail,
    sendResetPasswordEmail,
    sendVerificationEmail,
};
//# sourceMappingURL=email.service.js.map