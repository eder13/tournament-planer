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
    CircularProgress,
    Alert,
} from '@mui/material';
import { SeparatorPlayerUUIDDatabaes } from '../../../../../server/src/constants/common';
import { type FC } from 'react';
import type { Player } from '../../../types/common';
import KnockoutTournamentPlan from '../../knockout-tournament-plan/KnockoutTournamentPlan';
import { useTimedMessageDisplay } from '../../../hooks/useTimedMessageDisplay/useTimedMessageDisplay';
import { useGetRoundsMatchesOfTournament } from '../../../hooks/data-fetching/useGetRoundsMatchesOfTournament/useGetRoundsMatchesOfTournament';
import { useDeletePlayerOfTournament } from '../../../hooks/data-fetching/useDeletePlayerOfTournament/useDeletePlayerOfTournament';

type Props = {
    started: boolean;
    timer: number;
    players: Player[];
    onClickStartTournament: (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => void;
    tournamentId: string;
    isErrorStartingTournament: boolean;
    isSuccessStartingTournament: boolean;
    isPendingStartingTournament: boolean;
};

const TournamentDetailsContent: FC<Props> = ({
    started,
    timer,
    players,
    onClickStartTournament,
    tournamentId,
    isErrorStartingTournament,
    isSuccessStartingTournament,
    isPendingStartingTournament,
}) => {
    const isError = useTimedMessageDisplay(isErrorStartingTournament);
    const isSuccess = useTimedMessageDisplay(isSuccessStartingTournament);
    const {
        data,
        isError: isErrorGetTable,
        isPending,
    } = useGetRoundsMatchesOfTournament(tournamentId, started);
    const { mutate: deletePlayerMutate, isError: isErrorDeletingPlayer } =
        useDeletePlayerOfTournament();
    const showIsErrorDeletingPlayer = useTimedMessageDisplay(
        isErrorDeletingPlayer
    );

    if (isPendingStartingTournament) {
        return <CircularProgress />;
    }

    return (
        <div className="mb-5">
            {isSuccess && (
                <Alert severity="success">
                    Tournament started and Table has been created!
                </Alert>
            )}
            {started && (
                <div className="mb-5">
                    <h2 className="mb-5">Knockout Tournament Plan</h2>
                    <KnockoutTournamentPlan
                        isPending={isPending}
                        data={data}
                        isError={isErrorGetTable}
                    />
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
                <>
                    {showIsErrorDeletingPlayer && (
                        <Alert
                            severity="error"
                            className="mb-3"
                        >
                            Could not delete Player. Please try again.
                        </Alert>
                    )}
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
                                                /* @ts-ignore */
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
                                                    deletePlayerMutate(
                                                        playerId
                                                    );
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
                            <>
                                {isError && (
                                    <Alert severity="error">
                                        Could not Start Tournament. Please try
                                        again.
                                    </Alert>
                                )}
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
                            </>
                        )}
                    </Grid>
                </>
            )}
        </div>
    );
};

export default TournamentDetailsContent;
