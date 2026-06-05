import React, { useState, useRef } from 'react';
import { Card, Button, SectionHeader, Spinner, ErrorBanner } from '../components/ui';
import { testAIAnswer } from '../api/client';

export default function Resume({ userId }) {
  const fileRef = useRef();
  const [resumeFile, setResumeFile] = useState({ name: 'Alex_Kim_Resume.pdf', size: '84 KB', date: 'Jun 3, 2026' });
  const [profile, setProfile] = useState({ name: 'Alex Kim', phone: '+1 (415) 555-0142', linkedinUrl: 'linkedin.com/in/alexkim', portfolioUrl: 'alexkim.dev' });
  const [saved, setSaved] = useState(false);
  const [testQuestion, setTestQuestion] = useState('');
  const [testAnswer, setTestAnswer] = useState('');
  const [testLoading, setTestLoading] = useState(false);
  const [testError, setTestError] = useState(null);

  function handleFileDrop(e) {
    e.preventDefault();
    const file = e.dataTransfer?.files?.[0] || e.target?.files?.[0];
    if (file) setResumeFile({ name: file.name, size: `${Math.round(file.size / 1024)} KB`, date: 'Just now' });
  }

  async function handleTestAI() {
    if (!testQuestion.trim()) return;
    setTestLoading(true);
    setTestError(null);
    setTestAnswer('');
    try {
      const res = await testAIAnswer({ question: testQuestion, jobTitle: 'Software Engineer', companyName: 'Sample Company', resumePath: '/path/to/resume.pdf', userPrefs: { targetRole: 'Software Engineer', location: 'San Francisco' } });
      setTestAnswer(res.answer);
    } catch (err) {
      setTestError(err.message);
    } finally {
      setTestLoading(false);
    }
  }

  const inputStyle = { width: '100%', padding: '8px 10px', border: '1px solid var(--border-strong)', borderRadius: 'var(--radius-sm)', fontSize: 13, fontFamily: 'var(--font-sans)', color: 'var(--text-primary)', background: 'var(--surface)', outline: 'none' };
  const labelStyle = { fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-secondary)', marginBottom: 6, display: 'block' };

  return (
    <div>
      <SectionHeader title="Resume & profile" sub="The AI uses these to personalize every application answer" action={<Button variant="primary" size="sm" onClick={() => setSaved(true)}>{saved ? '✓ Saved' : 'Save profile'}</Button>} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <Card>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 14 }}>Resume</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, background: 'var(--surface-2)', borderRadius: 'var(--radius-md)', marginBottom: 12 }}>
            <div style={{ fontSize: 28 }}>📄</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 500 }}>{resumeFile.name}</div>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Uploaded {resumeFile.date} · {resumeFile.size}</div>
            </div>
          </div>
          <div onClick={() => fileRef.current?.click()} onDragOver={e => e.preventDefault()} onDrop={handleFileDrop}
            style={{ border: '1.5px dashed var(--border-strong)', borderRadius: 'var(--radius-md)', padding: '20px', textAlign: 'center', cursor: 'pointer' }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--blue)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-strong)'}>
            <div style={{ fontSize: 20, marginBottom: 6 }}>⬆</div>
            <div style={{ fontSize: 13, fontWeight: 500 }}>Drop new resume here</div>
            <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 3 }}>PDF or DOCX · max 5 MB</div>
            <input ref={fileRef} type="file" accept=".pdf,.docx" style={{ display: 'none' }} onChange={handleFileDrop} />
          </div>
        </Card>
        <Card>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 14 }}>Profile details</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { key: 'name',        label: 'Full name',    placeholder: 'Your full name'           },
              { key: 'phone',       label: 'Phone',        placeholder: '+1 (555) 000-0000'        },
              { key: 'linkedinUrl', label: 'LinkedIn URL', placeholder: 'linkedin.com/in/yourname' },
              { key: 'portfolioUrl',label: 'Portfolio',    placeholder: 'yoursite.com'             },
            ].map(({ key, label, placeholder }) => (
              <div key={key}>
                <label style={labelStyle}>{label}</label>
                <input style={inputStyle} value={profile[key]} placeholder={placeholder} onChange={e => setProfile(p => ({ ...p, [key]: e.target.value }))} />
              </div>
            ))}
          </div>
        </Card>
      </div>
      <Card>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>AI answer tester</div>
        <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 14 }}>Preview how the AI answers a custom question using your resume.</div>
        {testError && <ErrorBanner message={`Backend error: ${testError} — is the engine running on localhost:3000?`} />}
        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          <input style={{ ...inputStyle, flex: 1 }} placeholder='e.g. "Why do you want to work at our company?"' value={testQuestion} onChange={e => setTestQuestion(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleTestAI()} />
          <Button variant="primary" size="sm" onClick={handleTestAI} loading={testLoading} disabled={!testQuestion.trim()}>Generate</Button>
        </div>
        {testLoading && <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 0', color: 'var(--text-secondary)', fontSize: 13 }}><Spinner size={14} /> Asking the AI…</div>}
        {testAnswer && (
          <div style={{ background: 'var(--surface-2)', borderRadius: 'var(--radius-md)', padding: '14px 16px', fontSize: 13, lineHeight: 1.65, borderLeft: '3px solid var(--blue)' }}>
            <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--blue)', fontWeight: 600, marginBottom: 8 }}>AI-generated answer</div>
            {testAnswer}
          </div>
        )}
        {!testAnswer && !testLoading && <div style={{ fontSize: 12, color: 'var(--text-tertiary)', fontStyle: 'italic' }}>Type a question above and click Generate to preview.</div>}
      </Card>
    </div>
  );
}
