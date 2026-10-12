import { Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from './shell/AppShell';
import { CalendarPage } from './pages/CalendarPage';

export default function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/calendar" element={<CalendarPage />} />
        {/* The People hub takes "/" when it merges in; until then the calendar is home. */}
        <Route path="*" element={<Navigate to="/calendar" replace />} />
      </Routes>
    </AppShell>
  );
}
