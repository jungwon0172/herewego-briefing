import Link from 'next/link';

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-links">
        <Link href="/about">소개</Link>
        <Link href="/privacy">개인정보처리방침</Link>
        <Link href="/contact">문의</Link>
      </div>
      <p className="footer-note">히얼위고 브리핑 · 팬이 운영하는 이적시장 브리핑입니다.</p>
    </footer>
  );
}
