import Page from '../structure/page/Page';

const Error404 = () => {
    return (
        <Page>
            <h1 className="mb-3">Ooops... This page does not exists.</h1>
            <a href="/">Go to home</a>
        </Page>
    );
};

export default Error404;
