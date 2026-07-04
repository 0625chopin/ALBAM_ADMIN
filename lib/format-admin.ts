// 관리자 콘솔용 표시 포맷 유틸 (순수 함수)
// 공유 lib/format(@0625chopin/shared/format)의 formatPrice/formatScore/levelLabel 등은 재사용하고,
// 관리자 화면에 필요한 집계·시각 포맷만 본 파일에 추가한다. Mock/실데이터 공통.

/** 큰 수를 천단위 콤마로 (예: 1234 → "1,234") */
export function formatCount(value: number): string {
  return new Intl.NumberFormat("ko-KR").format(value);
}

/** 비율(0~1)을 백분율 문자열로 (예: 0.824 → "82.4%") */
export function formatPercent(ratio: number, digits = 1): string {
  return `${(ratio * 100).toFixed(digits)}%`;
}

/** ISO 시각을 "YYYY-MM-DD HH:MM" 로 (감사 로그/이력 표시) */
export function formatDateTime(iso: string): string {
  const d = new Date(iso);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const mi = String(d.getMinutes()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd} ${hh}:${mi}`;
}

/** ISO 시각을 "YYYY-MM-DD" 로 */
export function formatDate(iso: string): string {
  return formatDateTime(iso).slice(0, 10);
}

/** "MM-DD" 짧은 날짜 (추이 차트 축 라벨) */
export function formatShortDate(iso: string): string {
  return formatDate(iso).slice(5);
}

/**
 * 남은 시간 (미래 시각까지, 예: "12분 남음", "1시간 20분 남음", "3일 남음").
 * 이미 지난 시각은 "마감". 운영 위젯(마감임박 경매·자동완료 대기)의 meta 표시용.
 */
export function formatTimeUntil(iso: string, now: Date = new Date()): string {
  const diffMs = new Date(iso).getTime() - now.getTime();
  if (diffMs <= 0) return "마감";
  const totalMin = Math.floor(diffMs / 60000);
  if (totalMin < 60) return `${totalMin}분 남음`;
  const hours = Math.floor(totalMin / 60);
  if (hours < 24) {
    const min = totalMin % 60;
    return min > 0 ? `${hours}시간 ${min}분 남음` : `${hours}시간 남음`;
  }
  const days = Math.floor(hours / 24);
  return `${days}일 남음`;
}

/**
 * 상대 시각 (예: "방금", "5분 전", "3시간 전", "2일 전").
 * 미래 시각은 "곧". 7일 초과는 절대 날짜(YYYY-MM-DD).
 */
export function formatRelativeTime(iso: string, now: Date = new Date()): string {
  const diffMs = now.getTime() - new Date(iso).getTime();
  if (diffMs < 0) return "곧";
  const min = Math.floor(diffMs / 60000);
  if (min < 1) return "방금";
  if (min < 60) return `${min}분 전`;
  const hours = Math.floor(min / 60);
  if (hours < 24) return `${hours}시간 전`;
  const days = Math.floor(hours / 24);
  if (days <= 7) return `${days}일 전`;
  return formatDate(iso);
}
