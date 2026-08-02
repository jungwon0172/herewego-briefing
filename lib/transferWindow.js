// 5대 리그(EPL·라리가·분데스리가·세리에A·리그1) 기준 고정 이적시장 기간
// 리그마다 마감일이 며칠씩 다르지만(보통 9/1~9/2, 1/31~2/3 사이),
// 가장 늦게 닫히는 리그 기준으로 넉넉하게 잡아서 어느 리그든 놓치지 않게 함
// 여름: 6/10 ~ 9/2, 겨울: 1/1 ~ 2/3
// month는 0-indexed (JS Date 기준)
const WINDOWS = [
  { name: '겨울', startMonth: 0, startDay: 1, endMonth: 1, endDay: 3 },
  { name: '여름', startMonth: 5, startDay: 10, endMonth: 8, endDay: 2 },
];

function toDay(month, day, year) {
  return new Date(year, month, day).getTime();
}

export function getWindowStatus(now = new Date()) {
  const year = now.getFullYear();
  const t = now.getTime();

  for (const w of WINDOWS) {
    const start = toDay(w.startMonth, w.startDay, year);
    const end = toDay(w.endMonth, w.endDay, year);
    if (t >= start && t <= end) {
      return { open: true, name: w.name, closesAt: end };
    }
  }

  // 닫혀있으면 다음으로 열리는 창 찾기
  const candidates = [];
  for (const y of [year, year + 1]) {
    for (const w of WINDOWS) {
      const start = toDay(w.startMonth, w.startDay, y);
      if (start > t) candidates.push({ name: w.name, opensAt: start });
    }
  }
  candidates.sort((a, b) => a.opensAt - b.opensAt);
  const next = candidates[0];

  return { open: false, nextName: next?.name, opensAt: next?.opensAt };
}
