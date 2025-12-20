import { Typography } from '@mui/material';
import Page from '../structure/page/Page';

const RulesPage = () => {
    return (
        <Page>
            <h1 className="mb-5">Rules</h1>
            <Typography>
                <ol>
                    <li className="pb-3">
                        This tournament follows a{' '}
                        <strong>single-elimination (knockout)</strong> format,
                        meaning that a player is eliminated from the tournament
                        after losing a single match.
                    </li>

                    <li className="pb-3">
                        All players are randomly assigned to matches at the
                        start of the tournament to ensure fairness and avoid
                        predictable pairings.
                    </li>

                    <li className="pb-3">
                        Each match consists of exactly two players. The winner
                        of the match advances to the next round, while the loser
                        is eliminated from the tournament.
                    </li>

                    <li className="pb-3">
                        The total number of players in the tournament must be at
                        least two. There is no upper limit on the number of
                        participants.
                    </li>

                    <li className="pb-3">
                        If the number of players is{' '}
                        <strong>not a power of two</strong>,{' '}
                        <strong>BYEs</strong> are assigned in the first round. A
                        BYE allows a player to automatically advance to the next
                        round without playing a match.
                    </li>

                    <li className="pb-3">
                        The number of BYEs is calculated by rounding the total
                        number of players up to the next power of two and
                        assigning the difference as BYEs.
                    </li>

                    <li className="pb-3">
                        Players receiving a BYE are selected randomly. The
                        system may track BYE counts per player to ensure that
                        BYEs are distributed as fairly as possible across
                        multiple tournaments.
                    </li>

                    <li className="pb-3">
                        A match with a BYE is treated as an automatic win for
                        the player without an opponent, and the player advances
                        directly to the next round.
                    </li>

                    <li className="pb-3">
                        After each round, the advancing players are paired again
                        to form the next round of matches until only one player
                        remains.
                    </li>

                    <li className="pb-3">
                        The final remaining player after all rounds have been
                        completed is declared the tournament winner.
                    </li>

                    <li className="pb-3">
                        Draws are not permitted. Every match must produce
                        exactly one winner.
                    </li>

                    <li className="pb-3">
                        This tournament structure is commonly known as a{' '}
                        <strong>Single-Elimination Tournament</strong> and
                        follows the principles described on Wikipedia:&nbsp;
                        <a
                            href="https://en.wikipedia.org/wiki/Single-elimination_tournament"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            https://en.wikipedia.org/wiki/Single-elimination_tournament
                        </a>
                    </li>
                </ol>
            </Typography>
        </Page>
    );
};

export default RulesPage;
