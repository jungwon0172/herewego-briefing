import { kv } from '@vercel/kv';

// 데이터 모델
// news:{id}              -> 뉴스(기사) 항목 객체
// news:index:draft        -> draft 상태 id 목록 (검토 대기)
// news:index:published    -> published 상태 id 목록 (영구 아카이브, 신문 기사 취급)

export function makeId() {
  return `n_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export async function addDraft(item) {
  const id = makeId();
  const record = {
    id,
    name: item.name || '',
    from: item.from || '',
    to: item.to || '',
    message: item.message || '',
    pct: item.pct ?? 80,
    category: item.category || '',
    sourceUrl: item.sourceUrl || '',
    transferDate: item.transferDate || null, // 실제 이적 확정 날짜 (YYYY-MM-DD), 사이트 등록일과 별개
    status: 'draft',
    createdAt: Date.now(),
    publishedAt: null,
  };
  await kv.set(`news:${id}`, record);
  await kv.sadd('news:index:draft', id);
  return record;
}

export async function listDrafts() {
  const ids = await kv.smembers('news:index:draft');
  if (!ids?.length) return [];
  const items = await Promise.all(ids.map((id) => kv.get(`news:${id}`)));
  return items.filter(Boolean).sort((a, b) => b.createdAt - a.createdAt);
}

// 영구 아카이브: 삭제하지 않고 최신순으로 전부 반환
export async function listPublished() {
  const ids = await kv.smembers('news:index:published');
  if (!ids?.length) return [];
  const items = await Promise.all(ids.map((id) => kv.get(`news:${id}`)));
  return items
    .filter(Boolean)
    .filter((i) => i.status === 'published')
    .sort((a, b) => b.publishedAt - a.publishedAt);
}

export async function getById(id) {
  const record = await kv.get(`news:${id}`);
  if (!record || record.status !== 'published') return null;
  return record;
}

export async function approve(id, edits = {}) {
  const record = await kv.get(`news:${id}`);
  if (!record) return null;
  const updated = {
    ...record,
    ...edits,
    status: 'published',
    publishedAt: Date.now(),
  };
  await kv.set(`news:${id}`, updated);
  await kv.srem('news:index:draft', id);
  await kv.sadd('news:index:published', id);
  return updated;
}

export async function reject(id) {
  await kv.del(`news:${id}`);
  await kv.srem('news:index:draft', id);
  return true;
}
