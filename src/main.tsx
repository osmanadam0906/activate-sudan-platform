import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {ClerkProviderBridge} from './lib/clerk-bridge.tsx';
import App from './App.tsx';
import './index.css';

const envKey = (import.meta as any).env?.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
const PUBLISHABLE_KEY = (envKey && typeof envKey === 'string' && envKey.trim().startsWith('pk_'))
  ? envKey.trim()
  : "pk_test_c291bmQtbGFyay01MC5jbGVyay5hY2NvdW50cy5kZXYk";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ClerkProviderBridge publishableKey={PUBLISHABLE_KEY}>
      <App />
    </ClerkProviderBridge>
  </StrictMode>,
);
