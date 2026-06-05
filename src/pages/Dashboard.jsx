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
