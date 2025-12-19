import { format } from 'date-fns';

class UtilsHelper {
    static readonly classNamesHelper = (classNames: any) => {
        return classNames.filter((val: unknown) => !!val).join(' ');
    };

    static readonly parseDate = (date: Date | string | undefined) => {
        if (!date) {
            return '';
        }
        return format(date, 'dd.MM.yyyy HH:mm');
    };

    static readonly getRootDomainHref = () => {
        return `${location.protocol}//${location.host}`;
    };
}

export default UtilsHelper;
