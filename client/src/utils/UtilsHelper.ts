import { format } from 'date-fns';

class UtilsHelper {
    static readonly classNamesHelper = (classNames: any) => {
        return classNames.filter((val: unknown) => !!val).join(' ');
    };

    static readonly parseDate = (date: Date | string | undefined) => {
        if (!date) {
            return '';
        }
        try {
            return format(date, 'dd.MM.yyyy HH:mm');
        } catch (e) {
            console.error('// TODO: This is a bug. fix it.', e);
            return '';
        }
    };

    static readonly getRootDomainHref = () => {
        return `${location.protocol}//${location.host}`;
    };

    static getCookie(name: string) {
        return document.cookie
            .split('; ')
            .find((row) => row.startsWith(name + '='))
            ?.split('=')[1];
    }
}

export default UtilsHelper;
