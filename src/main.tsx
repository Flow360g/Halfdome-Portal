import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import App from './App';
import './styles/fonts.css';
import './styles/tokens.css';
import './styles/base.css';
import './styles/components.css';
import './styles/shell.css';
import './styles/calendar.css';

// The single-file Artifact preview has no server routes, so it keeps routing in memory.
const Router = import.meta.env.MODE === 'artifact' ? MemoryRouter : BrowserRouter;
const routerProps = import.meta.env.MODE === 'artifact' ? { initialEntries: ['/calendar'] } : {};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router {...routerProps}>
      <App />
    </Router>
  </StrictMode>,
);
