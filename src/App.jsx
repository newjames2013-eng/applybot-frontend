import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './styles/global.css';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import History from './pages/History';
import Preferences from './pages/Preferences';
import Resume from './pages/Resume';
import Billing from './pages/Billing';

const MOCK_USER = {
  userId: 'user_001',
  name: 'Alex Kim',
  email: 'alex@email.com',
  plan: 'Pro',
};

export default function App() {
  const [automationActive, setAutomationActive] = useState(true);

  return (
    <BrowserRouter>
      <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
        <Sidebar
          user={MOCK_USER}
          automationActive={automationActive}
          onToggleAutomation={setAutomationActive}
        />
        <main style={{ flex: 1, overflowY: 'auto', padding: '32px 36px', background: 'var(--bg)' }}>
          <Routes>
            <Route path="/"            element={<Dashboard userId={MOCK_USER.userId} />} />
            <Route path="/history"     element={<History userId={MOCK_USER.userId} />} />
            <Route path="/preferences" element={<Preferences />} />
            <Route path="/resume"      element={<Resume userId={MOCK_USER.userId} />} />
            <Route path="/billing"     element={<Billing />} />
            <Route path="*"            element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
