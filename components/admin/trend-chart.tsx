"use client";

// 추이 차트 (FA011, 클라이언트 컴포넌트 — recharts)
// 여러 지표 시리즈를 겹쳐 그리고 기간 토글(7/14일)을 내장. shared/ui/chart 프리미티브 소비.

import { useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@0625chopin/shared/ui/card";
import { Button } from "@0625chopin/shared/ui/button";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@0625chopin/shared/ui/chart";
import { cn } from "@0625chopin/shared/utils";
import type { TrendPoint } from "@/lib/types";
import { formatShortDate } from "@/lib/format-admin";

export interface TrendSeries {
  /** 시리즈 키 (dataKey) */
  key: string;
  /** 범례/툴팁 라벨 */
  label: string;
  /** 라인/영역 색상 (CSS 색상 또는 var) */
  color: string;
  /** 일별 포인트 */
  points: TrendPoint[];
}

export interface TrendChartProps {
  title: string;
  series: TrendSeries[];
  /** 기간 토글 옵션(일). 기본 [7, 14] */
  periods?: number[];
}

export function TrendChart({
  title,
  series,
  periods = [7, 14],
}: TrendChartProps) {
  const [period, setPeriod] = useState(periods[periods.length - 1]);

  // 시리즈들을 date 기준으로 병합 → recharts 데이터 행 [{date, key1, key2, ...}]
  const data = useMemo(() => {
    const byDate = new Map<string, Record<string, number | string>>();
    for (const s of series) {
      for (const p of s.points.slice(-period)) {
        const row = byDate.get(p.date) ?? { date: p.date };
        row[s.key] = p.value;
        byDate.set(p.date, row);
      }
    }
    return Array.from(byDate.values()).sort((a, b) =>
      String(a.date).localeCompare(String(b.date))
    );
  }, [series, period]);

  const config: ChartConfig = useMemo(
    () =>
      Object.fromEntries(
        series.map((s) => [s.key, { label: s.label, color: s.color }])
      ),
    [series]
  );

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
        <CardTitle className="text-foreground text-sm font-semibold">
          {title}
        </CardTitle>
        <div className="flex gap-1">
          {periods.map((d) => (
            <Button
              key={d}
              size="sm"
              variant={d === period ? "secondary" : "ghost"}
              className={cn("h-7 px-2 text-xs", d === period && "font-semibold")}
              onClick={() => setPeriod(d)}
            >
              {d}일
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="h-[240px] w-full">
          <AreaChart data={data} margin={{ left: 4, right: 8, top: 8 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={16}
              tickFormatter={(v: string) => formatShortDate(v)}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(v) => formatShortDate(String(v))}
                />
              }
            />
            <ChartLegend content={<ChartLegendContent />} />
            {series.map((s) => (
              <Area
                key={s.key}
                dataKey={s.key}
                type="monotone"
                stroke={`var(--color-${s.key})`}
                fill={`var(--color-${s.key})`}
                fillOpacity={0.15}
                strokeWidth={2}
                stackId={undefined}
              />
            ))}
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
