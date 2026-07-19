"use client";

import { useCommerceStore } from "@/stores/commerceStore";
import styles from "./commerce.module.css";

const PENDING_COUNT = "–";

export function CommerceHeaderCounts() {
  const hasHydrated = useCommerceStore((state) => state.hasHydrated);
  const cartCount = useCommerceStore((state) => state.cartIds.size);
  const wishlistCount = useCommerceStore((state) => state.wishlistIds.size);

  const cart = hasHydrated ? cartCount : PENDING_COUNT;
  const wishlist = hasHydrated ? wishlistCount : PENDING_COUNT;

  return (
    <div className={styles.headerCounts}>
      <span>장바구니 {cart}</span>
      <span>위시리스트 {wishlist}</span>
    </div>
  );
}
