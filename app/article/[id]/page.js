import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getById } from '../../../lib/kv';
import SiteFooter from '../../../components/SiteFooter';

export const dynamic = 'force-dynamic';

function formatDate(ts) {
  const d = new Date(ts);
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
}

function formatTransferDate(dateStr) {
  const [y, m, d] = dateStr.split('-');
  return `${y}년 ${Number(m)}월 ${Number(d)}일`;
}

export async function generateMetadata({ params }) {
  const item = await getById(params.id);
  if (!item) return { title: '기사를 찾을 수 없음 · 히얼위고 브리핑' };
  return {
    title: `${item.name} ${item.from} → ${item.to} · 히얼위고 브리핑`,
    description: item.message?.slice(0, 100),
  };
}

export default async function ArticlePage({ params }) {
  const item = await getById(params.id);
  if (!item) notFound();

  return (
    <div className="shell">
      <Link href="/" className="back-link">
        ← 브리핑 홈으로
      </Link>

      <article className="article">
        <div className="meta">
          <span className="badge">CONFIRMED</span>
          <span>
            · 이적 확정일:{' '}
            {item.transferDate ? formatTransferDate(item.transferDate) : formatDate(item.publishedAt)}
          </span>
          {item.category && <span>· {item.category}</span>}
        </div>
        <h1 className="article-title">{item.name}</h1>
        <div className="route route-lg">
          <span>{item.from}</span>
          <span>→</span>
          <b>{item.to}</b>
        </div>

        <div className="meter">
          <div className="meter-fill" style={{ width: `${item.pct}%` }} />
        </div>
        <div className="pct-label">Here We Go Meter · {item.pct}%</div>

        {item.message && <p className="article-body">{item.message}</p>}

        {item.transferDate && (
          <p className="source-line">사이트 등록: {formatDate(item.publishedAt)}</p>
        )}

        {item.sourceUrl && (
          <p className="source-line">
            출처:{' '}
            <a href={item.sourceUrl} target="_blank" rel="noreferrer">
              {item.sourceUrl}
            </a>
          </p>
        )}
      </article>

      <SiteFooter />
    </div>
  );
}
