"use client";

// 상품검색 입력 폼 (클라이언트) — UID 를 입력받아 ?uid= 검색 파라미터로 라우팅한다.
// 실제 조회는 서버 컴포넌트(page.tsx)가 getProductDetail 로 수행하고 같은 화면에 결과를 표시.

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@0625chopin/shared/ui/input";
import { Button } from "@0625chopin/shared/ui/button";

export function ProductSearchForm({ defaultValue }: { defaultValue?: string }) {
  const router = useRouter();
  const [value, setValue] = useState(defaultValue ?? "");

  const submit = () => {
    const uid = value.trim();
    router.push(uid ? `/product-search?uid=${encodeURIComponent(uid)}` : "/product-search");
  };

  return (
    <form
      className="flex flex-wrap items-center gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
    >
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="상품 UID 입력 (예: 목록의 상품 UID 복사)"
        className="max-w-md font-mono"
        aria-label="상품 UID"
      />
      <Button type="submit">검색</Button>
    </form>
  );
}
