"use client";

import { useCommerceStore } from "@/stores/commerceStore";
import styles from "./commerce.module.css";

export function CommerceHeaderCounts() {
  const cartCount = useCommerceStore((state) => state.cartIds.size);
  const wishlistCount = useCommerceStore((state) => state.wishlistIds.size);

  return (
    <div className={styles.headerCounts}>
      <span>장바구니 {cartCount}</span>
      <span>위시리스트 {wishlistCount}</span>
    </div>
  );
}
