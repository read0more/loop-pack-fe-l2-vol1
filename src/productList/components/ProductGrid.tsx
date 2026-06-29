import type { Product, ViewMode } from "../types";
import ProductCard from "./ProductCard";

/** 상품 목록을 그리드/리스트 형태로 렌더하고, 비어 있으면 안내 문구를 보여준다. */
export default function ProductGrid({
  products,
  viewMode,
  searchQuery,
  isWished,
  onToggleWishlist,
  onProductClick,
}: {
  products: Product[];
  viewMode: ViewMode;
  searchQuery: string;
  isWished: (productId: number) => boolean;
  onToggleWishlist: (productId: number) => void;
  onProductClick: (productId: number) => void;
}) {
  return (
    <section
      className="product-grid"
      style={viewMode === "list" ? { gridTemplateColumns: "1fr" } : undefined}
    >
      {products.length === 0 ? (
        <div className="empty">조건에 맞는 상품이 없습니다.</div>
      ) : (
        products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            searchQuery={searchQuery}
            isWished={isWished(product.id)}
            onToggleWishlist={onToggleWishlist}
            onClick={onProductClick}
          />
        ))
      )}
    </section>
  );
}
