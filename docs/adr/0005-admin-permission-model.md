# ADR-0005 · 관리자 권한 모델 & 3중 가드 계약 (A0)

- **상태**: 채택(Accepted) · 2026-07-04
- **관련 태스크**: TA001(권한 모델·부트스트랩) · TA002(3중 가드 계약) — Phase A0
- **선행/상위**: [`0003-domain-auth-model.md`](./0003-domain-auth-model.md)(admin 자체 로그인), [`../ROADMAP_ADMIN.md`](../ROADMAP_ADMIN.md)
- **후속 구현**: 스키마=TA040(A4) · 미들웨어 실게이팅=TA057(A5) · admin RPC=TA052~TA058(A5)

> 본 ADR은 **개념·계약·부트스트랩 설계**를 확정한다(코드/마이그레이션 아님, Mock First 순서 유지).
> 실제 스키마·RLS·RPC·미들웨어 연결은 각 후속 태스크에서 수행하되 **본 계약을 준수**한다.

---

## 1. 사용자 확정 결정 (2026-07-04)

로드맵 OPEN 항목 중 A0/A1을 게이트하는 4건을 확정한다(나머지 OPEN-2/6은 A2·A3 진입 시 확정).

| OPEN   | 결정                                       | 근거/영향                                                              |
| ------ | ------------------------------------------ | --------------------------------------------------------------------- |
| OPEN-3 | **감사 로그 포함(필수)**                   | `admin_action_logs` 채택. 3중 가드의 ③단계(감사로그 적재) 성립. FA002 |
| OPEN-4 | **별도 `user_suspensions` 테이블**         | 정지 이력을 행 단위 누적(사유·기간·해제 추적). `profiles` 컬럼 방식 불채택 |
| OPEN-1 | **신고 시스템 2차 도입(타입만 선반영)**    | `Report` 타입/스키마는 계약에 정의, UI(FA050)·처리 큐는 2차(TA025/TA056) |
| OPEN-5 | **단일 권한(`role` 컬럼만 확보)**          | MVP는 `admin` 단일. `role` 컬럼은 확장 여지로 유지, 다단계 로직 미구현 |

---

## 2. 관리자 판별 방식 (TA001)

### 2.1 채택 — 별도 `admin_users` 테이블

관리자 판별은 **별도 `admin_users` 테이블 소속 여부**로 한다. `profiles`에 `role`/`is_admin`
컬럼을 **추가하지 않는다**(도메인 회원 테이블과 권한 관심사 분리, 일반 앱 번들에 관리자 신호 노출 방지).

### 2.2 개념 컬럼 (실 스키마는 TA040)

| 컬럼         | 타입          | 설명                                                       |
| ------------ | ------------- | ---------------------------------------------------------- |
| `user_id`    | uuid PK       | → `profiles.id` (auth 사용자 UUID)                         |
| `role`       | text          | 기본 `'admin'`. **단일 권한**(OPEN-5), 다단계 확장 여지 확보 |
| `granted_by` | uuid nullable | → `profiles.id`. 부트스트랩 관리자는 `NULL`                |
| `granted_at` | timestamptz   | 지정 시각(기본 `now()`)                                    |

> camelCase 도메인 타입 매핑은 `AdminUser`(userId/role/grantedBy/grantedAt) — [TA010](#) `lib/types/admin.ts`.

### 2.3 최초 관리자 부트스트랩 절차

1. 대상 계정으로 admin 앱 회원 가입/로그인(동일 Supabase Auth 백엔드, ADR-0003).
2. 그 `profiles.id`(=`auth.uid()`)를 확인.
3. Supabase MCP `execute_sql`로 **직접 INSERT**:
   ```sql
   insert into public.admin_users (user_id, role, granted_by, granted_at)
   values ('<대상 profiles.id>', 'admin', null, now());
   ```
4. 이후 관리자 추가/회수는 FA023(관리자 지정 RPC)으로 관리(부트스트랩 계정만 수동 INSERT).

- **부트스트랩 대상(시나리오)**: 테스트 계정 `0625chopin` 을 최초 관리자로 지정(A4/A6 검증에서 사용).
  `chopin0625` 는 비관리자 대조군으로 유지(가드 E2E TA060에서 차단 확인용).

### 2.4 `createAdminClient()`(service_role) 재사용 범위

- service_role 클라이언트(`@0625chopin/shared/supabase/admin`)는 **RLS 우회 강제/제재 mutation 한정**
  으로만 사용한다(계정 정지/패널티/강제 조치/신고 처리 등 admin RPC 경유).
- **서버 전용**: Route Handler / Server Action / RPC 호출 컨텍스트에서만. **클라이언트 번들 노출 절대 금지**
  (환경변수 `SUPABASE_SERVICE_ROLE_KEY` 는 admin 앱 서버 런타임에만, ADR-0003/TS18).

---

## 3. 3중 가드 계약 (TA002)

접근 통제를 **미들웨어 · RLS · RPC** 3계층으로 중첩한다. 어느 한 층이 뚫려도 다음 층이 방어한다.

### 3.1 ① 미들웨어 가드 (루트 `proxy.ts`, 실연결 TA057)

- 판정: **세션 유무** + **`admin_users` 소속 여부**.
- 비인증 → `/login` 리다이렉트(현재 골격 구현됨). 세션 있으나 비관리자 → 거부/로그아웃(TA057).
- **세션 버그 방지(CLAUDE.md 필수)**: `createServerClient`~`getClaims()` 사이 코드 삽입 금지,
  `getClaims()` 제거 금지, `supabaseResponse` 그대로 반환(새 응답 시 쿠키 복사). 위반 시 무작위 로그아웃.
- 현재 `lib/supabase/proxy.ts` 의 `TODO(TA057)` 지점에 `admin_users` 조회 판정을 얹는다.

### 3.2 ② RLS 정책 (실구현 TA042)

- SQL 헬퍼 `is_admin()`: `(select auth.uid()) in (select user_id from public.admin_users)`.
  `security definer` + `search_path = ''` 하드닝.
- 관리자 전용 테이블(`admin_users`/`admin_action_logs`/`user_suspensions`, 2차 `reports`)은
  **관리자만 조회/수정**. 단 `reports`는 예외적으로 **신고자 본인 insert 허용**(FA050, 2차).
- 일반 `authenticated` 롤에 관리자 테이블 가시성 **0**(누출 없음) — TA061에서 검증.

### 3.3 ③ RPC 권한 검증 & 원자 트랜잭션 (실구현 TA052~TA058)

모든 admin RPC는 아래 3단계를 **단일 트랜잭션**으로 수행한다(위반 시 예외 → 전체 롤백):

```
① 권한 검증   : 호출자 auth.uid() 가 admin_users 에 있는지 확인. 없으면 raise exception.
② 상태 전이   : 도메인 변경(정지/패널티/강제취소/블라인드/신고처리 등).
③ 감사 로그   : admin_action_logs 에 (admin_id, action_type, target_type, target_id, reason, meta) 적재.
```

- **감사 로그는 필수**(OPEN-3 확정): 조치와 로그가 하나의 트랜잭션 → "조치했는데 로그 없음" 불가능.
- `reason`(사유)은 **필수 입력**(UI `AdminActionDialog` 사유 검증, TA031). 책임성 추적(누가·언제·무엇을·왜).
- service_role 필요 mutation은 서버 전용 `createAdminClient` 경유(§2.4).

### 3.4 라우트 게이트 모델

- 공개 앱의 로그인 게이트(`app/my-products/page.tsx` 패턴) 위에 **관리자 게이트**를 얹는다.
- admin 앱은 `/login` 외 **전 경로가 보호 대상**(운영자 콘솔). 레이아웃(`app/(console)/layout.tsx`) 하위 전체.
- Mock 단계(A1~A3)는 **임시 통과 플래그**로 게이트를 열어두고 화면을 개발, 실게이팅은 TA057에서 연결.

---

## 4. 검증 대응(완료 기준)

- ✅ 관리자 판별 = 별도 `admin_users` 소속(§2.1), 개념 컬럼·부트스트랩 절차 확정(§2.2~2.3).
- ✅ service_role 범위 = 강제/제재 mutation 한정·서버 전용(§2.4).
- ✅ 3중 가드 계약: 미들웨어(§3.1)·RLS+`is_admin()`(§3.2)·RPC 원자 트랜잭션(§3.3).
- ✅ 사유 필수 + 감사 로그 필수(OPEN-3)로 책임성 추적 성립(§3.3).
- ✅ OPEN-3/4/1/5 결정 반영(§1) → TA010 타입 계약·TA040 스키마의 상위 근거.
