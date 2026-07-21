"use client";

import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { productQueries } from "@/queries/products";
import { useProductListSearchParams } from "@/hooks/useProductListSearchParams";
import { ProductListResult } from "./ProductListResult";
import styles from "./commerce.module.css";

export function ProductList() {
  const { query, setPage, clampPageToRange } = useProductListSearchParams();
  const queryClient = useQueryClient();

  const { data, isPending, isPlaceholderData } = useQuery(
    productQueries.list(query),
  );

  const totalPages = data ? Math.ceil(data.totalCount / data.pageSize) : 0;
  const isOverRange = totalPages >= 1 && query.page > totalPages;
  const hasNextPage = query.page < totalPages;

  useEffect(() => {
    clampPageToRange(totalPages);
  }, [totalPages, clampPageToRange]);

  // 다음 페이지 선제 prefetch — "다음" 클릭 시 캐시 hit 으로 즉시 표시(keepPreviousData 와 결합).
  // isPlaceholderData(이전 조건 데이터로 그리는 과도기) 중엔 하지 않는다: 이전 totalPages 기준으로
  // 엉뚱한 페이지를 미리 받는 것을 막는다.
  useEffect(() => {
    if (isPlaceholderData || !data || !hasNextPage) return;

    queryClient.prefetchQuery(
      productQueries.list({ ...query, page: query.page + 1 }),
    );
  }, [queryClient, query, data, hasNextPage, isPlaceholderData]);

  return (
    <>
      {/* keepPreviousData 라 페이지 전환 중엔 isPending 이 false 다 → 첫 로드에만 로딩을 띄운다.
          isOverRange 면 곧 교정되니 빈 화면 대신 로딩을 유지한다. */}
      {(isPending || isOverRange) && (
        <p className={styles.status}>상품 목록을 불러오는 중…</p>
      )}
      {data && !isOverRange && (
        // 전환 중(isPlaceholderData)엔 이전 목록을 흐리게 유지해 "갱신 중"을 표시(언마운트 금지)
        <div className={isPlaceholderData ? styles.updating : undefined}>
          <ProductListResult result={data} onPageChange={setPage} />
        </div>
      )}
    </>
  );
}
