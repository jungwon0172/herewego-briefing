import { NextResponse } from 'next/server';
import { approve, reject } from '../../../../lib/kv';

function checkAdmin(req) {
  const auth = req.headers.get('authorization') || '';
  return !!process.env.ADMIN_SECRET && auth === `Bearer ${process.env.ADMIN_SECRET}`;
}

// PATCH /api/news/:id  { action: "approve" | "reject", edits?: {...} }
export async function PATCH(req, { params }) {
  if (!checkAdmin(req)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  const { id } = params;
  const body = await req.json().catch(() => ({}));

  if (body.action === 'approve') {
    const updated = await approve(id, body.edits || {});
    if (!updated) return NextResponse.json({ error: 'not found' }, { status: 404 });
    return NextResponse.json({ item: updated });
  }
  if (body.action === 'reject') {
    await reject(id);
    return NextResponse.json({ ok: true });
  }
  return NextResponse.json({ error: 'invalid action' }, { status: 400 });
}
