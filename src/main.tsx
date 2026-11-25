import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { initProductionGuard } from './lib/antiInspect';
import './index.css';
import App from './App';

initProductionGuard();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
