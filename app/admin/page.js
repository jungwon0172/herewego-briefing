'use client';

import { useEffect, useState } from 'react';

export default function AdminPage() {
  const [secret, setSecret] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [drafts, setDrafts] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const saved = sessionStorage.getItem('hwg_admin_secret');
    if (saved) {
      setSecret(saved);
      setUnlocked(true);
    }
  }, []);

  useEffect(() => {
    if (unlocked) loadDrafts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unlocked]);

  async function loadDrafts() {
    setError('');
    const res = await fetch('/api/drafts', {
      headers: { Authorization: `Bearer ${secret}` },
    });
    if (res.status === 401) {
      setError('비밀번호가 올바르지 않아요.');
      setUnlocked(false);
      sessionStorage.removeItem('hwg_admin_secret');
      return;
    }
    const data = await res.json();
    setDrafts(data.items || []);
  }

  function unlock() {
    sessionStorage.setItem('hwg_admin_secret', secret);
    setUnlocked(true);
  }

  async function act(id, action, edits) {
    const res = await fetch(`/api/news/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${secret}`,
      },
      body: JSON.stringify({ action, edits }),
    });
    if (res.ok) {
      setDrafts((prev) => prev.filter((d) => d.id !== id));
    } else {
      setError('처리 중 문제가 발생했어요.');
    }
  }

  if (!unlocked) {
    return (
      <div className="shell">
        <div className="gate">
          <h1 className="title" style={{ fontSize: 22 }}>
            관리자 검수
          </h1>
          <input
            type="password"
            placeholder="관리자 비밀번호"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && unlock()}
          />
          <button onClick={unlock}>입장</button>
          {error && <p style={{ color: '#C8102E', fontSize: 13 }}>{error}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="admin-shell">
      <div className="brand">
        <span className="dot" />
        <span className="tag">Review Queue</span>
      </div>
      <h1 className="title">검토 대기 소식 ({drafts.length})</h1>
      <p className="desc">
        자동 수집된 초안입니다. 확인 후 승인하면 공개 피드에 즉시 올라갑니다.
      </p>

      {drafts.length === 0 && <div className="empty">검토할 초안이 없습니다.</div>}

      {drafts.map((d) => (
        <DraftEditor key={d.id} draft={d} onApprove={(edits) => act(d.id, 'approve', edits)} onReject={() => act(d.id, 'reject')} />
      ))}
    </div>
  );
}

function DraftEditor({ draft, onApprove, onReject }) {
  const [name, setName] = useState(draft.name);
  const [from, setFrom] = useState(draft.from);
  const [to, setTo] = useState(draft.to);
  const [message, setMessage] = useState(draft.message);
  const [pct, setPct] = useState(draft.pct);
  const [category, setCategory] = useState(draft.category || '프리미어리그');
  const [transferDate, setTransferDate] = useState(
    draft.transferDate || new Date().toISOString().slice(0, 10)
  );

  return (
    <div className="draft-item">
      <div className="row">
        <div style={{ flex: 1 }}>
          <span className="field-label">리그</span>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="프리미어리그">프리미어리그</option>
            <option value="라리가">라리가</option>
            <option value="세리에A">세리에A</option>
            <option value="분데스리가">분데스리가</option>
            <option value="리그앙">리그앙</option>
          </select>
        </div>
        <div style={{ flex: 1 }}>
          <span className="field-label">이적 확정일</span>
          <input type="date" value={transferDate} onChange={(e) => setTransferDate(e.target.value)} />
        </div>
      </div>
      <span className="field-label" style={{ display: 'block', marginTop: 12 }}>
        이름 / 문구
      </span>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <div className="row">
        <div style={{ flex: 1 }}>
          <span className="field-label">FROM</span>
          <input value={from} onChange={(e) => setFrom(e.target.value)} />
        </div>
        <div style={{ flex: 1 }}>
          <span className="field-label">TO</span>
          <input value={to} onChange={(e) => setTo(e.target.value)} />
        </div>
      </div>
      <span className="field-label" style={{ display: 'block', marginTop: 12 }}>
        메시지
      </span>
      <textarea rows={3} value={message} onChange={(e) => setMessage(e.target.value)} />
      <span className="field-label" style={{ display: 'block', marginTop: 12 }}>
        Here We Go Meter: {pct}%
      </span>
      <input type="range" min="0" max="100" value={pct} onChange={(e) => setPct(Number(e.target.value))} />
      {draft.sourceUrl && (
        <p style={{ fontSize: 12, marginTop: 10, color: 'var(--cream-dim)' }}>
          출처: <a href={draft.sourceUrl} target="_blank" rel="noreferrer">{draft.sourceUrl}</a>
        </p>
      )}
      <div className="row">
        <button
          className="btn btn-approve"
          onClick={() => onApprove({ name, from, to, message, pct, category, transferDate })}
        >
          승인 후 게시
        </button>
        <button className="btn btn-reject" onClick={onReject}>
          거절
        </button>
      </div>
    </div>
  );
}
