// 운영 설정 Mock 데이터 (FA060/FA061) `2차`
// 공통코드(code_groups/codes) + 정책 수치(codes.policy, 범위 검증). 실 전환은 A5(TA056).

/** 공통코드 그룹 (카테고리/지역/등급/진행시간 등) */
export interface MockCodeGroup {
  /** 그룹 키 (code_groups.key) */
  key: string;
  /** 그룹 표시명 */
  label: string;
  /** 하위 코드 옵션 (codes) */
  codes: { code: string; label: string }[];
}

/** 정책 수치 (codes.policy) — 범위 검증 대상 */
export interface MockPolicy {
  /** 정책 키 */
  key: string;
  /** 표시명 */
  label: string;
  /** 현재 값 */
  value: number;
  /** 허용 최소 */
  min: number;
  /** 허용 최대 */
  max: number;
  /** 단위 표시 */
  unit: string;
  /** 근거(ISSUE) */
  note?: string;
}

export const MOCK_CODE_GROUPS: MockCodeGroup[] = [
  {
    key: "category",
    label: "카테고리",
    codes: [
      { code: "digital", label: "디지털/가전" },
      { code: "fashion", label: "패션/의류" },
      { code: "furniture", label: "가구/인테리어" },
      { code: "sports", label: "스포츠/레저" },
      { code: "hobby", label: "취미/게임" },
      { code: "etc", label: "기타" },
    ],
  },
  {
    key: "region",
    label: "직거래 지역",
    codes: [
      { code: "seoul", label: "서울" },
      { code: "gyeonggi", label: "경기" },
      { code: "busan", label: "부산" },
      { code: "daegu", label: "대구" },
      { code: "incheon", label: "인천" },
    ],
  },
  {
    key: "auction_duration",
    label: "경매 진행 시간",
    codes: [
      { code: "h24", label: "24시간" },
      { code: "h48", label: "48시간" },
      { code: "h72", label: "72시간" },
      { code: "d7", label: "7일" },
    ],
  },
];

export const MOCK_POLICIES: MockPolicy[] = [
  {
    key: "auto_complete_wait_hours",
    label: "거래 자동완료 대기",
    value: 24,
    min: 24,
    max: 168,
    unit: "시간",
    note: "ISSUE-002 · 24~168h 클램프",
  },
  {
    key: "penalty_threshold_count",
    label: "패널티 등록차단 임계",
    value: 3,
    min: 1,
    max: 10,
    unit: "회",
    note: "ISSUE-004 · 30일 누적 3회",
  },
  {
    key: "penalty_window_days",
    label: "패널티 누적 기간",
    value: 30,
    min: 7,
    max: 90,
    unit: "일",
  },
  {
    key: "min_bid_increment_rate",
    label: "최소 입찰 증가폭",
    value: 5,
    min: 1,
    max: 50,
    unit: "%",
  },
];
