import Link from "next/link";
import { CommerceHeaderCounts } from "./CommerceHeaderCounts";
import styles from "./commerce.module.css";

export function CommerceHeader() {
  return (
    <header className={styles.header}>
      <Link href="/" className={styles.brandLink}>
        Commerce
      </Link>
      <nav className={styles.nav}>
        <Link href="/products">상품</Link>
        <CommerceHeaderCounts />
      </nav>
    </header>
  );
}
