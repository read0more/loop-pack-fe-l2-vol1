import { Suspense } from "react";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { createLoader, type SearchParams } from "nuqs/server";
import { CommerceHeader } from "@/components/commerce/CommerceHeader";
import { ProductListContent } from "@/components/commerce/ProductListContent";
import {
  productListParsers,
  resolveProductListQuery,
} from "@/hooks/productListSearchParams";
import { getQueryClient } from "@/lib/queryClient";
import { productQueries } from "@/queries/products";
import styles from "@/components/commerce/commerce.module.css";

// useQueryStates은 훅이므로 nuqs/server의 createLoader를 사용하여 search params를 파싱한다.
// https://nuqs.dev/docs/server-side
const loadProductListParams = createLoader(productListParsers);

export default async function ProductListPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const query = resolveProductListQuery(
    await loadProductListParams(searchParams),
  );

  // 요청마다 새 QueryClient 로, 클라와 "같은" 쿼리 팩토리를 prefetch 한다 → 같은 queryKey 로 캐시가 채워진다.
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(productQueries.list(query));

  return (
    <main className={styles.page}>
      <CommerceHeader />
      <section className={styles.section}>
        <h1 className={styles.sectionTitle}>상품 목록</h1>
        {/* dehydrate 로 서버 캐시를 클라에 넘긴다 → ProductListContent 의 useQuery 가 mount 시 재요청 없이 hit */}
        <HydrationBoundary state={dehydrate(queryClient)}>
          {/* nuqs(useSearchParams)에서 생기는 CSR bailout 격리
              https://nextjs.org/docs/messages/missing-suspense-with-csr-bailout */}
          <Suspense
            fallback={<p className={styles.status}>상품 목록을 불러오는 중…</p>}
          >
            <ProductListContent />
          </Suspense>
        </HydrationBoundary>
      </section>
    </main>
  );
}
