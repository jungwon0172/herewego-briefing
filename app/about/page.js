import SiteFooter from '../../components/SiteFooter';

export const metadata = { title: '소개 · 히얼위고 브리핑' };

export default function AboutPage() {
  return (
    <div className="shell">
      <h1 className="title" style={{ fontSize: 28 }}>소개</h1>
      <div className="static-body">
        <p>
          히얼위고 브리핑은 EPL·라리가·분데스리가·세리에A·리그1, 유럽 5대 리그의 이적시장
          소식을 정리해서 전달하는 팬 운영 브리핑입니다. 여름·겨울 이적시장 기간에 맞춰
          새 소식을 등록하고, 지난 기사는 삭제하지 않고 아카이브로 계속 보관합니다.
        </p>
        <p>
          모든 기사는 공개 전 운영자가 직접 확인 후 게시하며, 출처가 있는 경우 기사 하단에
          함께 표기합니다.
        </p>
      </div>
      <SiteFooter />
    </div>
  );
}
