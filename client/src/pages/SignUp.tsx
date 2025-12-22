import type { FC } from 'react';
import Page from '../structure/page/Page';
import SusiComponent from '../components/signup-signin-component/SusiComponent';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router';
import CommonConstants from '../constants/CommonConstants';

const SignUp: FC = () => {
    const navigate = useNavigate();

    return (
        <Page>
            <h1 className="mb-5">Register</h1>
            <SusiComponent isSignUp={true} />
            <Button
                onClick={() => navigate(CommonConstants.Routes.Login)}
                variant="outlined"
                className="mt-5"
                sx={{ width: '300px' }}
            >
                Already Registered? Login
            </Button>
        </Page>
    );
};

export default SignUp;
