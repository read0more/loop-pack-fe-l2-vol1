import { Suspense } from "react";
import { CommerceHeader } from "@/components/commerce/CommerceHeader";
import { ProductListContent } from "@/components/commerce/ProductListContent";
import styles from "@/components/commerce/commerce.module.css";

export default function ProductListPage() {
  return (
    <main className={styles.page}>
      <CommerceHeader />
      <section className={styles.section}>
        <h1 className={styles.sectionTitle}>상품 목록</h1>
        {/* nuqs(useSearchParams)에서 생기는 CSR bailout 격리
            https://nextjs.org/docs/messages/missing-suspense-with-csr-bailout */}
        <Suspense
          fallback={<p className={styles.status}>상품 목록을 불러오는 중…</p>}
        >
          <ProductListContent />
        </Suspense>
      </section>
    </main>
  );
}
