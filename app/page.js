import { listPublished } from '../lib/kv';
import { getWindowStatus } from '../lib/transferWindow';
import SiteFooter from '../components/SiteFooter';
import FeedList from '../components/FeedList';

export const dynamic = 'force-dynamic';

function formatCountdown(ts) {
  const days = Math.max(0, Math.ceil((ts - Date.now()) / 86400000));
  return `D-${days}`;
}

export default async function Home() {
  const items = await listPublished();
  const win = getWindowStatus();

  return (
    <div className="shell">
      <header className="masthead">
        <div className="brand">
          <span className="dot" />
          <span className="tag">Est. 2026 · Big 5 Transfer Desk</span>
        </div>
        <h1 className="title">히얼위고 브리핑</h1>
        <p className="desc">
          프리미어리그·라리가·세리에A·분데스리가·리그앙, 5대 리그 이적시장 기간에
          발행되는 히얼위고 브리핑입니다. 지난 기사는 삭제하지 않고 전부 아카이브로 남아
          언제든 다시 볼 수 있어요.
        </p>
      </header>

      {win.open ? (
        <div className="window-banner open">
          <span className="badge">OPEN</span>
          {win.name} 이적시장이 열려있습니다. 새 브리핑이 계속 업데이트됩니다.
        </div>
      ) : (
        <div className="window-banner closed">
          <span className="badge">CLOSED</span>
          지금은 이적시장 휴장 기간이에요. 다음 {win.nextName} 이적시장까지{' '}
          <b>{formatCountdown(win.opensAt)}</b>. 지난 브리핑은 아래 아카이브에서 계속 볼 수 있어요.
        </div>
      )}

      <FeedList items={items} />

      <SiteFooter />
    </div>
  );
}
