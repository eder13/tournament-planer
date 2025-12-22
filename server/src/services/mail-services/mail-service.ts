import nodemailer, { Transporter } from 'nodemailer';
import Logger from '../../helpers/logger';

class MailService {
    private readonly transporter: Transporter | null = null;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: Number(process.env.EMAIL_PORT),
            secure: process.env.EMAIL_PORT === '465', // true for 465, false for other ports
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });
    }

    sendMail = async (email: string, subject: string, textHTML: string) => {
        const info = await this?.transporter?.sendMail({
            from: '"Knockout Tournament Planner" <no-reply@tournament-planer.com>',
            to: email,
            subject,
            html: textHTML,
        });

        Logger.info('Message sent: ' + info.messageId);
    };
}

export default MailService;
