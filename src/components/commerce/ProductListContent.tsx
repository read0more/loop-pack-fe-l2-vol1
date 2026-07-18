"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { productQueries } from "@/queries/products";
import { useProductListSearchParams } from "@/hooks/useProductListSearchParams";
import { getErrorMessage } from "@/utils";
import { ProductListFilters } from "./ProductListFilters";
import { ProductListResult } from "./ProductListResult";
import styles from "./commerce.module.css";

export function ProductListContent() {
  const { query, setFilter, setPage, clampPageToRange } =
    useProductListSearchParams();

  const { data, isPending, isError, error } = useQuery(
    productQueries.list(query),
  );

  const totalPages = data ? Math.ceil(data.totalCount / data.pageSize) : 0;
  const isOverRange = totalPages >= 1 && query.page > totalPages;

  useEffect(() => {
    clampPageToRange(totalPages);
  }, [totalPages, clampPageToRange]);

  return (
    <>
      <ProductListFilters
        q={query.q}
        category={query.category}
        sort={query.sort}
        onSearch={(q) => setFilter({ q })}
        onCategoryChange={(category) => setFilter({ category })}
        onSortChange={(sort) => setFilter({ sort })}
      />
      {/* isOverRange 면 곧 교정되니 "이 페이지에 상품 없음" 대신 로딩을 유지해 빈 화면 깜빡임을 막는다 */}
      {(isPending || isOverRange) && (
        <p className={styles.status}>상품 목록을 불러오는 중…</p>
      )}
      {isError && (
        <p className={`${styles.status} ${styles.error}`}>
          {getErrorMessage(error, "상품 목록을 불러오지 못했습니다.")}
        </p>
      )}
      {data && !isOverRange && (
        <ProductListResult result={data} onPageChange={setPage} />
      )}
    </>
  );
}
