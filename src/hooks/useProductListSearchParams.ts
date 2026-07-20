"use client";

import { useCallback } from "react";
import { useQueryStates } from "nuqs";
import {
  clampPageToLowerBound,
  FIRST_PAGE,
  productListParsers,
  resolveProductListQuery,
} from "./productListSearchParams";
import type { CategoryId, ProductSort } from "@/types/commerce";

const PUSH_TO_HISTORY = { history: "push" } as const;

type ProductListFilter = {
  q?: string;
  category?: CategoryId | "all";
  sort?: ProductSort;
};

/**
 * 목록 조건의 원본은 URL이다. 이 훅이 URL ↔ productList 조건 변환을 전담한다.
 */
export function useProductListSearchParams() {
  const [queryState, setQueryState] = useQueryStates(
    productListParsers,
    PUSH_TO_HISTORY,
  );

  const query = resolveProductListQuery(queryState);

  // URL 의 page 를 유효 범위 [FIRST_PAGE, totalPages] 로 교정한다 — 상한(totalPages)는 사용하는 곳에서 넘긴다.
  // 사용자 네비가 아닌 교정이라 replace 로 덮어 뒤로가기가 무효 page 로 돌아가지 않게 한다.
  const clampPageToRange = useCallback(
    (totalPages: number) => {
      const lowerBounded = clampPageToLowerBound(queryState.page);
      const upperBounded = Math.min(lowerBounded, totalPages);
      const hasPages = totalPages >= FIRST_PAGE;
      const clamped = hasPages ? upperBounded : lowerBounded;

      if (clamped !== queryState.page) {
        setQueryState({ page: clamped }, { history: "replace" });
      }
    },
    [queryState.page, setQueryState],
  );

  return {
    query,
    setFilter: (filter: ProductListFilter) =>
      setQueryState({ ...filter, page: FIRST_PAGE }),
    setPage: (page: number) => setQueryState({ page }),
    clampPageToRange,
  };
}
