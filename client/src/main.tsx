import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.scss';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import App from './App';
import GlobalProvider from './context/global-context/GlobalProvider';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <GlobalProvider>
            <App />
        </GlobalProvider>
    </StrictMode>
);
