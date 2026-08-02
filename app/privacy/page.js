import SiteFooter from '../../components/SiteFooter';

export const metadata = { title: '개인정보처리방침 · 히얼위고 브리핑' };

export default function PrivacyPage() {
  return (
    <div className="shell">
      <h1 className="title" style={{ fontSize: 28 }}>개인정보처리방침</h1>
      <div className="static-body">
        <p>
          본 사이트는 별도의 회원가입이나 로그인 기능 없이 운영되며, 방문자로부터
          이름, 이메일 등 개인정보를 직접 수집하지 않습니다.
        </p>
        <p>
          본 사이트는 Google 애드센스를 포함한 제3자 광고 서비스를 이용할 수 있으며,
          Google을 비롯한 제3자 공급업체는 쿠키를 사용하여 사용자의 이전 방문 기록을
          기반으로 광고를 게재할 수 있습니다. 사용자는{' '}
          <a href="https://adssettings.google.com" target="_blank" rel="noreferrer">
            Google 광고 설정
          </a>
          에서 맞춤 광고 게재를 원하지 않도록 설정할 수 있습니다.
        </p>
        <p>본 방침은 사전 고지 없이 변경될 수 있습니다.</p>
      </div>
      <SiteFooter />
    </div>
  );
}
