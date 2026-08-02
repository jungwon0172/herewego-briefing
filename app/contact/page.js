import SiteFooter from '../../components/SiteFooter';

export const metadata = { title: '문의 · 히얼위고 브리핑' };

export default function ContactPage() {
  return (
    <div className="shell">
      <h1 className="title" style={{ fontSize: 28 }}>문의</h1>
      <div className="static-body">
        <p>오탈자 제보, 정정 요청, 제휴 문의는 아래 이메일로 연락해 주세요.</p>
        <p style={{ marginTop: 12 }}>
          <b>이메일: yjw2172@naver.com</b>
        </p>
      </div>
      <SiteFooter />
    </div>
  );
}
