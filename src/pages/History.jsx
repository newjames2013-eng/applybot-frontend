import React, { useState } from 'react';
import { useApi } from '../hooks/useApi';
import { getHistory } from '../api/client';
import { Card, Badge, EmptyState, ErrorBanner, SectionHeader, Spinner } from '../components/ui';

const FILTERS = [
  { key: null,        label: 'All'       },
  { key: 'submitted', label: 'Submitted' },
  { key: 'failed',    label: 'Failed'    },
];

function FilterBtn({ active, onClick, children, count }) {
  return (
    <button onClick={onClick} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 12px', borderRadius: 99, fontSize: 12, fontFamily: 'var(--font-sans)', background: active ? 'var(--text-primary)' : 'var(--surface)', color: active ? '#fff' : 'var(--text-secondary)', border: `1px solid ${active ? 'var(--text-primary)' : 'var(--border-strong)'}`, cursor: 'pointer', fontWeight: active ? 500 : 400 }}>
      {children}
      {count != null && <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', background: active ? 'rgba(255,255,255,0.2)' : 'var(--surface-2)', color: active ? '#fff' : 'var(--text-tertiary)', padding: '1px 5px', borderRadius: 99 }}>{count}</span>}
    </button>
  );
}

export default function History({ userId }) {
  const [filter, setFilter] = useState(null);
  const { data, loading, error, refetch } = useApi(
    () => getHistory(userId, { limit: 100, status: filter || undefined }),
    [userId, filter]
  );

  const apps = data?.applications ?? [];
  const counts = {
    all: data?.total ?? 0,
    submitted: apps.filter(a => a.status === 'submitted').length,
    failed: apps.filter(a => a.status === 'failed').length,
  };

  return (
    <div>
      <SectionHeader title="Application history" sub="Every job application submitted by ApplyBot" />
      {error && <ErrorBanner message={error} onRetry={refetch} />}
      <div style={{ display: 'flex', gap: 6, marginBottom: 16, alignItems: 'center' }}>
        {FILTERS.map(f => (
          <FilterBtn key={String(f.key)} active={filter === f.key} onClick={() => setFilter(f.key)} count={f.key === null ? counts.all : counts[f.key]}>
            {f.label}
          </FilterBtn>
        ))}
        {loading && <Spinner size={14} />}
      </div>
      <Card padding="0" style={{ overflow: 'hidden' }}>
        {loading && apps.length === 0 ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}><Spinner /></div>
        ) : apps.length === 0 ? (
          <EmptyState icon="🗂" title="No applications found" sub="Change the filter or wait for automation to run" />
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['Role','Company','Platform','Date','Status'].map((h, i) => (
                  <th key={h} style={{ textAlign: 'left', padding: '11px 14px', fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-tertiary)', width: ['35%','22%','14%','18%','11%'][i] }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {apps.map((app, i) => (
                <tr key={i} style={{ borderBottom: i < apps.length - 1 ? '1px solid var(--border)' : 'none' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-2)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '10px 14px', fontWeight: 500, maxWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{app.jobTitle}</td>
                  <td style={{ padding: '10px 14px', color: 'var(--text-secondary)' }}>{app.company}</td>
                  <td style={{ padding: '10px 14px' }}><span style={{ fontSize: 10, background: 'var(--surface-2)', color: 'var(--text-secondary)', padding: '3px 7px', borderRadius: 4, fontWeight: 500 }}>{app.platform || 'LinkedIn'}</span></td>
                  <td style={{ padding: '10px 14px', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', fontSize: 12 }}>{app.appliedAt ? new Date(app.appliedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}</td>
                  <td style={{ padding: '10px 14px' }}><Badge variant={app.status === 'submitted' ? 'success' : 'danger'}>{app.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
}
