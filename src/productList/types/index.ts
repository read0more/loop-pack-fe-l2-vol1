export type Product = {
  id: number;
  name: string;
  category: "electronics" | "fashion" | "home" | "beauty";
  price: number;
  originalPrice?: number;
  stock: number;
  imageUrl: string;
  createdAt: string;
  rating: number;
  reviewCount: number;
};

export type SortBy = "latest" | "popular" | "price-asc" | "price-desc";

export type CategoryFilter = "all" | Product["category"];

export type ViewMode = "grid" | "list";

/** 사용자가 조작하는 전체 필터/검색/페이지/옵션 클라이언트 상태. */
export type ProductFilters = {
  category: CategoryFilter;
  minPrice: number | "";
  maxPrice: number | "";
  sortBy: SortBy;
  searchQuery: string;
  page: number;
  inStockOnly: boolean;
  viewMode: ViewMode;
};

/** useProductFilters reducer 가 관리하는 상태 — URL 로 복원되는 필터 전체(viewMode 제외). */
export type FilterState = Omit<ProductFilters, "viewMode">;

/** 서버로 보내는 조회 조건 — viewMode 같은 순수 표시 옵션은 제외. */
export type ProductQuery = {
  category: CategoryFilter;
  minPrice: number | "";
  maxPrice: number | "";
  sortBy: SortBy;
  searchQuery: string;
  page: number;
  inStockOnly: boolean;
};

/** 상품 카드에 표시할 배지/상태를 한 번에 계산한 뷰모델. */
export type ProductBadges = {
  discountRate: number;
  isNew: boolean;
  isHotDeal: boolean;
  isBest: boolean;
  isSoldOut: boolean;
  isAlmostSoldOut: boolean;
  isFreeShipping: boolean;
};
