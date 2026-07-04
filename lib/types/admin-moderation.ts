// 관리자 모니터링용 확장 타입 (블라인드 플래그 + 관리자 목록 파생)
// 공유 도메인 타입(Product/Message/Rating)에 관리자 화면에만 필요한 필드를 얹는다.
// - 블라인드 플래그: 삭제와 구분되는 숨김 상태(감사/복구 목적) — FA031/FA070/FA080, DB는 TA041.
// - 결정(OPEN-2 관련): 블라인드 채택 범위는 A2/A3 진입 시 확정. 타입은 선반영.

import type { Product, Message, Rating } from "@0625chopin/shared/types";

/**
 * 관리자 상품·경매 목록 행 (모니터링/제재 대상)
 * - Product + 블라인드 플래그 + 관리자 정렬용 파생(신고 수) — FA030/FA031
 */
export interface AdminProductRow extends Product {
  /** 블라인드(숨김) 여부. 기본 false (삭제와 구분) */
  isBlinded: boolean;
  /** 누적 신고 수 (신고 많은 상품 우선 정렬용) — 신고 2차, MVP는 0 가능 */
  reportCount: number;
  /** 판매자 닉네임 (목록 표시용 파생) */
  sellerNickname: string;
}

/**
 * 관리자 채팅 메시지 뷰 (신고된 채팅방/메시지 모니터링)
 * - Message + 블라인드 플래그 — FA070 (3차, 열람 정책 OPEN-6)
 */
export interface AdminMessageView extends Message {
  /** 블라인드(숨김) 여부. 기본 false */
  isBlinded: boolean;
}

/**
 * 관리자 평점 뷰 (악성 평점 처리)
 * - Rating + 블라인드 플래그 — FA080 (3차)
 */
export interface AdminRatingView extends Rating {
  /** 블라인드(숨김) 여부. 기본 false (코멘트 블라인드/삭제와 구분) */
  isBlinded: boolean;
}

/**
 * 블라인드 대상 유형 (admin_blind_content RPC 인자)
 * - product: 상품 본문 / message: 채팅 메시지 / rating: 평점 코멘트
 */
export type BlindTargetType = "product" | "message" | "rating";
