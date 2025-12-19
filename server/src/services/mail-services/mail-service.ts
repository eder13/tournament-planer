import nodemailer, { Transporter } from 'nodemailer';
import Logger from '../../helpers/logger';

class MailService {
    private readonly transporter: Transporter | null = null;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: 'mailrelay.tugraz.at',
            port: 465,
            secure: true, // true for 465, false for other ports
            // TODO: Hardcoded for now, exchange with ENV variables
            auth: {
                user: 'eder13',
                pass: 'gaFo$R1+RR',
            },
        });
    }

    sentMail = async (email: string, subject: string, textHTML: string) => {
        const info = await this?.transporter?.sendMail({
            from: '"Food Planner" <simon.ranflt@student.tugraz.at>',
            to: email,
            subject,
            html: textHTML,
        });

        Logger.info('Message sent: ' + info.messageId);
    };
}

export default MailService;
