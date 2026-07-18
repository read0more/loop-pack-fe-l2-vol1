"use client";

import { useCallback } from "react";
import {
  useQueryStates,
  parseAsInteger,
  parseAsString,
  parseAsStringLiteral,
} from "nuqs";
import { PRODUCT_LIST_DEFAULTS } from "@/utils/productList";
import {
  CATEGORY_VALUES,
  SORT_VALUES,
} from "@/components/commerce/productListOptions";
import type { ProductListParams } from "@/queries/products";
import type { CategoryId, ProductSort } from "@/types/commerce";

const FIRST_PAGE = 1;
const PUSH_TO_HISTORY = { history: "push" } as const;

const productListParsers = {
  q: parseAsString.withDefault(PRODUCT_LIST_DEFAULTS.q),
  category: parseAsStringLiteral(CATEGORY_VALUES).withDefault(
    PRODUCT_LIST_DEFAULTS.category,
  ),
  sort: parseAsStringLiteral(SORT_VALUES).withDefault(
    PRODUCT_LIST_DEFAULTS.sort,
  ),
  page: parseAsInteger.withDefault(PRODUCT_LIST_DEFAULTS.page),
};

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

  const query: ProductListParams = {
    q: queryState.q,
    category: queryState.category,
    sort: queryState.sort,
    page: Math.max(FIRST_PAGE, queryState.page),
  };

  // 사용자 네비가 아닌 교정이라 replace 로 덮어 뒤로가기가 무효 page 로 돌아가지 않게 한다.
  const clampPageToRange = useCallback(
    (totalPages: number) => {
      const lowerBounded = Math.max(FIRST_PAGE, queryState.page);
      const clamped =
        totalPages >= FIRST_PAGE
          ? Math.min(lowerBounded, totalPages)
          : lowerBounded;

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
