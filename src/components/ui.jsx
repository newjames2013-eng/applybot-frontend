import React from 'react';

export function Spinner({ size = 18, color = 'var(--blue)' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ animation: 'spin 0.7s linear infinite' }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <circle cx="12" cy="12" r="9" stroke={color} strokeOpacity="0.2" strokeWidth="2.5" />
      <path d="M12 3a9 9 0 0 1 9 9" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

const btnStyles = {
  base: { display: 'inline-flex', alignItems: 'center', gap: 6, border: 'none', borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-sans)', fontWeight: 500, cursor: 'pointer', transition: 'opacity 0.15s, transform 0.1s', whiteSpace: 'nowrap' },
  sm: { fontSize: 12, padding: '5px 10px' },
  md: { fontSize: 13, padding: '7px 14px' },
  lg: { fontSize: 14, padding: '10px 20px' },
  primary: { background: 'var(--blue)', color: '#fff' },
  secondary: { background: 'var(--surface)', color: 'var(--text-primary)', border: '1px solid var(--border-strong)' },
  ghost: { background: 'transparent', color: 'var(--text-secondary)', border: '1px solid var(--border)' },
  danger: { background: 'var(--red)', color: '#fff' },
  success: { background: 'var(--green)', color: '#fff' },
};

export function Button({ children, variant = 'primary', size = 'md', loading, disabled, onClick, style, type = 'button' }) {
  return (
    <button type={type} onClick={onClick} disabled={disabled || loading}
      style={{ ...btnStyles.base, ...btnStyles[size], ...btnStyles[variant], opacity: (disabled || loading) ? 0.55 : 1, ...style }}
      onMouseEnter={e => { if (!disabled && !loading) e.currentTarget.style.opacity = '0.85'; }}
      onMouseLeave={e => { e.currentTarget.style.opacity = (disabled || loading) ? '0.55' : '1'; }}
      onMouseDown={e => { e.currentTarget.style.transform = 'scale(0.97)'; }}
      onMouseUp={e => { e.currentTarget.style.transform = 'scale(1)'; }}
    >
      {loading ? <Spinner size={14} color={variant === 'secondary' || variant === 'ghost' ? 'var(--text-secondary)' : '#fff'} /> : null}
      {children}
    </button>
  );
}

const badgeColors = {
  success: { bg: 'var(--green-light)', color: 'var(--green-text)' },
  danger:  { bg: 'var(--red-light)',   color: 'var(--red-text)'   },
  warning: { bg: 'var(--amber-light)', color: 'var(--amber-text)' },
  info:    { bg: 'var(--blue-light)',  color: 'var(--blue-text)'  },
  neutral: { bg: 'var(--surface-2)',   color: 'var(--text-secondary)' },
};

export function Badge({ children, variant = 'neutral', style }) {
  const c = badgeColors[variant] || badgeColors.neutral;
  return <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 500, padding: '2px 8px', borderRadius: 99, background: c.bg, color: c.color, ...style }}>{children}</span>;
}

export function Card({ children, style, padding = '20px' }) {
  return <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding, ...style }}>{children}</div>;
}

export function Toggle({ checked, onChange, label, sub }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
      <div>
        <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>{label}</div>
        {sub && <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>{sub}</div>}
      </div>
      <label style={{ position: 'relative', width: 38, height: 22, cursor: 'pointer', flexShrink: 0 }}>
        <input type="checkbox" checked={checked} onChange={onChange} style={{ opacity: 0, width: 0, height: 0 }} />
        <span style={{ position: 'absolute', inset: 0, background: checked ? 'var(--blue)' : 'var(--border-strong)', borderRadius: 99, transition: 'background 0.2s' }} />
        <span style={{ position: 'absolute', top: 3, left: checked ? 19 : 3, width: 16, height: 16, background: '#fff', borderRadius: '50%', transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
      </label>
    </div>
  );
}

export function StatCard({ label, value, sub, subColor, mono = true }) {
  return (
    <div style={{ background: 'var(--surface-2)', borderRadius: 'var(--radius-md)', padding: '14px 16px' }}>
      <div style={{ fontSize: 11, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 500, fontFamily: mono ? 'var(--font-mono)' : 'var(--font-sans)', color: 'var(--text-primary)', lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: subColor || 'var(--text-tertiary)', marginTop: 6 }}>{sub}</div>}
    </div>
  );
}

export function EmptyState({ icon = '📭', title, sub }) {
  return (
    <div style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--text-secondary)' }}>
      <div style={{ fontSize: 32, marginBottom: 12 }}>{icon}</div>
      <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 6 }}>{title}</div>
      {sub && <div style={{ fontSize: 13 }}>{sub}</div>}
    </div>
  );
}

export function ErrorBanner({ message, onRetry }) {
  return (
    <div style={{ background: 'var(--red-light)', color: 'var(--red-text)', borderRadius: 'var(--radius-md)', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 13, marginBottom: 16 }}>
      <span>⚠ {message}</span>
      {onRetry && <Button variant="ghost" size="sm" onClick={onRetry} style={{ color: 'var(--red-text)', borderColor: 'var(--red-text)' }}>Retry</Button>}
    </div>
  );
}

export function SectionHeader({ title, sub, action }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
      <div>
        <h1 style={{ fontSize: 18, fontWeight: 500, color: 'var(--text-primary)', letterSpacing: '-0.3px' }}>{title}</h1>
        {sub && <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 3 }}>{sub}</p>}
      </div>
      {action}
    </div>
  );
}
