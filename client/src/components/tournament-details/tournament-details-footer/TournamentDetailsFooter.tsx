import {
    Accordion,
    AccordionSummary,
    Typography,
    AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import type { FC } from 'react';

type Props = {
    started: boolean;
    joinLink: string;
    QRCodeImageSrc: string;
};

const TournamentDetailsFooter: FC<Props> = ({
    started,
    joinLink,
    QRCodeImageSrc,
}) => {
    return (
        <>
            {!started && (
                <Accordion
                    className="mb-5"
                    defaultExpanded
                >
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1-content"
                        id="panel1-header"
                    >
                        <Typography component="span">
                            Join Tournament
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <div className="mb-5">
                            <h2>QR Code</h2>
                            <img
                                src={QRCodeImageSrc}
                                width={200}
                                height={200}
                                alt="QR Code"
                            />
                        </div>

                        <div className="mb-5 pb-5">
                            <h3>Manual Join Link</h3>
                            <a
                                style={{
                                    pointerEvents: 'none',
                                    wordWrap: 'break-word',
                                }}
                                href={joinLink}
                            >
                                {joinLink}
                            </a>
                        </div>
                    </AccordionDetails>
                </Accordion>
            )}
        </>
    );
};

export default TournamentDetailsFooter;
