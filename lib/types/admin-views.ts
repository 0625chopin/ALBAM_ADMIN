// 관리자 목록/상세 화면용 파생 뷰 타입
// 목록 테이블 행·상세 컴포지트 등 화면 표시 전용 형태를 고정한다.
// Mock 데이터와 실 Supabase 조회(A5)가 동일 계약을 공유(UI 무수정 전환 목표).

import type { Penalty } from "@0625chopin/shared/types";
import type { TransactionStatus } from "@0625chopin/shared/types";
import type { UserSuspension, AdminActionLog } from "./admin";

/**
 * 회원 관리 목록 행 (FA020)
 * - Profile + 관리자 정렬/필터에 필요한 파생(정지·패널티·신고·가입일)
 */
export interface AdminMemberRow {
  /** 회원 식별자 (profiles.id) */
  id: string;
  /** 닉네임 */
  nickname: string;
  /** 직거래 지역 */
  region: string;
  /** 판매자 레벨 */
  sellerLevel: number;
  /** 구매자 레벨 */
  buyerLevel: number;
  /** 현재 활성 정지 여부 */
  isSuspended: boolean;
  /** 최근 30일 누적 패널티 수 (등록 제한 임계 대비) */
  recentPenaltyCount: number;
  /** 피신고 누적 수 (신고 2차, MVP는 0 가능) */
  reportedCount: number;
  /** 가입 시각 (ISO 8601) */
  joinedAt: string;
}

/**
 * 회원 상세 (FA021) — 목록 행 + 평판/이력 종합
 */
export interface AdminMemberDetail extends AdminMemberRow {
  /** 아바타 URL */
  avatarUrl: string | null;
  /** 판매자 역할 평균 별점(0~10) */
  sellerAvgScore: number;
  /** 구매자 역할 평균 별점(0~10) */
  buyerAvgScore: number;
  /** 판매 완료 거래 수 */
  completedSalesCount: number;
  /** 구매 완료 거래 수 */
  completedPurchasesCount: number;
  /** 정지 이력 (최신순) */
  suspensions: UserSuspension[];
  /** 패널티 이력 (최신순) */
  penalties: Penalty[];
  /** 이 회원 대상 관리자 조치 이력 (최신순) */
  actionLogs: AdminActionLog[];
}

/**
 * 거래 관리 목록 행 (FA040)
 * - Transaction + 당사자 닉네임·상품 제목 파생
 */
export interface AdminTransactionRow {
  /** 거래 식별자 */
  id: string;
  /** 대상 상품 (products.id) */
  productId: string;
  /** 상품 제목 */
  productTitle: string;
  /** 판매자 (profiles.id) */
  sellerId: string;
  /** 판매자 닉네임 */
  sellerNickname: string;
  /** 구매자 (profiles.id) */
  buyerId: string;
  /** 구매자 닉네임 */
  buyerNickname: string;
  /** 확정 거래가 */
  finalPrice: number;
  /** 거래 상태 */
  status: TransactionStatus;
  /** 거래 생성 시각 (ISO 8601, 낙찰 성립 시점) */
  createdAt: string;
}
