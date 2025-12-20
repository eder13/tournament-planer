export class ServerURLUtils {
    static getHostName() {
        return `${process.env.PROTOCOL}://${process.env.HOST}${
            process.env.PORT ? ':' + process.env.PORT : ''
        }`;
    }
}
