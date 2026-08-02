'use client';

import { useState } from 'react';
import Link from 'next/link';

const LEAGUES = ['전체', '프리미어리그', '라리가', '세리에A', '분데스리가', '리그앙'];

// 예전에 다른 표기(EPL, La Liga 등)로 저장된 카테고리를 표준 명칭으로 맞춰줌
const ALIASES = {
  EPL: '프리미어리그',
  'PREMIER LEAGUE': '프리미어리그',
  '프리미어 리그': '프리미어리그',
  'LA LIGA': '라리가',
  LALIGA: '라리가',
  'SERIE A': '세리에A',
  세리에a: '세리에A',
  BUNDESLIGA: '분데스리가',
  'LIGUE 1': '리그앙',
  LIGUE1: '리그앙',
};

function normalizeCategory(category) {
  if (!category) return category;
  const key = category.trim().toUpperCase();
  return ALIASES[key] || category;
}

function formatDate(ts) {
  const d = new Date(ts);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

// transferDate는 "YYYY-MM-DD" 문자열. 있으면 우선 표시, 없으면 등록일(publishedAt) 사용
function displayDate(item) {
  if (item.transferDate) {
    const [y, m, d] = item.transferDate.split('-');
    return `${y}.${m}.${d}`;
  }
  return formatDate(item.publishedAt);
}

// 정렬/그룹핑 기준이 되는 실제 날짜 (transferDate 우선, 없으면 등록일)
function getEffectiveDate(item) {
  if (item.transferDate) return new Date(`${item.transferDate}T00:00:00`);
  return new Date(item.publishedAt);
}

function getMonthKey(item) {
  const d = getEffectiveDate(item);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

function getMonthLabel(key) {
  const [y, m] = key.split('-');
  return `${y}년 ${Number(m)}월`;
}

// 필터된 목록을 실제 날짜 기준 내림차순 정렬 후, 월 단위로 묶기
function groupByMonth(items) {
  const sorted = [...items].sort((a, b) => getEffectiveDate(b) - getEffectiveDate(a));
  const groups = [];
  let currentKey = null;
  let currentGroup = null;
  for (const item of sorted) {
    const key = getMonthKey(item);
    if (key !== currentKey) {
      currentKey = key;
      currentGroup = { key, label: getMonthLabel(key), items: [] };
      groups.push(currentGroup);
    }
    currentGroup.items.push(item);
  }
  return groups;
}

// 전체 아이템에서 존재하는 월 목록을 최신순으로 뽑아냄
function getAvailableMonths(items) {
  const keys = new Set(items.map((i) => getMonthKey(i)));
  return [...keys].sort().reverse();
}
export default function FeedList({ items }) {
  const [filter, setFilter] = useState('전체');
  const [monthFilter, setMonthFilter] = useState('전체');
  const availableMonths = getAvailableMonths(items);

  const leagueFiltered =
    filter === '전체' ? items : items.filter((i) => normalizeCategory(i.category) === filter);
  const filtered =
    monthFilter === '전체'
      ? leagueFiltered
      : leagueFiltered.filter((i) => getMonthKey(i) === monthFilter);
  const monthGroups = groupByMonth(filtered);

  return (
    <>
      <div className="league-tabs">
        {LEAGUES.map((l) => (
          <button
            key={l}
            className={`league-tab ${filter === l ? 'active' : ''}`}
            onClick={() => setFilter(l)}
          >
            {l}
          </button>
        ))}
      </div>

      {availableMonths.length > 0 && (
        <div className="month-tabs">
          <button
            className={`month-tab ${monthFilter === '전체' ? 'active' : ''}`}
            onClick={() => setMonthFilter('전체')}
          >
            전체 기간
          </button>
          {availableMonths.map((key) => (
            <button
              key={key}
              className={`month-tab ${monthFilter === key ? 'active' : ''}`}
              onClick={() => setMonthFilter(key)}
            >
              {getMonthLabel(key)}
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="empty">
          {items.length === 0
            ? '아직 등록된 기사가 없습니다. 이적시장이 열리면 브리핑이 시작돼요.'
            : `${filter} 소식이 아직 없습니다.`}
        </div>
      ) : (
        monthGroups.map((group) => (
          <div key={group.key} className="month-group">
            <h2 className="month-header">{group.label}</h2>
            <div className="feed">
              {group.items.map((item) => (
                <Link href={`/article/${item.id}`} key={item.id} className="card card-link">
                  <div className="meta">
                    <span className="badge">CONFIRMED</span>
                    <span>· {displayDate(item)}</span>
                    {item.category && <span>· {normalizeCategory(item.category)}</span>}
                  </div>
                  <div className="name">{item.name}</div>
                  <div className="route">
                    <span>{item.from}</span>
                    <span>→</span>
                    <b>{item.to}</b>
                  </div>
                  {item.message && (
                    <p className="message">
                      {item.message.length > 90 ? `${item.message.slice(0, 90)}…` : item.message}
                    </p>
                  )}
                  <div className="meter">
                    <div className="meter-fill" style={{ width: `${item.pct}%` }} />
                  </div>
                  <div className="pct-label">Here We Go Meter · {item.pct}%</div>
                </Link>
              ))}
            </div>
          </div>
        ))
      )}
    </>
  );
}
