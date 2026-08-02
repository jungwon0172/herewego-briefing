import { NextResponse } from 'next/server';
import { listDrafts } from '../../../lib/kv';

export async function GET(req) {
  const auth = req.headers.get('authorization') || '';
  if (!process.env.ADMIN_SECRET || auth !== `Bearer ${process.env.ADMIN_SECRET}`) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  const items = await listDrafts();
  return NextResponse.json({ items });
}
