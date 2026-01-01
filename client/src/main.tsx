import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.scss';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import App from './App';
import GlobalProvider from './context/global-context/GlobalProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

declare global {
    interface Window {
        __TANSTACK_QUERY_CLIENT__: import('@tanstack/query-core').QueryClient;
    }
}

window.__TANSTACK_QUERY_CLIENT__ = queryClient;

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <GlobalProvider>
                <App />
            </GlobalProvider>
        </QueryClientProvider>
    </StrictMode>
);
