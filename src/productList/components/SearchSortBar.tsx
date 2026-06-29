import { SORT_OPTIONS } from "../constants";
import type { SortBy, ViewMode } from "../types";

/** 상품 검색어 입력, 정렬 기준 선택, 그리드/리스트 보기 모드 선택 바. */
export default function SearchSortBar({
  searchQuery,
  sortBy,
  viewMode,
  onSearchChange,
  onSortChange,
  onViewModeChange,
}: {
  searchQuery: string;
  sortBy: SortBy;
  viewMode: ViewMode;
  onSearchChange: (value: string) => void;
  onSortChange: (value: string) => void;
  onViewModeChange: (value: string) => void;
}) {
  return (
    <section className="search-sort">
      <input
        type="search"
        placeholder="상품 검색..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="search-input"
      />
      <select value={sortBy} onChange={(e) => onSortChange(e.target.value)}>
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <select
        value={viewMode}
        onChange={(e) => onViewModeChange(e.target.value)}
      >
        <option value="grid">그리드</option>
        <option value="list">리스트</option>
      </select>
    </section>
  );
}
