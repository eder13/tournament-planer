import { useEffect, useState, type FC } from 'react';
import UtilsHelper from '../../utils/UtilsHelper';
import TournamentDetailsHeader from './tournament-details-header/TournamentDetailsHeader';
import TournamentDetailsContent from './tournament-details-content/TournamentDetailsContent';
import TournamentDetailsFooter from './tournament-details-footer/TournamentDetailsFooter';
import { useGetPlayersForTournament } from '../../hooks/data-fetching/useGetPlayersForTournament/useGetPlayersForTournament';
import { Alert, CircularProgress } from '@mui/material';
import { usePatchStartTournament } from '../../hooks/data-fetching/usePatchStartTournament/usePatchStartTournament';

type Props = {
    id: string | undefined;
};

const INTERVAL_DATA_FETCHING_MS = 15000;

const TournamentDetails: FC<Props> = ({ id }) => {
    const [timer, setTimer] = useState(INTERVAL_DATA_FETCHING_MS);
    const [hasTournamentStarted, setHasTournamentStarted] = useState(false);

    const { data, isError, isPending } = useGetPlayersForTournament(
        id,
        INTERVAL_DATA_FETCHING_MS,
        hasTournamentStarted
    );

    const {
        mutateAsync,
        isError: isErrorStartingTournament,
        isSuccess: isSuccessStartingTournament,
        isPending: isPendingStartingTournament,
    } = usePatchStartTournament(id);

    useEffect(() => {
        if (data?.tournament.started) {
            setHasTournamentStarted(true);
        }
    }, [data?.tournament.started, setHasTournamentStarted]);

    useEffect(() => {
        let interval: number | undefined = undefined;

        if (data?.tournament?.started) {
            if (interval) {
                return () => clearInterval(interval);
            }
        } else {
            interval = setInterval(() => {
                const currentTime = timer - 1000;
                if (currentTime <= 0) {
                    setTimer(INTERVAL_DATA_FETCHING_MS);
                } else {
                    setTimer(currentTime);
                }
            }, 1000);
        }

        return () => clearInterval(interval);
    }, [timer, setTimer, data?.tournament?.started]);

    async function onClickStartTournament(
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) {
        if (!e.currentTarget.disabled && data?.tournament && id) {
            await mutateAsync(undefined, {
                onSuccess: () => {
                    setHasTournamentStarted(true);
                },
            });
        }
    }

    const joinLink = `${UtilsHelper.getRootDomainHref()}/join/tournaments/${id}`;
    const QRCodeApiLink = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${joinLink}`;

    if (isPending) {
        return <CircularProgress />;
    }

    if (!data || isError) {
        return (
            <Alert severity="error">
                Could not load tournament Data with id: {id}
            </Alert>
        );
    }

    return (
        <div>
            <TournamentDetailsHeader
                name={data.tournament.name}
                created_on={data.tournament.created_on}
                started={!!data.tournament.started}
            />

            <TournamentDetailsContent
                started={!!data.tournament.started}
                timer={timer}
                players={data.players}
                onClickStartTournament={onClickStartTournament}
                tournamentId={data.tournament.id}
                isErrorStartingTournament={isErrorStartingTournament}
                isSuccessStartingTournament={isSuccessStartingTournament}
                isPendingStartingTournament={isPendingStartingTournament}
            />

            <TournamentDetailsFooter
                started={!!data.tournament.started}
                joinLink={joinLink}
                QRCodeImageSrc={QRCodeApiLink}
            />
        </div>
    );
};

export default TournamentDetails;
