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

    if (!data) {
        return null;
    }

    return (
        <Typography>
            <div className="tournament">
                {data.tournamentWithRounds.rounds.map((round) => {
                    return (
                        <ul
                            className={`round round-${round.round_number}`}
                            key={round.id}
                        >
                            {round.matches.map((match) => {
                                console.log('####** match', match);
                                console.log('match.player1', match.player1);
                                console.log('match.player2', match.player2);

                                const player1 = match.player1.name.split(
                                    SeparatorPlayerUUIDDatabaes
                                )[0];
                                const player2 = match.player2?.name
                                    ? match.player2.name.split(
                                          SeparatorPlayerUUIDDatabaes
                                      )[0]
                                    : 'BYE';

                                const buttonMatchLink = `/match/${data.tournamentWithRounds.id}/${round.id}/${match.id}/${player1}/${player2}`;

                                console.log('####** match', match);
                                console.log(
                                    '####** match.result',
                                    match.result
                                );

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
                                            <span>{match.result?.player1}</span>
                                        </li>
                                        <li
                                            style={{
                                                height: `${
                                                    round.round_number * 40
                                                }px`,
                                                display: 'grid',
                                            }}
                                            className="game game-spacer"
                                        >
                                            {/* TODO: Create a Route to post the result and set the winner */}
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
                                                        match?.player2?.id &&
                                                        'winner',
                                                ]
                                            )}
                                        >
                                            {player2}{' '}
                                            <span>{match.result?.player2}</span>
                                        </li>
                                    </div>
                                );
                            })}
                        </ul>
                    );
                })}
                {/*                 <ul className="round round-2">
                    <li className="spacer">&nbsp;</li>

                    <li className="game game-top winner">
                        Lousville <span>82</span>
                    </li>
                    <li
                        style={{
                            height: `${2 * 40}px`,
                            display: 'grid',
                        }}
                        className="game game-spacer"
                    >
                        <Button>Enter Result</Button>
                    </li>
                    <li className="game game-bottom">
                        Colo St <span>56</span>
                    </li>

                    <li className="spacer">&nbsp;</li>

                    <li className="game game-top winner">
                        Oregon <span>74</span>
                    </li>
                    <li
                        style={{
                            height: `${2 * 40}px`,
                            display: 'grid',
                        }}
                        className="game game-spacer"
                    >
                        <Button>Enter Result</Button>
                    </li>
                    <li className="game game-bottom">
                        Saint Louis <span>57</span>
                    </li>

                    <li className="spacer">&nbsp;</li>
                </ul> */}
            </div>
        </Typography>
    );
};

export default KnockoutTournamentPlan;
