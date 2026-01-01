export default {
    Routes: {
        Home: '/',
        Login: '/signin',
        Register: '/signup',
        PasswordForgot: '/forgot-password',
        ResendActivationLink: '/account/activate',
        UserProfile: '/userprofile',
        Rules: '/rules',
        TournamentDetails: '/userprofile/tournaments/:tournamentId',
        JoinTournament: '/join/tournaments/:tournamentId',
        EnterMatchResult:
            '/match/:tournamentId/:roundId/:matchId/:player1/:player2',
    },

    RegExEmail: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    MIN_PASSWORD_LENGTH: 8,
    SUCCESS_ERROR_MSG_DISPLAY_DURATION_MS: 5000,
};
