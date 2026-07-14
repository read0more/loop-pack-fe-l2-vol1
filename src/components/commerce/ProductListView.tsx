"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PRODUCT_LIST_DEFAULTS } from "@/utils/productList";
import { productQueries } from "@/queries/products";
import { CommerceHeader } from "./CommerceHeader";
import { ProductGrid } from "./ProductGrid";
import { Pagination } from "./Pagination";
import type { ProductListResponse } from "@/types/commerce";
import styles from "./commerce.module.css";

function getErrorMessage(error: unknown): string {
  return error instanceof Error
    ? error.message
    : "상품 목록을 불러오지 못했습니다.";
}

function ProductListResult({
  result,
  onPageChange,
}: {
  result: ProductListResponse;
  onPageChange: (page: number) => void;
}) {
  if (result.totalCount === 0) {
    return <p className={styles.status}>검색 결과가 없습니다.</p>;
  }

  const totalPages = Math.ceil(result.totalCount / result.pageSize);

  return (
    <div>
      <p className={styles.resultCount}>총 {result.totalCount}개</p>
      {result.products.length === 0 ? (
        <p className={styles.status}>이 페이지에는 상품이 없습니다.</p>
      ) : (
        <ProductGrid products={result.products} />
      )}
      <Pagination
        page={result.page}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
}

export function ProductListView() {
  const [page, setPage] = useState<number>(PRODUCT_LIST_DEFAULTS.page);
  const { q, category, sort } = PRODUCT_LIST_DEFAULTS;

  const { data, isPending, isError, error } = useQuery(
    productQueries.list({ q, category, sort, page }),
  );

  return (
    <main className={styles.page}>
      <CommerceHeader />
      <section className={styles.section} aria-label="상품 검색 결과">
        <h1 className={styles.sectionTitle}>상품 목록</h1>
        {isPending && <p className={styles.status}>상품 목록을 불러오는 중…</p>}
        {isError && (
          <p className={`${styles.status} ${styles.error}`}>
            {getErrorMessage(error)}
          </p>
        )}
        {data && <ProductListResult result={data} onPageChange={setPage} />}
      </section>
    </main>
  );
}
