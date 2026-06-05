import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useApi } from '../hooks/useApi';
import { getStats, getHistory } from '../api/client';
import { StatCard, Card, Badge, EmptyState, ErrorBanner, SectionHeader, Button, Spinner } from '../components/ui';

const DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

function buildWeekData(total = 0) {
  const base = [18,22,15,25,19,12,0];
  const today = new Date().getDay();
  return DAYS.map((d, i) => ({
    day: d,
    apps: i < (today === 0 ? 6 : today - 1) ? base[i] : i === (today === 0 ? 6 : today - 1) ? (total || 0) : 0,
    isToday: i === (today === 0 ? 6 : today - 1),
  }));
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'var(--sidebar-bg)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '8px 12px' }}>
      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: 16, fontWeight: 500, color: '#fff', fontFamily: 'var(--font-mono)' }}>{payload[0].value}</div>
    </div>
  );
}

export default function Dashboard({ userId }) {
  const { data: stats, loading: statsLoading, error: statsErr, refetch } = useApi(
    () => getStats(userId), [userId], { pollInterval: 30000 }
  );
  const { data: histData, loading: histLoading } = useApi(
    () => getHistory(userId, { limit: 6 }), [userId], { pollInterval: 30000 }
  );

  const today    = stats?.today?.applied ?? 0;
  const allTime  = stats?.allTime ?? {};
  const weekData = buildWeekData(today);
  const history  = histData?.applications ?? [];
  const dailyLimit = 25;
  const limitPct   = Math.min(Math.round((today / dailyLimit) * 100), 100);

  return (
    <div>
      <SectionHeader
        title="Dashboard"
        sub={statsLoading ? 'Loading…' : `Last checked just now · ${today} applications today`}
        action={<Button variant="secondary" size="sm" onClick={refetch}>↻ Refresh</Button>}
      />
      {statsErr && <ErrorBanner message={`Could not reach engine: ${statsErr}`} onRetry={refetch} />}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 20 }}>
        <StatCard label="Applied today" value={statsLoading ? '—' : today} sub={`${limitPct}% of daily limit`} subColor={limitPct > 80 ? 'var(--amber)' : 'var(--text-tertiary)'} />
        <StatCard label="All time" value={statsLoading ? '—' : (allTime.total ?? 0)} sub="Total submitted" />
        <StatCard label="Success rate" value={statsLoading ? '—' : `${allTime.successRate ?? 0}%`} sub="Form completions" subColor={allTime.successRate > 85 ? 'var(--green)' : 'var(--amber)'} />
        <StatCard label="Daily limit" value={`${today} / ${dailyLimit}`} sub={
          <div>
            <div style={{ height: 4, background: 'var(--border-strong)', borderRadius: 2, marginTop: 6, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${limitPct}%`, background: limitPct > 80 ? 'var(--amber)' : 'var(--blue)', borderRadius: 2, transition: 'width 0.4s' }} />
            </div>
          </div>
        } />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
        <Card>
          <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
            <span>This week</span>
            <span style={{ fontSize: 11, color: 'var(--text-tertiary)', fontWeight: 400 }}>Mon – Sun</span>
          </div>
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={weekData} barSize={24} margin={{ top: 0, right: 0, left: -28, bottom: 0 }}>
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'var(--text-tertiary)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--text-tertiary)' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.04)' }} />
              <Bar dataKey="apps" radius={[4,4,0,0]}>
                {weekData.map((entry, i) => <Cell key={i} fill={entry.isToday ? 'var(--blue)' : 'var(--surface-2)'} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card>
          <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 16 }}>Recent activity</div>
          {histLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: 24 }}><Spinner /></div>
          ) : history.length === 0 ? (
            <EmptyState icon="📭" title="No applications yet" sub="Start automation to see activity here" />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {history.map((app, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: i < history.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <div style={{ width: 7, height: 7, borderRadius: '50%', flexShrink: 0, background: app.status === 'submitted' ? 'var(--green)' : 'var(--red)' }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="truncate" style={{ fontSize: 13 }}>{app.jobTitle}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{app.company}</div>
                  </div>
                  <Badge variant={app.status === 'submitted' ? 'success' : 'danger'}>{app.status}</Badge>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
      <Card>
        <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 14 }}>All-time breakdown</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, background: 'var(--border)' }}>
          {[
            { label: 'Submitted',    value: allTime.submitted ?? 0,           color: 'var(--green)' },
            { label: 'Failed',       value: allTime.failed ?? 0,              color: 'var(--red)'   },
            { label: 'Success rate', value: `${allTime.successRate ?? 0}%`,   color: 'var(--blue)'  },
          ].map(item => (
            <div key={item.label} style={{ background: 'var(--surface)', padding: '14px 18px' }}>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>{item.label}</div>
              <div style={{ fontSize: 22, fontWeight: 500, fontFamily: 'var(--font-mono)', color: item.color }}>{statsLoading ? '—' : item.value}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
