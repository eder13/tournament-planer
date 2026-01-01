import type { FC } from 'react';
import type { DataTournamentRoundAndMatchesResult } from '../../types/common';
import './KnockoutTournamentPlan.css';
import { SeparatorPlayerUUIDDatabaes } from '../../../../server/src/constants/common';
import UtilsHelper from '../../utils/UtilsHelper';
import { Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router';

type Props = {
    data: DataTournamentRoundAndMatchesResult | undefined;
};

const KnockoutTournamentPlan: FC<Props> = ({ data }) => {
    const navigate = useNavigate();
    let winner: string | undefined = undefined;

    if (!data) {
        return null;
    }

    if (
        data.tournamentWithRounds.rounds[
            data.tournamentWithRounds.rounds.length - 1
        ].matches.length === 1
    ) {
        winner = data.tournamentWithRounds.rounds[
            data.tournamentWithRounds.rounds.length - 1
        ].matches[0].winner?.name.split(SeparatorPlayerUUIDDatabaes)[0];
    }

    return (
        <div
            className={UtilsHelper.classNamesHelper([
                winner && 'd-flex',
                'overflow-auto',
            ])}
        >
            <Typography>
                <div className="tournament">
                    {data.tournamentWithRounds.rounds.map((round) => {
                        return (
                            <ul
                                className={`round round-${round.round_number}`}
                                key={round.id}
                            >
                                {round.matches.map((match) => {
                                    const player1 = match.player1.name.split(
                                        SeparatorPlayerUUIDDatabaes
                                    )[0];
                                    const player2 = match.player2?.name
                                        ? match.player2.name.split(
                                              SeparatorPlayerUUIDDatabaes
                                          )[0]
                                        : 'BYE';

                                    const buttonMatchLink = `/match/${data.tournamentWithRounds.id}/${round.id}/${match.id}/${player1}/${player2}`;

                                    return (
                                        <div key={match.id}>
                                            <li className="spacer"></li>
                                            <li
                                                className={UtilsHelper.classNamesHelper(
                                                    [
                                                        'game',
                                                        'game-top',
                                                        match.winner?.id ===
                                                            match.player1.id &&
                                                            'winner',
                                                    ]
                                                )}
                                            >
                                                {player1}{' '}
                                                <span>
                                                    {match.result?.player1}
                                                </span>
                                            </li>
                                            <li
                                                style={
                                                    round.round_number !== 1
                                                        ? {
                                                              height: `${
                                                                  (round.round_number -
                                                                      1) *
                                                                  120
                                                              }px`,
                                                              display: 'grid',
                                                          }
                                                        : {}
                                                }
                                                className="game game-spacer"
                                            >
                                                {!match.winner && (
                                                    <Button
                                                        onClick={() => {
                                                            navigate(
                                                                buttonMatchLink
                                                            );
                                                        }}
                                                    >
                                                        Enter Result
                                                    </Button>
                                                )}
                                            </li>
                                            <li
                                                className={UtilsHelper.classNamesHelper(
                                                    [
                                                        'game',
                                                        'game-bottom',
                                                        match.winner?.id ===
                                                            match?.player2
                                                                ?.id &&
                                                            'winner',
                                                    ]
                                                )}
                                            >
                                                {player2}{' '}
                                                <span>
                                                    {match.result?.player2}
                                                </span>
                                            </li>
                                        </div>
                                    );
                                })}
                            </ul>
                        );
                    })}
                </div>
            </Typography>
            {winner && (
                <div className="ps-3 d-flex w-100 flex-column justify-content-center align-items-center">
                    <h2>Winner 🎉🏅</h2>
                    <h3>{winner}</h3>
                </div>
            )}
        </div>
    );
};

export default KnockoutTournamentPlan;
