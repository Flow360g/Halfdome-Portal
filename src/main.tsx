import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, HashRouter } from 'react-router-dom';
import { App } from './App';
import './styles/fonts.css';
import './styles/tokens.css';
import './styles/base.css';
import './styles/components.css';
import './styles/layout.css';
import './styles/shell.css';
import './styles/dashboard.css';
import './styles/content.css';
import './styles/ask.css';
import './styles/calendar.css';

// The single-file preview has no server to route paths, so it keeps the route in the URL hash.
const artifact = import.meta.env.MODE === 'artifact';
const Router = artifact ? HashRouter : BrowserRouter;

// A preview can open on a page other than the hub, e.g. VITE_PREVIEW_ROUTE=/calendar.
const startRoute = import.meta.env.VITE_PREVIEW_ROUTE;
if (artifact && startRoute && !window.location.hash) window.history.replaceState(null, '', `#${startRoute}`);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <App />
    </Router>
  </StrictMode>,
);
