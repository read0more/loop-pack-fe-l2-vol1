import { useState } from "react";
import { isSortBy, isViewMode } from "../constants";
import type { CategoryFilter, ProductFilters, ProductQuery } from "../types";

/**
 * 상품 목록의 필터·검색·정렬·페이지·옵션 클라이언트 상태와 그 변경 핸들러를 관리한다.
 * 서버 조회에 필요한 부분만 추린 `query`(파생값)도 함께 제공한다.
 */
export function useProductFilters() {
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [minPrice, setMinPrice] = useState<number | "">("");
  const [maxPrice, setMaxPrice] = useState<number | "">("");
  const [sortBy, setSortBy] = useState<ProductFilters["sortBy"]>("latest");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [viewMode, setViewMode] = useState<ProductFilters["viewMode"]>("grid");

  const handleCategoryChange = (next: CategoryFilter) => {
    setCategory(next);
    setPage(1);
  };

  const handleMinPriceChange = (value: number | "") => {
    setMinPrice(value);
    setPage(1);
  };

  const handleMaxPriceChange = (value: number | "") => {
    setMaxPrice(value);
    setPage(1);
  };

  const handleSortChange = (value: string) => {
    if (isSortBy(value)) setSortBy(value);
    setPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setPage(1);
  };

  const handleInStockToggle = (next: boolean) => {
    setInStockOnly(next);
    setPage(1);
  };

  const handleViewModeChange = (value: string) => {
    if (isViewMode(value)) setViewMode(value);
  };

  const handlePageChange = (next: number) => {
    setPage(next);
  };

  const handleResetFilters = () => {
    setCategory("all");
    setMinPrice("");
    setMaxPrice("");
    setSortBy("latest");
    setSearchQuery("");
    setInStockOnly(false);
    setPage(1);
  };

  const filters: ProductFilters = {
    category,
    minPrice,
    maxPrice,
    sortBy,
    searchQuery,
    page,
    inStockOnly,
    viewMode,
  };

  // 서버로 보낼 조회 조건 — inStockOnly·viewMode 같은 클라이언트 전용 값은 뺀다.
  const query: ProductQuery = {
    category,
    minPrice,
    maxPrice,
    sortBy,
    searchQuery,
    page,
  };

  return {
    filters,
    query,
    handleCategoryChange,
    handleMinPriceChange,
    handleMaxPriceChange,
    handleSortChange,
    handleSearchChange,
    handleInStockToggle,
    handleViewModeChange,
    handlePageChange,
    handleResetFilters,
  };
}
