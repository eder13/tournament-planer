import AccountBox from '@mui/icons-material/AccountBox';
import {
    Grid,
    Card,
    CardContent,
    Typography,
    CardActions,
    Button,
    Tooltip,
    IconButton,
} from '@mui/material';
import {
    SeparatorPlayerUUIDDatabaes,
    HTTPMethod,
    HttpCode,
} from '../../../../../server/src/constants/common';
import type { Dispatch, FC } from 'react';
import type { Player } from '../../../types/common';

type Props = {
    started: boolean;
    timer: number;
    players: Player[];
    setPlayers: Dispatch<React.SetStateAction<Player[]>>;
    onClickStartTournament: (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => void;
};

const TournamentDetailsContent: FC<Props> = ({
    started,
    timer,
    players,
    setPlayers,
    onClickStartTournament,
}) => {
    return (
        <div className="mb-5">
            {started && (
                <div className="mb-5">
                    <h2>Knockout Tournament Plan</h2>
                </div>
            )}
            <div className="d-flex justify-content-between">
                <h3 className="mb-3">Enrolled Players</h3>
                <div>{!started && <h3>{timer / 1000}s</h3>}</div>
            </div>
            {players.length === 0 ? (
                <div>
                    No Players have enrolled yet... Scan the QR Code or manually
                    type in the URL to join!
                </div>
            ) : (
                <Grid
                    container
                    spacing={5}
                >
                    {players.map((player, id) => (
                        <Grid
                            key={`${id}-player-grid-${player.id}`}
                            size={4}
                        >
                            <Card>
                                <CardContent>
                                    <Typography
                                        variant="h5"
                                        component="div"
                                    >
                                        <AccountBox />
                                    </Typography>
                                    <Typography variant="h5">
                                        {
                                            player.player.name.split(
                                                SeparatorPlayerUUIDDatabaes
                                            )[0]
                                        }
                                    </Typography>
                                </CardContent>
                                {!started && (
                                    <CardActions className="pb-3 d-flex justify-content-center align-items-center">
                                        <form
                                            onSubmit={(e) => {
                                                e.preventDefault();
                                                const playerId = player.id;

                                                fetch(`/players/${player.id}`, {
                                                    method: HTTPMethod.DELETE,
                                                }).then((res) => {
                                                    if (
                                                        res.status ===
                                                        HttpCode.NO_CONTENT
                                                    ) {
                                                        setPlayers(
                                                            players.filter(
                                                                (player) =>
                                                                    player.id !==
                                                                    playerId
                                                            )
                                                        );
                                                    }
                                                });
                                            }}
                                        >
                                            <Button
                                                variant="contained"
                                                color="error"
                                                size="small"
                                                type="submit"
                                            >
                                                Remove
                                            </Button>
                                        </form>
                                    </CardActions>
                                )}
                            </Card>
                        </Grid>
                    ))}

                    {!started && (
                        <Grid size={1}>
                            <Tooltip
                                title={
                                    players.length < 2
                                        ? 'You must have at least 2 Players to start a knockout tournament'
                                        : undefined
                                }
                            >
                                <IconButton>
                                    <Button
                                        disabled={players.length < 2}
                                        variant="contained"
                                        onClick={onClickStartTournament}
                                    >
                                        Start Tournament
                                    </Button>
                                </IconButton>
                            </Tooltip>
                        </Grid>
                    )}
                </Grid>
            )}
        </div>
    );
};

export default TournamentDetailsContent;
