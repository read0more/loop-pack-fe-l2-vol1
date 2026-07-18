"use client";

import type { SyntheticEvent } from "react";
import type { CategoryId, ProductSort } from "@/types/commerce";
import {
  CATEGORY_LABELS,
  CATEGORY_VALUES,
  isCategoryValue,
  isSortValue,
  SORT_LABELS,
  SORT_VALUES,
} from "./productListOptions";
import styles from "./commerce.module.css";

type ProductListFiltersProps = {
  q: string;
  category: CategoryId | "all";
  sort: ProductSort;
  onSearch: (q: string) => void;
  onCategoryChange: (category: CategoryId | "all") => void;
  onSortChange: (sort: ProductSort) => void;
};

export function ProductListFilters({
  q,
  category,
  sort,
  onSearch,
  onCategoryChange,
  onSortChange,
}: ProductListFiltersProps) {
  const handleSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    const input = event.currentTarget.elements.namedItem("q");

    if (input instanceof HTMLInputElement) onSearch(input.value.trim());
  };

  return (
    <form className={styles.filters} role="search" onSubmit={handleSubmit}>
      <label>
        검색
        <input
          key={q}
          name="q"
          defaultValue={q}
          placeholder="상품명 또는 브랜드"
        />
      </label>
      <label>
        카테고리
        <select
          value={category}
          onChange={(event) => {
            if (!isCategoryValue(event.target.value)) return;
            onCategoryChange(event.target.value);
          }}
        >
          {CATEGORY_VALUES.map((value) => (
            <option key={value} value={value}>
              {CATEGORY_LABELS[value]}
            </option>
          ))}
        </select>
      </label>
      <label>
        정렬
        <select
          value={sort}
          onChange={(event) => {
            if (!isSortValue(event.target.value)) return;
            onSortChange(event.target.value);
          }}
        >
          {SORT_VALUES.map((value) => (
            <option key={value} value={value}>
              {SORT_LABELS[value]}
            </option>
          ))}
        </select>
      </label>
      <button type="submit">검색</button>
    </form>
  );
}
