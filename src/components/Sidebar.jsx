import React from 'react';
import { NavLink } from 'react-router-dom';
import { useMutation } from '../hooks/useApi';
import { pauseUser } from '../api/client';

const NAV = [
  { group: 'Overview', items: [
    { to: '/',            icon: '▦', label: 'Dashboard'       },
    { to: '/history',     icon: '◷', label: 'History'         },
  ]},
  { group: 'Automation', items: [
    { to: '/preferences', icon: '◈', label: 'Preferences'     },
    { to: '/resume',      icon: '◉', label: 'Resume & profile'},
  ]},
  { group: 'Account', items: [
    { to: '/billing',     icon: '◇', label: 'Billing'         },
  ]},
];

export default function Sidebar({ user, automationActive, onToggleAutomation }) {
  const { mutate: doPause, loading: pausing } = useMutation(pauseUser);

  async function handleToggle() {
    if (automationActive) await doPause(user.userId).catch(() => {});
    onToggleAutomation(!automationActive);
  }

  return (
    <aside style={{ width: 'var(--sidebar-w)', flexShrink: 0, background: 'var(--sidebar-bg)', display: 'flex', flexDirection: 'column', height: '100vh', position: 'sticky', top: 0, borderRight: '1px solid var(--sidebar-border)' }}>
      <div style={{ padding: '22px 20px 18px', borderBottom: '1px solid var(--sidebar-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: 'var(--blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>→</div>
          <span style={{ fontSize: 15, fontWeight: 600, color: '#fff', letterSpacing: '-0.3px' }}>ApplyBot</span>
        </div>
        <button onClick={handleToggle} disabled={pausing} style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 6, background: automationActive ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)', border: 'none', borderRadius: 99, padding: '4px 10px 4px 6px', cursor: 'pointer', fontSize: 11, fontWeight: 500, color: automationActive ? '#4ade80' : '#f87171', width: '100%' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: automationActive ? '#4ade80' : '#f87171', animation: automationActive ? 'pulse 2s ease-in-out infinite' : 'none' }} />
          <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
          {automationActive ? 'Automation running' : 'Automation paused'}
        </button>
      </div>

      <nav style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
        {NAV.map(group => (
          <div key={group.group}>
            <div style={{ fontSize: 9, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.25)', padding: '14px 20px 4px' }}>{group.group}</div>
            {group.items.map(item => (
              <NavLink key={item.to} to={item.to} end={item.to === '/'}
                style={({ isActive }) => ({ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 20px', color: isActive ? 'var(--sidebar-text-active)' : 'var(--sidebar-text)', background: isActive ? 'var(--sidebar-active-bg)' : 'transparent', borderLeft: `2px solid ${isActive ? 'var(--sidebar-accent)' : 'transparent'}`, textDecoration: 'none', fontSize: 13, transition: 'all 0.1s' })}
              >
                <span style={{ fontSize: 14, opacity: 0.8 }}>{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      <div style={{ padding: '14px 16px', borderTop: '1px solid var(--sidebar-border)' }}>
        <div style={{ background: 'rgba(59,130,246,0.12)', borderRadius: 8, padding: '4px 8px', display: 'inline-block', fontSize: 10, fontWeight: 600, color: '#93c5fd', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>
          {user.plan} plan
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'rgba(59,130,246,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600, color: '#93c5fd', flexShrink: 0 }}>
            {user.name.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase()}
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 500, color: '#fff' }}>{user.name}</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>{user.email}</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
