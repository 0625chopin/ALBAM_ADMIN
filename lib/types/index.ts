// 관리자 콘솔 타입 barrel (단일 진입점)
// 컴포넌트/페이지에서는 `import type { AdminUser, Product } from "@/lib/types"` 형태로 일괄 import.
// 공유 도메인 타입(@0625chopin/shared/types)과 관리자 전용 타입(lib/types/admin*)을 함께 재노출한다.
// Mock 데이터와 실제 DB 데이터가 공유하는 단일 타입 계약의 진입점이다.

// 공유 도메인 타입 (공개 앱과 공유)
export type {
  SelectOption,
  CodeGroupKey,
  PolicyKey,
  PolicyMap,
  Profile,
  ProductStatus,
  Product,
  ProductImage,
  SellerReputation,
  AuctionSummary,
  AuctionDetail,
  BidStatus,
  Bid,
  TransactionStatus,
  Transaction,
  RatingRole,
  Rating,
  ChatRoom,
  Message,
  Penalty,
} from "@0625chopin/shared/types";

// 관리자 핵심 엔티티 (admin_users/admin_action_logs/user_suspensions/reports)
export type {
  AdminUser,
  AdminTargetType,
  AdminActionType,
  AdminActionLog,
  UserSuspension,
  ReportTargetType,
  ReportStatus,
  Report,
} from "./admin";

// 대시보드 파생 (KPI/추이/시스템 상태)
export type {
  DashboardKpi,
  TrendMetric,
  TrendPoint,
  CategoryDistribution,
  CronJobStatus,
  SystemStatus,
} from "./admin-dashboard";

// 모니터링/블라인드 확장 (상품/메시지/평점)
export type {
  AdminProductRow,
  AdminMessageView,
  AdminRatingView,
  BlindTargetType,
} from "./admin-moderation";
