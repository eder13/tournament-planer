import { Stack, TextField, Button, Alert } from '@mui/material';
import { useState, type FC } from 'react';
import { Link, useSearchParams } from 'react-router';
import CommonConstants from '../../constants/CommonConstants';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

type Props = {
    isSignUp?: boolean;
};

const SusiComponent: FC<Props> = ({ isSignUp }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [params] = useSearchParams();

    return (
        <>
            {params.get('username_password_error') && (
                <Alert
                    className="mb-3"
                    severity="error"
                >
                    <FontAwesomeIcon icon="xmark" />
                    <span>E-Mail or Password are incorrect.</span>
                </Alert>
            )}

            <form
                action={isSignUp ? '/register' : '/login'}
                method="post"
            >
                <Stack
                    sx={{ maxWidth: '500px' }}
                    spacing={2}
                >
                    <TextField
                        placeholder="mail@example.com"
                        id="email"
                        name="email"
                        label="E-Mail"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    ></TextField>
                    <TextField
                        type="password"
                        id="password"
                        name="password"
                        label="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    ></TextField>
                    {isSignUp && (
                        <TextField
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            label="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        ></TextField>
                    )}
                    <Button
                        className="mb-3"
                        variant="contained"
                        type="submit"
                    >
                        {isSignUp ? 'Register' : 'Login'}
                    </Button>
                    {!isSignUp && (
                        <Link to={CommonConstants.Routes.PasswordForgot}>
                            <Button type="button">Forgot your Password?</Button>
                        </Link>
                    )}
                </Stack>
            </form>
        </>
    );
};

export default SusiComponent;
