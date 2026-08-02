import './globals.css';

export const metadata = {
  title: '히얼위고 브리핑',
  description: '축구 이적시장 실시간 히얼위고 브리핑. 90일 지난 소식은 자동으로 정리됩니다.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
