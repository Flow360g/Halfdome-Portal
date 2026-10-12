import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { AskHubProvider } from './components/AskHub';
import { SiteFooter } from './components/SiteFooter';
import { SiteHeader } from './components/SiteHeader';
import { Dashboard } from './pages/Dashboard';
import { TopicPage } from './pages/TopicPage';

/** Scrolls to a #section when the URL names one, otherwise to the top on each new page. */
function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView({ block: 'start' });
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
}

export function App() {
  return (
    <AskHubProvider>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <ScrollManager />
      <SiteHeader />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/topics/:topicSlug" element={<TopicPage />} />
        <Route path="/topics/:topicSlug/:pageSlug" element={<TopicPage />} />
        <Route path="*" element={<TopicPage />} />
      </Routes>
      <SiteFooter />
    </AskHubProvider>
  );
}
