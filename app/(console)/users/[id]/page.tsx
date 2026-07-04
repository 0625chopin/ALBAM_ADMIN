import { Suspense } from "react";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@0625chopin/shared/ui/card";
import { Badge } from "@0625chopin/shared/ui/badge";
import { Button } from "@0625chopin/shared/ui/button";
import { LevelBadge } from "@0625chopin/shared/common/level-badge";
import { StarRating } from "@0625chopin/shared/common/star-rating";
import { AdminActionDialog } from "@/components/admin";
import { PagePlaceholder } from "@/components/console/page-placeholder";
import { getMemberDetail } from "@/lib/queries/members";
import {
  suspendUserAction,
  liftSuspensionAction,
  grantPenaltyAction,
  revokePenaltyAction,
} from "./_actions";
import { formatDate, formatDateTime, formatCount } from "@/lib/format-admin";
import {
  ADMIN_ACTION_LABEL,
  PENALTY_REASON_LABEL,
  labelOf,
} from "@/lib/labels-admin";
import type { AdminMemberDetail } from "@/lib/types";

// 회원 상세·이력 (FA021) + 조치 버튼 UI(인터랙션은 A3/TA031). Mock.
// cacheComponents: 동적 params 는 Suspense 안 async 자식에서 await (ISSUE-011).

function ActionButtons({ member }: { member: AdminMemberDetail }) {
  return (
    <div className="flex flex-wrap gap-2">
      {member.isSuspended ? (
        <AdminActionDialog
          trigger={<Button variant="outline">정지 해제</Button>}
          title="정지 해제"
          description="회원의 로그인·거래 제한을 해제합니다."
          actionLabel="해제"
          summary={`대상: ${member.nickname} (${member.id}) · 정지 → 정상`}
          onConfirm={liftSuspensionAction.bind(null, member.id)}
        />
      ) : (
        <AdminActionDialog
          trigger={<Button variant="destructive">계정 정지</Button>}
          title="계정 정지"
          description="영구 정지 처리합니다. 로그인·거래가 제한됩니다."
          actionLabel="정지"
          destructive
          summary={`대상: ${member.nickname} (${member.id}) · 정상 → 정지(영구)`}
          onConfirm={suspendUserAction.bind(null, member.id)}
        />
      )}
      <AdminActionDialog
        trigger={<Button variant="outline">패널티 부여</Button>}
        title="패널티 부여"
        description="30일 내 3회 누적 시 상품 등록이 제한됩니다 (ISSUE-004)."
        actionLabel="부여"
        summary={`현재 최근 30일 패널티: ${formatCount(member.recentPenaltyCount)}회`}
        onConfirm={grantPenaltyAction.bind(null, member.id)}
      />
      <AdminActionDialog
        trigger={<Button variant="ghost">관리자 지정</Button>}
        title="관리자 지정"
        description="이 회원을 관리자(admin_users)로 지정합니다."
        actionLabel="지정"
        tier={2}
      />
      <AdminActionDialog
        trigger={<Button variant="ghost">닉네임 강제 변경</Button>}
        title="닉네임 강제 변경"
        description="부적절한 닉네임을 강제로 변경합니다."
        actionLabel="변경"
        tier={2}
      />
    </div>
  );
}

async function UserDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const member = await getMemberDetail(id);

  if (!member) {
    return (
      <div className="p-6">
        <Card className="mx-auto max-w-md">
          <CardHeader>
            <CardTitle>회원을 찾을 수 없습니다</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground space-y-3 text-sm">
            <p>ID “{id}” 에 해당하는 회원이 없습니다.</p>
            <Button asChild variant="outline" size="sm">
              <Link href="/users">회원 목록으로</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-foreground text-xl font-bold">
              {member.nickname}
            </h1>
            {member.isSuspended ? (
              <Badge variant="destructive">정지</Badge>
            ) : (
              <Badge variant="secondary">정상</Badge>
            )}
          </div>
          <p className="text-muted-foreground text-sm">
            {member.id} · {member.region} · 가입 {formatDate(member.joinedAt)}
          </p>
        </div>
        <ActionButtons member={member} />
      </header>

      {/* 평판·거래 요약 */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground text-sm">
              판매자
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <LevelBadge level={member.sellerLevel} role="seller" />
            <StarRating score={member.sellerAvgScore} max={10} />
            <p className="text-muted-foreground text-xs">
              판매 완료 {formatCount(member.completedSalesCount)}건
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground text-sm">
              구매자
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <LevelBadge level={member.buyerLevel} role="buyer" />
            <StarRating score={member.buyerAvgScore} max={10} />
            <p className="text-muted-foreground text-xs">
              구매 완료 {formatCount(member.completedPurchasesCount)}건
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground text-sm">
              최근 30일 패널티
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${member.recentPenaltyCount >= 3 ? "text-destructive" : "text-foreground"}`}
            >
              {formatCount(member.recentPenaltyCount)}
            </div>
            <p className="text-muted-foreground text-xs">3회 누적 시 등록 제한</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground text-sm">
              피신고 누적
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-foreground text-2xl font-bold">
              {formatCount(member.reportedCount)}
            </div>
            <p className="text-muted-foreground text-xs">누적 신고 건수</p>
          </CardContent>
        </Card>
      </section>

      {/* 정지 이력 */}
      <HistoryCard title="정지 이력" empty="정지 이력 없음" count={member.suspensions.length}>
        {member.suspensions.map((s) => (
          <li key={s.id} className="py-2 text-sm">
            <div className="flex items-center justify-between gap-2">
              <span className="text-foreground">{s.reason}</span>
              <Badge variant={s.liftedAt ? "outline" : "destructive"}>
                {s.liftedAt ? "해제됨" : s.endsAt ? "정지중" : "영구정지"}
              </Badge>
            </div>
            <p className="text-muted-foreground text-xs">
              {formatDate(s.startsAt)} ~ {s.endsAt ? formatDate(s.endsAt) : "무기한"}
            </p>
          </li>
        ))}
      </HistoryCard>

      {/* 패널티 이력 */}
      <HistoryCard title="패널티 이력" empty="패널티 이력 없음" count={member.penalties.length}>
        {member.penalties.map((p) => (
          <li
            key={p.id}
            className="flex items-center justify-between gap-2 py-2 text-sm"
          >
            <span className="text-foreground">
              {labelOf(PENALTY_REASON_LABEL, p.reason)}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground text-xs">
                {formatDate(p.createdAt)}
              </span>
              <AdminActionDialog
                trigger={
                  <Button variant="ghost" size="sm">
                    회수
                  </Button>
                }
                title="패널티 회수"
                description="부여된 패널티를 삭제합니다. 누적 집계에서 제외됩니다."
                actionLabel="회수"
                summary={`대상: ${member.nickname} · ${labelOf(PENALTY_REASON_LABEL, p.reason)} (${formatDate(p.createdAt)})`}
                onConfirm={revokePenaltyAction.bind(null, p.id, member.id)}
              />
            </div>
          </li>
        ))}
      </HistoryCard>

      {/* 관리자 조치 이력 (감사 로그) */}
      <HistoryCard title="조치 이력" empty="조치 이력 없음" count={member.actionLogs.length}>
        {member.actionLogs.map((log) => (
          <li key={log.id} className="py-2 text-sm">
            <div className="flex items-center justify-between gap-2">
              <span className="text-foreground font-medium">
                {ADMIN_ACTION_LABEL[log.actionType]}
              </span>
              <span className="text-muted-foreground text-xs">
                {formatDateTime(log.createdAt)}
              </span>
            </div>
            <p className="text-muted-foreground text-xs">{log.reason}</p>
          </li>
        ))}
      </HistoryCard>
    </div>
  );
}

function HistoryCard({
  title,
  empty,
  count,
  children,
}: {
  title: string;
  empty: string;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-foreground text-sm font-semibold">
          {title} <span className="text-muted-foreground">({count})</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {count === 0 ? (
          <p className="text-muted-foreground py-2 text-sm">{empty}</p>
        ) : (
          <ul className="divide-border divide-y">{children}</ul>
        )}
      </CardContent>
    </Card>
  );
}

export default function UserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense
      fallback={
        <PagePlaceholder
          title="회원 상세"
          description="레벨·평점·거래/입찰/패널티/신고 이력 종합 및 조치"
          task="TA022"
        />
      }
    >
      <UserDetail params={params} />
    </Suspense>
  );
}
