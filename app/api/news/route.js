import { NextResponse } from 'next/server';
import { addDraft, listPublished } from '../../../lib/kv';

// GET /api/news -> 공개 피드 (published만, 이미 90일 지난 건 cron이 실제 삭제함)
export async function GET() {
  const items = await listPublished();
  return NextResponse.json({ items });
}

// POST /api/news -> 수집 파이프라인(Claude 예약 작업)이 새 뉴스 초안을 등록
// Authorization: Bearer <COLLECTOR_SECRET> 헤더 필요
export async function POST(req) {
  const auth = req.headers.get('authorization') || '';
  const expected = `Bearer ${process.env.COLLECTOR_SECRET}`;
  if (!process.env.COLLECTOR_SECRET || auth !== expected) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  const body = await req.json();
  if (!body?.name) {
    return NextResponse.json({ error: 'name is required' }, { status: 400 });
  }
  const record = await addDraft(body);
  return NextResponse.json({ item: record }, { status: 201 });
}
