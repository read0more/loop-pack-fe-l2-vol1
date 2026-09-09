"use client";

import { useIsWishlisted, useToggleWishlist } from "@/entities/wishlist";
import { OVERSIZED_CATALOG } from "../model/oversizedCatalog";

export function WishlistButton({ productId }: { productId: string }) {
  const isInWishlist = useIsWishlisted(productId);
  const toggleWishlist = useToggleWishlist();
  // 3단계 자가 검증용. 예산을 넘기려고 넣었고, Turbopack 이 tree-shake 하지 않게
  // 배열을 런타임에 실제로 훑는다. 머지하지 않는다.
  const catalogMatches = OVERSIZED_CATALOG.filter((entry) =>
    entry.startsWith(productId),
  ).length;

  return (
    <button
      type="button"
      aria-pressed={isInWishlist}
      aria-label="위시리스트"
      data-catalog-matches={catalogMatches}
      onClick={() => toggleWishlist(productId)}
    >
      {isInWishlist ? "♥" : "♡"}
    </button>
  );
}
