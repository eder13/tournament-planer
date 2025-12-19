import type { FC } from 'react';
import Page from '../structure/page/Page';
import SusiComponent from '../components/signup-signin-component/SusiComponent';

const SignIn: FC = () => {
    return (
        <Page>
            <h1 className="mb-5">Sign In to your Account</h1>
            <SusiComponent />
        </Page>
    );
};

export default SignIn;
