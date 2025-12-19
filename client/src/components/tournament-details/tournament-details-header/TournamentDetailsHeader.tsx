import type { FC } from 'react';
import UtilsHelper from '../../../utils/UtilsHelper';

type Props = {
    name: string;
    started: boolean;
    created_on: string | Date | undefined;
};

const TournamentDetailsHeader: FC<Props> = ({ name, created_on, started }) => {
    return (
        <div
            style={{ minWidth: '80vw' }}
            className="mb-5 d-flex align-items-center justify-content-between"
        >
            <h1>{name}</h1>
            <div>
                <div>{UtilsHelper.parseDate(created_on)}</div>
                <div>
                    Status: <strong>{started ? 'ongoing' : 'pending'}</strong>
                </div>
            </div>
        </div>
    );
};

export default TournamentDetailsHeader;
