import { useEffect } from 'react';
import { Outlet, Route, Routes, useLocation } from 'react-router-dom';
import { AskHubProvider } from './components/AskHub';
import { SiteFooter } from './components/SiteFooter';
import { SiteHeader } from './components/SiteHeader';
import { CalendarPage } from './pages/CalendarPage';
import { Dashboard } from './pages/Dashboard';
import { TopicPage } from './pages/TopicPage';
import { AppShell } from './shell/AppShell';

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

/** The People hub's own top bar sits above its pages; the portal side nav carries the logo. */
function HubLayout() {
  return (
    <>
      <SiteHeader />
      <Outlet />
    </>
  );
}

export function App() {
  return (
    <AskHubProvider>
      <ScrollManager />
      <AppShell>
        <Routes>
          <Route path="/calendar" element={<CalendarPage />} />
          <Route element={<HubLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/topics/:topicSlug" element={<TopicPage />} />
            <Route path="/topics/:topicSlug/:pageSlug" element={<TopicPage />} />
            <Route path="*" element={<TopicPage />} />
          </Route>
        </Routes>
        <SiteFooter />
      </AppShell>
    </AskHubProvider>
  );
}
