// 관리자 Mock 데이터 barrel (단일 진입점)
// 페이지/전시장에서 `import { MOCK_MEMBERS, MOCK_DASHBOARD_KPI } from "@/lib/mocks/admin"` 형태로 소비.
// 모든 Mock은 lib/types 단일 계약을 따르며, 실 Supabase 전환(A5) 시 조회부만 교체한다.

// 회원 (FA020/FA021)
export { MOCK_MEMBERS, getMockMemberDetail } from "./members";

// 상품·경매 (FA030/FA031)
export { MOCK_ADMIN_PRODUCTS, getMockProduct } from "./products";

// 거래 (FA040/FA041)
export {
  MOCK_ADMIN_TRANSACTIONS,
  getMockTransactionDetail,
} from "./transactions";

// 대시보드 집계 (FA010~FA013)
export {
  MOCK_DASHBOARD_KPI,
  MOCK_TREND,
  MOCK_CATEGORY_DIST,
  MOCK_SYSTEM_STATUS,
  MOCK_CLOSING_AUCTIONS,
  MOCK_AUTO_COMPLETE_WAITING,
  MOCK_RECENT_REPORTS,
  MOCK_RECENT_SIGNUPS,
} from "./dashboard";
export type { OpsWidgetItem } from "./dashboard";

// 신고 (FA050~FA052, 2차)
export { MOCK_REPORTS } from "./reports";

// 정지 이력 (FA022)
export { MOCK_SUSPENSIONS, ACTIVE_SUSPENSIONS } from "./suspensions";

// 감사 로그 (FA002)
export { MOCK_ACTION_LOGS } from "./action-logs";

// 관리자 계정 (FA001/FA023)
export { MOCK_ADMIN_USERS } from "./admin-users";

// 운영 설정 (FA060/FA061, 2차)
export { MOCK_CODE_GROUPS, MOCK_POLICIES } from "./settings";
export type { MockCodeGroup, MockPolicy } from "./settings";

// 채팅·평점 모니터링 (FA070/FA080, 3차) — maskPii 는 lib/pii.ts 로 이전
export { MOCK_ADMIN_MESSAGES, MOCK_ADMIN_RATINGS } from "./moderation";
