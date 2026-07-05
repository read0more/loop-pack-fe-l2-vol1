import { useEffect } from "react";
import type { ProductFilters } from "../types";
import { buildFilterSearch } from "../utils";

/**
 * 현재 필터/검색/페이지 상태를 브라우저 URL 쿼리에 비춘다(mirror, 외부 시스템 동기화).
 * replaceState 로 제자리 갱신만 한다 — 히스토리 적립(네비게이션)은 페이지 이동 핸들러 담당.
 */
export function useSyncFiltersToUrl(filters: ProductFilters) {
  const {
    category,
    searchQuery,
    page,
    sortBy,
    minPrice,
    maxPrice,
    inStockOnly,
  } = filters;

  useEffect(() => {
    const nextSearch = buildFilterSearch({
      category,
      searchQuery,
      page,
      sortBy,
      minPrice,
      maxPrice,
      inStockOnly,
    });
    // 바뀔 때만 비춘다. 페이지 이동(pushState)·popstate 복원 직후엔 URL 이 이미 상태와
    // 같으므로 여기서 재기록하지 않는다.
    if (nextSearch === window.location.search.replace(/^\?/, "")) return;
    window.history.replaceState(null, "", `?${nextSearch}`);
  }, [category, searchQuery, page, sortBy, minPrice, maxPrice, inStockOnly]);
}
