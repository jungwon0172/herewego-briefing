# 히얼위고 브리핑 (신문형)

유럽 5대 리그(EPL·라리가·분데스리가·세리에A·리그1) 이적시장 기간에 발행되는
히얼위고 브리핑 신문. 기사는 삭제하지 않고 전부 아카이브로 영구 보관합니다.
이적시장 오픈/마감은 5대 리그 중 가장 늦게 닫히는 리그 기준으로 넉넉하게 잡아
자동 계산됩니다 (여름 6/10~9/2, 겨울 1/1~2/3 — `lib/transferWindow.js`에서 수정 가능).

## 구조

- `/` — 신문 홈. 이적시장 오픈/마감 배너 + 전체 아카이브 목록
- `/article/[id]` — 기사 개별 페이지 (고유 URL, 검색엔진 색인 대상)
- `/about`, `/privacy`, `/contact` — AdSense 심사에 필요한 필수 페이지
- `/admin` — 검수 대시보드. 자동 수집된 초안을 확인하고 승인/거절
- `/api/news` — GET(전체 아카이브) / POST(수집기가 초안 등록, `COLLECTOR_SECRET` 필요)
- `/api/news/[id]` — PATCH(승인/거절, `ADMIN_SECRET` 필요)
- `/api/drafts` — 검수 대기 목록 조회 (`ADMIN_SECRET` 필요)

## 배포 순서

1. Vercel에 새 프로젝트로 이 저장소를 연결
2. Vercel 대시보드 > Storage에서 **KV** 데이터베이스 생성 → 프로젝트에 연결 (환경변수 자동 주입)
3. 프로젝트 Environment Variables에 아래 값 직접 추가
   - `COLLECTOR_SECRET` — 아무 임의의 긴 문자열
   - `ADMIN_SECRET` — `/admin` 로그인 비밀번호로 쓸 값
4. `app/contact/page.js`의 이메일 주소를 실제 연락 가능한 주소로 교체
5. 배포

## 소식 등록 흐름 (자동 수집 + 검수 후 게시)

1. 예약 작업이 주기적으로 최신 이적 뉴스를 검색
2. 새 소식을 찾으면 `/api/news`에 POST해서 draft로 등록

   ```bash
   curl -X POST https://<your-domain>/api/news \
     -H "Authorization: Bearer $COLLECTOR_SECRET" \
     -H "Content-Type: application/json" \
     -d '{
       "name": "선수명",
       "from": "이전 소속",
       "to": "이적할 곳",
       "message": "브리핑 내용 (가능하면 코멘트/분석 한두 줄 추가)",
       "pct": 90,
       "category": "이적",
       "sourceUrl": "출처 링크"
     }'
   ```

3. `/admin`에서 로그인 후 초안을 확인·수정하고 **승인** → `/article/{id}`에 영구 게시됨
4. 삭제되지 않고 홈 아카이브 목록에 계속 남음

### AdSense 신청 전 체크리스트

- [ ] 기사가 최소 20~30건 이상 쌓였는지
- [ ] 각 기사에 단순 정보 나열이 아니라 코멘트/분석이 한두 줄이라도 들어갔는지
- [ ] `/about`, `/privacy`, `/contact`의 문구·이메일이 실제 정보로 채워졌는지
- [ ] 이적시장 휴장 기간에도 아카이브가 정상적으로 보이는지
