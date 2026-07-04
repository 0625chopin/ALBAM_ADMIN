// 관리자 화면 공용 한글 라벨 맵 (코드값 → 표시 라벨)
// Mock/실데이터 공통. 실 전환 시에도 코드값 계약이 동일하므로 그대로 재사용.
// 상태 배지(ProductStatus/TransactionStatus)는 shared/common/status-badge 가 담당.

import type {
  AdminActionType,
  ReportStatus,
  ReportTargetType,
  ProductStatus,
  TransactionStatus,
} from "@/lib/types";

/** 경매 상품 상태 라벨 (StatusBadge label 주입용) */
export const PRODUCT_STATUS_LABEL: Record<ProductStatus, string> = {
  active: "경매중",
  won: "낙찰",
  failed: "유찰",
  withdrawn: "내림",
  completed: "완료",
};

/** 거래 상태 라벨 (StatusBadge label 주입용) */
export const TRANSACTION_STATUS_LABEL: Record<TransactionStatus, string> = {
  pending: "진행중",
  completed: "거래완료",
  auto_completed: "자동완료",
  canceled: "취소",
};

/** 상품 상태(컨디션) 라벨 */
export const CONDITION_LABEL: Record<string, string> = {
  new: "새 상품",
  used_best: "거의 새것",
  used_good: "상태 좋음",
  used_fair: "사용감 있음",
  used_poor: "하자 있음",
};

/** 상품 카테고리 라벨 */
export const CATEGORY_LABEL: Record<string, string> = {
  digital: "디지털/가전",
  appliance: "가전",
  fashion: "패션/의류",
  furniture: "가구/인테리어",
  sports: "스포츠/레저",
  hobby: "취미/게임",
  beauty: "뷰티/미용",
  etc: "기타",
};

/** 관리자 조치 유형 라벨 (감사 로그 표시) — FA002 */
export const ADMIN_ACTION_LABEL: Record<AdminActionType, string> = {
  suspend_user: "계정 정지",
  lift_suspension: "정지 해제",
  grant_penalty: "패널티 부여",
  revoke_penalty: "패널티 해제",
  force_withdraw_product: "상품 강제 내림",
  blind_content: "콘텐츠 블라인드",
  force_close_auction: "경매 강제 종료",
  force_cancel_transaction: "거래 강제 취소",
  force_complete_transaction: "거래 강제 완료",
  resolve_report: "신고 처리",
  update_policy: "정책 변경",
  grant_admin: "관리자 지정",
  revoke_admin: "관리자 회수",
  force_change_nickname: "닉네임 강제 변경",
};

/** 패널티 사유 코드 라벨 (ISSUE-004) */
export const PENALTY_REASON_LABEL: Record<string, string> = {
  abandon_won: "낙찰 포기",
  withdraw_with_bids: "입찰 중 상품 내림",
  no_show: "약속 불이행",
};

/** 신고 사유 코드 라벨 (FA050) */
export const REPORT_REASON_LABEL: Record<string, string> = {
  fake_info: "허위 상품 정보",
  abuse: "욕설·비방",
  no_show: "미거래·약속 불이행",
  malicious: "악의적 행위",
  prohibited: "금지 품목",
};

/** 신고 처리 상태 라벨 */
export const REPORT_STATUS_LABEL: Record<ReportStatus, string> = {
  pending: "대기",
  reviewing: "검토중",
  resolved: "처리완료",
  rejected: "반려",
};

/** 신고 대상 유형 라벨 */
export const REPORT_TARGET_LABEL: Record<ReportTargetType, string> = {
  product: "상품",
  user: "사용자",
  message: "메시지",
  rating: "평점",
};

/** 코드값 라벨 조회 (미정의 시 원본 코드 반환) */
export function labelOf(map: Record<string, string>, code: string): string {
  return map[code] ?? code;
}
