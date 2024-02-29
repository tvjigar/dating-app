import MailerService from './mailer.service.js';

import { createNodemailerTransporter } from './configs/nodemailer.js';

import VerifyAccountEmailTemplate from './templates/verify-account-email.template.js';
import ResetPasswordEmailTemplate from './templates/reset-password-email.template.js';

export {
    MailerService,

    createNodemailerTransporter,

    VerifyAccountEmailTemplate,
    ResetPasswordEmailTemplate,
};
