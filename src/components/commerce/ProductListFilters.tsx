"use client";

import { useEffect, useState, type SyntheticEvent } from "react";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useProductListSearchParams } from "@/hooks/useProductListSearchParams";
import {
  CATEGORY_LABELS,
  CATEGORY_VALUES,
  isCategoryValue,
  isSortValue,
  SORT_LABELS,
  SORT_VALUES,
} from "./productListOptions";
import styles from "./commerce.module.css";

export const SEARCH_DEBOUNCE_MS = 300;

export function ProductListFilters() {
  const { query, setSearch, setFilter } = useProductListSearchParams();
  const searchTerm = query.q;

  const [inputValue, setInputValue] = useState(searchTerm);

  // 같은 라우트(/products) 안에서 URL 만 바뀌면(예: 헤더 "상품" 링크로 검색어 제거) React 는 이 컴포넌트를
  // "같은 자리의 같은 컴포넌트"로 보고 인스턴스를 재사용한다 → unmount 가 없어 로컬 state 인 inputValue 가
  // 초기화되지 않고 옛 검색어가 그대로 남는다(입력창이 URL 과 어긋남).
  // 그래서 prevSearchTerm 은 "직전 검색어(URL)"를 기억해 그 순간을 감지하는 마커다.
  // (searchTerm 마다 컴포넌트를 key로 remount 하면 초기화되지만, 입력 디바운스후 다시 fetch될 때도 remount 돼 입력 포커스가 날아간다.)
  const [prevSearchTerm, setPrevSearchTerm] = useState(searchTerm);

  // 위 이유로 어긋난 입력창을 URL 검색어에 다시 동기화한다: searchTerm 이 바뀐 렌더에서만 inputValue 를 그 값으로 맞춘다.
  if (searchTerm !== prevSearchTerm) {
    setPrevSearchTerm(searchTerm);
    setInputValue(searchTerm);
  }

  const debouncedInputValue = useDebouncedValue(inputValue, SEARCH_DEBOUNCE_MS);

  // 디바운스된 입력값을 URL(검색어)에 커밋한다.
  // `debouncedInputValue === inputValue` 가드가 필요한 이유: setInputValue 는 두 곳에서 불린다 —
  //  (1) 타이핑(onChange)은 debounce 를 거치지만, (2) 위 if문 안에서는 inputValue 를
  //  debounce 없이 '즉시' 바꾼다. (2)가 일어난 순간 debouncedInputValue 는 아직 옛 값이라 inputValue 와
  //  어긋나는데, 그때 커밋하면 방금 외부에서 바뀐 검색어(예: 헤더 "상품"으로 지움)를 그 낡은 값으로
  //  되돌려버린다. 그래서 debounce 가 '현재' inputValue 까지 따라잡았을 때(===)만 커밋한다.
  useEffect(() => {
    const next = debouncedInputValue.trim();

    if (debouncedInputValue === inputValue && next !== searchTerm)
      setSearch(next);
  }, [debouncedInputValue, inputValue, searchTerm, setSearch]);

  const handleSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSearch(inputValue.trim());
  };

  return (
    <form className={styles.filters} role="search" onSubmit={handleSubmit}>
      <label>
        검색
        <input
          type="search"
          name="q"
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          placeholder="상품명 또는 브랜드"
        />
      </label>
      <label>
        카테고리
        <select
          value={query.category}
          onChange={(event) => {
            if (!isCategoryValue(event.target.value)) return;
            setFilter({ category: event.target.value });
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
          value={query.sort}
          onChange={(event) => {
            if (!isSortValue(event.target.value)) return;
            setFilter({ sort: event.target.value });
          }}
        >
          {SORT_VALUES.map((value) => (
            <option key={value} value={value}>
              {SORT_LABELS[value]}
            </option>
          ))}
        </select>
      </label>
    </form>
  );
}
