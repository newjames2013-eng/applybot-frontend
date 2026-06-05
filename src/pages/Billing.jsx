import React from 'react';
import { Card, Button, Badge, SectionHeader } from '../components/ui';

const PLANS = [
  {
    key: 'starter', name: 'Starter', price: 19, limit: '10 apps/day',
    features: ['LinkedIn automation', 'Email notifications', 'Basic history log'],
    missing: ['Indeed (Phase 2)', 'Weekly AI report', 'Priority queue'],
  },
  {
    key: 'pro', name: 'Pro', price: 39, limit: '25 apps/day', current: true,
    features: ['LinkedIn automation', 'Email notifications', 'Full history log', 'Both platforms (Phase 2)'],
    missing: ['Weekly AI report', 'Priority queue'],
  },
  {
    key: 'unlimited', name: 'Unlimited', price: 69, limit: '50 apps/day',
    features: ['LinkedIn automation', 'Email notifications', 'Full history log', 'Both platforms (Phase 2)', 'Priority job queue', 'Weekly AI report'],
    missing: [],
  },
];

export default function Billing() {
  return (
    <div>
      <SectionHeader title="Billing" sub="Manage your subscription plan" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 20 }}>
        {PLANS.map(plan => (
          <Card key={plan.key} style={{ border: plan.current ? '2px solid var(--blue)' : '1px solid var(--border)', position: 'relative' }}>
            {plan.current && (
              <div style={{ position: 'absolute', top: -1, right: 16, background: 'var(--blue)', color: '#fff', fontSize: 9, fontWeight: 700, padding: '3px 8px', borderRadius: '0 0 6px 6px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Current</div>
            )}
            <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 2 }}>{plan.name}</div>
            <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 12 }}>{plan.limit}</div>
            <div style={{ marginBottom: 14 }}>
              <span style={{ fontSize: 28, fontWeight: 500, fontFamily: 'var(--font-mono)' }}>${plan.price}</span>
              <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>/mo</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginBottom: 16 }}>
              {plan.features.map(f => (
                <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 7, fontSize: 12 }}>
                  <span style={{ color: 'var(--green)', marginTop: 1, flexShrink: 0 }}>✓</span><span>{f}</span>
                </div>
              ))}
              {plan.missing.map(f => (
                <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 7, fontSize: 12, opacity: 0.4 }}>
                  <span style={{ marginTop: 1, flexShrink: 0 }}>✗</span><span>{f}</span>
                </div>
              ))}
            </div>
            {plan.current
              ? <Button variant="ghost" size="sm" style={{ width: '100%', justifyContent: 'center' }} disabled>Current plan</Button>
              : <Button variant="primary" size="sm" style={{ width: '100%', justifyContent: 'center' }}>{plan.price < 39 ? 'Downgrade' : 'Upgrade'} →</Button>
            }
          </Card>
        ))}
      </div>
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 3 }}>Billing details</div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Next payment of <strong>$39</strong> on July 5, 2026 · Visa ending 4242</div>
          </div>
          <Button variant="ghost" size="sm">Manage payment</Button>
        </div>
        <div style={{ borderTop: '1px solid var(--border)', marginTop: 14, paddingTop: 14, display: 'flex', gap: 8 }}>
          <Badge variant="info">7-day free trial for new users</Badge>
          <Badge variant="neutral">20% off with annual billing</Badge>
        </div>
      </Card>
    </div>
  );
}
