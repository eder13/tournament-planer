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

    async function onClickStartTournament(
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) {
        if (!e.currentTarget.disabled && tournament) {
            try {
                const res = await fetch(`/tournament/${id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ started: true }),
                });
                if (res.ok) {
                    const data = await res.json();
                    console.log('#####** altered data', data);

                    // start the tournament finally
                    fetch(`/tournament/start/${id}`, {
                        method: 'POST',
                    })
                        .then((res) => {
                            if (res.ok) {
                                const transformedTournament = {
                                    ...tournament,
                                    started: '1',
                                };
                                setTournament(transformedTournament);
                                console.log(
                                    '#####** tournament has been started and can now be fetched the rounds etc.'
                                );
                            }
                        })
                        .catch(() => {
                            // TODO Catch Error
                        });
                } else {
                    throw new Error('Failed to Start Tournament');
                }
            } catch (e) {
                // TODO: Error when fetching and setting
            }
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
                tournamentId={tournament?.id ?? ''}
            />

            <TournamentDetailsFooter
                started={!!tournament?.started}
                joinLink={joinLink}
            />
        </div>
    );
};

export default TournamentDetails;
