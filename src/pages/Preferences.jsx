import React, { useState } from 'react';
import { Card, Toggle, Button, SectionHeader, Badge } from '../components/ui';

const WORK_TYPES = ['Full-time', 'Part-time', 'Contract', 'Remote'];

export default function Preferences() {
  const [prefs, setPrefs] = useState({
    jobTitle: 'Software Engineer',
    location: 'San Francisco, CA',
    minSalary: '120000',
    workType: 'Full-time',
  });
  const [settings, setSettings] = useState({
    autoApply: true, emailNotifs: true, dailySummary: true, paused: false,
  });
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  const inputStyle = { width: '100%', padding: '8px 10px', border: '1px solid var(--border-strong)', borderRadius: 'var(--radius-sm)', fontSize: 13, fontFamily: 'var(--font-sans)', color: 'var(--text-primary)', background: 'var(--surface)', outline: 'none' };
  const labelStyle = { fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-secondary)', marginBottom: 6, display: 'block' };

  return (
    <div>
      <SectionHeader
        title="Preferences"
        sub="ApplyBot uses these to find and apply to matching jobs"
        action={<Button variant="primary" size="sm" onClick={handleSave}>{saved ? '✓ Saved' : 'Save changes'}</Button>}
      />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Card>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 16 }}>Job targeting</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={labelStyle}>Job title</label>
              <input style={inputStyle} value={prefs.jobTitle} onChange={e => setPrefs(p => ({ ...p, jobTitle: e.target.value }))} placeholder="e.g. Software Engineer" />
            </div>
            <div>
              <label style={labelStyle}>Location</label>
              <input style={inputStyle} value={prefs.location} onChange={e => setPrefs(p => ({ ...p, location: e.target.value }))} placeholder="e.g. San Francisco, CA" />
            </div>
            <div>
              <label style={labelStyle}>Minimum salary (USD/year)</label>
              <input style={inputStyle} type="number" value={prefs.minSalary} onChange={e => setPrefs(p => ({ ...p, minSalary: e.target.value }))} placeholder="e.g. 120000" />
            </div>
            <div>
              <label style={labelStyle}>Job type</label>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {WORK_TYPES.map(wt => (
                  <button key={wt} onClick={() => setPrefs(p => ({ ...p, workType: wt }))} style={{ padding: '5px 12px', borderRadius: 99, fontSize: 12, cursor: 'pointer', fontFamily: 'var(--font-sans)', background: prefs.workType === wt ? 'var(--blue)' : 'var(--surface-2)', color: prefs.workType === wt ? '#fff' : 'var(--text-secondary)', border: `1px solid ${prefs.workType === wt ? 'var(--blue)' : 'var(--border)'}`, fontWeight: prefs.workType === wt ? 500 : 400 }}>{wt}</button>
                ))}
              </div>
            </div>
          </div>
        </Card>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Card>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Automation</div>
            <div style={{ marginTop: 4 }}>
              <Toggle label="Auto-apply" sub="Submit without confirmation" checked={settings.autoApply} onChange={e => setSettings(s => ({ ...s, autoApply: e.target.checked }))} />
              <Toggle label="Email notifications" sub="Alert on each result" checked={settings.emailNotifs} onChange={e => setSettings(s => ({ ...s, emailNotifs: e.target.checked }))} />
              <Toggle label="Daily summary" sub="End-of-day recap email" checked={settings.dailySummary} onChange={e => setSettings(s => ({ ...s, dailySummary: e.target.checked }))} />
              <Toggle label="Pause automation" sub="Temporarily stop applying" checked={settings.paused} onChange={e => setSettings(s => ({ ...s, paused: e.target.checked }))} />
            </div>
          </Card>
          <Card>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>Active platforms</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>LinkedIn</div>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Easy Apply automation</div>
                </div>
                <Badge variant="success">Active</Badge>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', opacity: 0.55 }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>Indeed</div>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Coming in Phase 2</div>
                </div>
                <Badge variant="neutral">Soon</Badge>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
