import type { FC } from 'react';
import Page from '../structure/page/Page';
import SusiComponent from '../components/signup-signin-component/SusiComponent';
import { useNavigate } from 'react-router';
import CommonConstants from '../constants/CommonConstants';
import { Button } from '@mui/material';

const SignIn: FC = () => {
    const navigate = useNavigate();

    return (
        <Page>
            <h1 className="mb-5">Sign In to your Account</h1>
            <SusiComponent />
            <Button
                onClick={() => navigate(CommonConstants.Routes.Register)}
                variant="outlined"
                className="mt-5"
                sx={{ width: '300px' }}
            >
                New? Register
            </Button>
        </Page>
    );
};

export default SignIn;
