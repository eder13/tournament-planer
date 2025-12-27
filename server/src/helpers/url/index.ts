export class ServerURLUtils {
    static getHostName() {
        let portOrNot = '';

        if (process.env.PROTOCOL === 'https') {
            portOrNot = '';
        }

        if (process.env.PROTOCOL === 'http' && !!process.env.PORT) {
            portOrNot = `:${process.env.PORT}`;
        }

        return `${process.env.PROTOCOL}://${process.env.HOST}${portOrNot}`;
    }
}
