import { type FC, type PropsWithChildren } from 'react';
import UtilsHelper from '../../utils/UtilsHelper';

interface Props extends PropsWithChildren {
    className?: string;
}

const Page: FC<Props> = ({ children, className }) => {
    return (
        <div
            className={UtilsHelper.classNamesHelper([
                'd-md-flex',
                'flex-column',
                'justify-content-md-center',
                'align-items-md-center',
                'container-md',
                'pt-5',
                'mb-5',
                'pb-5',
                className,
            ])}
        >
            {children}
        </div>
    );
};

export default Page;
