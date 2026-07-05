// 관리자 공통 컴포넌트 barrel (순수 props 표현 컴포넌트)
// 페이지/전시장에서 `import { KpiCard, AdminTable } from "@/components/admin"` 형태로 소비.

export { KpiCard } from "./kpi-card";
export type { KpiCardProps } from "./kpi-card";

export { AdminTable } from "./admin-table";
export type { AdminTableColumn, AdminTableProps } from "./admin-table";

export { OpsWidget } from "./ops-widget";
export type { OpsWidgetProps } from "./ops-widget";

export { SystemStatusCard } from "./system-status-card";
export type { SystemStatusCardProps } from "./system-status-card";

export { TrendChart } from "./trend-chart";
export type { TrendChartProps, TrendSeries } from "./trend-chart";

export { AdminActionDialog } from "./admin-action-dialog";
export type { AdminActionDialogProps } from "./admin-action-dialog";

export { ProductIdCell } from "./product-id-cell";

export { ProductInfoCard } from "./product-info-card";
