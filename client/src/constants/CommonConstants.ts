export default {
    Routes: {
        Home: '/',
        Login: '/signin',
        Register: '/signup',
        PasswordForgot: '/forgot-password',
        UserProfile: '/userprofile',
        Rules: '/rules',
        TournamentDetails: '/userprofile/tournaments/:tournamentId',
        JoinTournament: '/join/tournaments/:tournamentId',
        EnterMatchResult:
            '/match/:tournamentId/:roundId/:matchId/:player1/:player2',
    },
};
