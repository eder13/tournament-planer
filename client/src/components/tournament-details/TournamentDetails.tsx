import { useEffect, useState, type FC } from 'react';
import type { DataTournamentResultDetails, Player } from '../../types/common';
import UtilsHelper from '../../utils/UtilsHelper';
import TournamentDetailsHeader from './tournament-details-header/TournamentDetailsHeader';
import TournamentDetailsContent from './tournament-details-content/TournamentDetailsContent';
import TournamentDetailsFooter from './tournament-details-footer/TournamentDetailsFooter';

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

    function onClickStartTournament(
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) {
        if (!e.currentTarget.disabled && tournament) {
            const transformedTournament = { ...tournament, started: '1' };

            fetch(`/tournament/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ started: true }),
            })
                .then((res) => {
                    if (res.ok) {
                        return res.json();
                    } else {
                        throw new Error('Failed to Start Tournament');
                    }
                })
                .then((data) => {
                    console.log('#####** altered data', data);
                    setTournament(transformedTournament);
                })
                .catch(() => {
                    // TODO: Failed to Start Tournament Error Message
                });
        }
    }

    // TODO: Create QR Code out of this
    const joinLink = `${UtilsHelper.getRootDomainHref()}/join/tournaments/${id}`;

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
            />

            <TournamentDetailsFooter
                started={!!tournament?.started}
                joinLink={joinLink}
            />
        </div>
    );
};

export default TournamentDetails;
