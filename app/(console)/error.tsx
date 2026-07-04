"use client";

// 콘솔 공통 Error 상태 (라우트 렌더 오류 경계). shared ErrorState 재사용.
// Next 규약: error.tsx 는 client component, { error, reset } 수신.

import { useEffect } from "react";
import { ErrorState } from "@0625chopin/shared/common/error-state";

export default function ConsoleError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // 실서비스에서는 로깅 서비스로 전송. Mock 단계는 콘솔 기록.
    console.error("[console error]", error);
  }, [error]);

  return (
    <div className="p-6">
      <ErrorState
        title="화면을 불러오지 못했습니다"
        description="일시적인 오류일 수 있습니다. 다시 시도해 주세요."
        onRetry={reset}
      />
    </div>
  );
}
