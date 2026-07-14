import Link from "next/link";
import { ProductGrid } from "./ProductGrid";
import type { HomeResponse, Product } from "@/types/commerce";
import styles from "./commerce.module.css";

function ProductSection({
  title,
  products,
}: {
  title: string;
  products: Product[];
}) {
  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      {products.length === 0 ? (
        <p className={styles.status}>표시할 상품이 없습니다.</p>
      ) : (
        <ProductGrid products={products} />
      )}
    </section>
  );
}

export function HomeContent({ home }: { home: HomeResponse }) {
  return (
    <>
      <section className={styles.hero}>
        <p>{home.banner.description}</p>
        <h1>{home.banner.title}</h1>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>카테고리</h2>
        <div className={styles.categories}>
          {home.categories.map((category) => (
            <Link
              key={category.id}
              href={`/products?category=${category.id}`}
              className={styles.categoryChip}
            >
              {category.name}
            </Link>
          ))}
        </div>
      </section>

      <ProductSection title="인기 상품" products={home.popularProducts} />
      <ProductSection title="신상품" products={home.newProducts} />
    </>
  );
}
