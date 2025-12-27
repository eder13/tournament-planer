import { useContext, useEffect, useState, type FC } from 'react';
import type { DataTournamentResultDetails, Player } from '../../types/common';
import UtilsHelper from '../../utils/UtilsHelper';
import TournamentDetailsHeader from './tournament-details-header/TournamentDetailsHeader';
import TournamentDetailsContent from './tournament-details-content/TournamentDetailsContent';
import TournamentDetailsFooter from './tournament-details-footer/TournamentDetailsFooter';
import { GlobalContext } from '../../context/global-context/GlobalProvider';

type Props = {
    id: string | undefined;
};

const INTERVAL_DATA_FETCHING_MS = 15000;

function getPlayers(id: string) {
    if (id) {
        return fetch(`/tournaments/${id}`)
            .then((res) => {
                if (res.ok) {
                    return res.json();
                } else {
                    throw new Error('Could not fetch Data');
                }
            })
            .then((res) => {
                return {
                    tournament: res,
                    players: res.players,
                } as {
                    tournament: DataTournamentResultDetails;
                    players: Player[];
                };
            });
    }

    return Promise.resolve(undefined);
}

const TournamentDetails: FC<Props> = ({ id }) => {
    const [tournament, setTournament] = useState<DataTournamentResultDetails>();
    const [players, setPlayers] = useState<Array<Player>>([]);
    const [timer, setTimer] = useState(INTERVAL_DATA_FETCHING_MS);
    const { csrfToken } = useContext(GlobalContext);

    useEffect(() => {
        if (id) {
            getPlayers(id).then((res) => {
                setPlayers(res?.players ?? []);
                setTournament(res?.tournament);
            });
        }
    }, []);

    useEffect(() => {
        let interval: number | undefined = undefined;

        if (tournament?.started) {
            if (interval) {
                return () => clearInterval(interval);
            }
        } else {
            interval = setInterval(() => {
                const currentTime = timer - 1000;
                if (currentTime <= 0) {
                    setTimer(INTERVAL_DATA_FETCHING_MS);
                    if (id) {
                        getPlayers(id).then((res) => {
                            setPlayers(res?.players ?? []);
                            setTournament(res?.tournament);
                        });
                    }
                } else {
                    setTimer(currentTime);
                }
            }, 1000);
        }

        return () => clearInterval(interval);
    }, [timer, setTimer, setPlayers, setTournament, tournament?.started]);

    async function onClickStartTournament(
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) {
        if (!e.currentTarget.disabled && tournament) {
            try {
                const res = await fetch(`/tournament/${id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-Token': csrfToken,
                    },
                    body: JSON.stringify({ started: true }),
                });
                if (res.ok) {
                    // start the tournament finally
                    fetch(`/tournament/start/${id}`, {
                        method: 'POST',
                        headers: {
                            'X-CSRF-Token': csrfToken,
                        },
                    })
                        .then((res) => {
                            if (res.ok) {
                                const transformedTournament = {
                                    ...tournament,
                                    started: '1',
                                };
                                setTournament(transformedTournament);
                            }
                        })
                        .catch((e) => {
                            console.error(e);
                        });
                } else {
                    throw new Error('Failed to Start Tournament');
                }
            } catch (e) {
                console.error(e);
            }
        }
    }

    const joinLink = `${UtilsHelper.getRootDomainHref()}/join/tournaments/${id}`;
    const QRCodeApiLink = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${joinLink}`;

    return (
        <div>
            <TournamentDetailsHeader
                name={tournament?.name ?? ''}
                created_on={tournament?.created_on}
                started={!!tournament?.started}
            />

            <TournamentDetailsContent
                started={!!tournament?.started}
                timer={timer}
                players={players}
                setPlayers={setPlayers}
                onClickStartTournament={onClickStartTournament}
                tournamentId={tournament?.id ?? ''}
            />

            <TournamentDetailsFooter
                started={!!tournament?.started}
                joinLink={joinLink}
                QRCodeImageSrc={QRCodeApiLink}
            />
        </div>
    );
};

export default TournamentDetails;
