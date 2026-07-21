// @vitest-environment jsdom
// Advanced C — 검색어 debounce(항목 1)

import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { ProductListFilters, SEARCH_DEBOUNCE_MS } from "./ProductListFilters";

function noop() {}

function renderFilters(onSearch: (term: string) => void, searchTerm = "") {
  return render(
    <ProductListFilters
      searchTerm={searchTerm}
      category="all"
      sort="latest"
      onSearch={onSearch}
      onCategoryChange={noop}
      onSortChange={noop}
    />,
  );
}

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe("ProductListFilters 검색어 debounce", () => {
  test("입력 후 디바운스 시간이 지나면 onSearch 를 호출한다", () => {
    const onSearch = vi.fn();
    renderFilters(onSearch);

    fireEvent.change(screen.getByRole("searchbox"), {
      target: { value: "stanley" },
    });
    expect(onSearch).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(SEARCH_DEBOUNCE_MS);
    });
    expect(onSearch).toHaveBeenCalledWith("stanley");
  });

  test("디바운스 시간 전에는 onSearch 를 호출하지 않는다", () => {
    const onSearch = vi.fn();
    renderFilters(onSearch);

    fireEvent.change(screen.getByRole("searchbox"), {
      target: { value: "sta" },
    });
    act(() => {
      vi.advanceTimersByTime(SEARCH_DEBOUNCE_MS - 1);
    });

    expect(onSearch).not.toHaveBeenCalled();
  });

  test("제출(Enter/버튼)은 디바운스를 우회해 즉시 onSearch 를 호출한다", () => {
    const onSearch = vi.fn();
    renderFilters(onSearch);

    fireEvent.change(screen.getByRole("searchbox"), {
      target: { value: "nike" },
    });
    fireEvent.submit(screen.getByRole("search"));

    expect(onSearch).toHaveBeenCalledWith("nike");
  });
});
