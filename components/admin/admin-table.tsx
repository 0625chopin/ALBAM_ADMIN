// 관리자 목록 테이블 (제네릭, 순수 props, 서버 컴포넌트)
// shared/ui/table 프리미티브를 조립. 컬럼 정의 + 행 데이터만 받는 표현 컴포넌트.
// 상세 이동 등 링크는 컬럼 render 안에서 <Link> 로 구성(중첩 앵커 회피).

import type { ReactNode } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@0625chopin/shared/ui/table";
import { cn } from "@0625chopin/shared/utils";

export interface AdminTableColumn<T> {
  /** 컬럼 키 (React key + 기본 접근자) */
  key: string;
  /** 헤더 라벨 */
  header: ReactNode;
  /** 셀 렌더러. 생략 시 (row as Record)[key] 표시 */
  render?: (row: T) => ReactNode;
  /** 정렬 */
  align?: "left" | "right" | "center";
  /** 헤더/셀 추가 클래스 */
  className?: string;
}

export interface AdminTableProps<T> {
  columns: AdminTableColumn<T>[];
  rows: T[];
  /** 각 행의 고유 key */
  getRowKey: (row: T) => string;
  /** 행 없을 때 안내 (기본 "데이터가 없습니다") */
  emptyMessage?: string;
}

const ALIGN: Record<NonNullable<AdminTableColumn<unknown>["align"]>, string> = {
  left: "text-left",
  right: "text-right",
  center: "text-center",
};

export function AdminTable<T>({
  columns,
  rows,
  getRowKey,
  emptyMessage = "데이터가 없습니다",
}: AdminTableProps<T>) {
  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            {columns.map((col) => (
              <TableHead
                key={col.key}
                className={cn(
                  "whitespace-nowrap",
                  col.align && ALIGN[col.align],
                  col.className
                )}
              >
                {col.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.length === 0 ? (
            <TableRow className="hover:bg-transparent">
              <TableCell
                colSpan={columns.length}
                className="text-muted-foreground h-24 text-center"
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row) => (
              <TableRow key={getRowKey(row)}>
                {columns.map((col) => (
                  <TableCell
                    key={col.key}
                    className={cn(
                      "whitespace-nowrap",
                      col.align && ALIGN[col.align],
                      col.className
                    )}
                  >
                    {col.render
                      ? col.render(row)
                      : String((row as Record<string, unknown>)[col.key] ?? "")}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
