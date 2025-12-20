class TournamentHelper {
    static shuffle<T>(arr: T[]): T[] {
        return [...arr].sort(() => Math.random() - 0.5);
    }

    static getNextPowerOfTwoForTournamentTable(n: number) {
        return 2 ** Math.ceil(Math.log2(n));
    }
}

export default TournamentHelper;
