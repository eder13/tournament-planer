import type { FC } from 'react';
import UtilsHelper from '../../utils/UtilsHelper';
import { Typography } from '@mui/material';
import './TextImageComponent.css';

type Props = {
    switchOrder: boolean;
    headlineText: string;
    text: string;
    image: {
        url: string;
        width: number;
        height: number;
        alt: string;
    };
};

const TextImageComponent: FC<Props> = ({
    switchOrder,
    headlineText,
    text,
    image,
}) => {
    return (
        <div>
            <div className="align-items-center row gy-4 gy-md-0">
                <div
                    className={UtilsHelper.classNamesHelper([
                        switchOrder && 'order-md-3 order-0',
                        'col-md-6 col-sm-12 col-xs-12 text-image--text gx-lg-5',
                    ])}
                >
                    <Typography
                        variant="h5"
                        className="pb-3"
                    >
                        {headlineText}
                    </Typography>
                    <Typography variant="body1">{text}</Typography>
                </div>
                {
                    <div
                        className={UtilsHelper.classNamesHelper([
                            switchOrder && 'order-md-3 order-1',
                            'd-none d-lg-none d-md-block col-lg-0 col-md-1 col-xs-0 align-items-end d-flex justify-content-center align-items-center order-lg-0 gx-lg-5',
                        ])}
                    ></div>
                }
                <div
                    className={UtilsHelper.classNamesHelper([
                        switchOrder && 'order-md-2 order-0',
                        'col-lg-6 col-md-5 col-sm-12 col-xs-12 text-image--image-wrapper align-items-end d-flex justify-content-center align-items-center gy-5',
                    ])}
                >
                    <img
                        src={image.url}
                        width={image.width}
                        height={image.height}
                        alt={image.alt}
                        className="text-image--image"
                        decoding="auto"
                        loading={'lazy'}
                        fetchPriority={'auto'}
                    />
                </div>
            </div>
        </div>
    );
};

export default TextImageComponent;
