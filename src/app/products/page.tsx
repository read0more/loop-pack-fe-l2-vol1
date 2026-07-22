import { Suspense } from "react";
import { type SearchParams } from "nuqs/server";
import { ProductListSection } from "./ProductListSection";
import styles from "@/components/commerce/commerce.module.css";

export default function ProductListPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  return (
    // 이 Suspense 는 두 역할을 겸한다:
    //  (1) 스트리밍 경계 — 목록 prefetch(ProductListSection 의 await)를 여기서 잡아 HTML 껍데기를 먼저 내려준다.
    //  (2) nuqs(useSearchParams)의 CSR bailout 격리
    //      https://nextjs.org/docs/messages/missing-suspense-with-csr-bailout
    <Suspense
      fallback={<p className={styles.status}>상품 목록을 불러오는 중…</p>}
    >
      <ProductListSection searchParams={searchParams} />
    </Suspense>
  );
}
