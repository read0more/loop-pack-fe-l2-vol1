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
import { useProductListSearchParams } from "@/hooks/useProductListSearchParams";

// URL 배선 hook 을 mock 해 debounce/커밋 로직만 격리 검증한다(실제 nuqs·URL 없이).
vi.mock("@/hooks/useProductListSearchParams", () => ({
  useProductListSearchParams: vi.fn(),
}));

const useSearchParamsMock = vi.mocked(useProductListSearchParams);

type SetSearch = ReturnType<typeof useProductListSearchParams>["setSearch"];

function renderFilters(setSearch: SetSearch, searchTerm = "") {
  useSearchParamsMock.mockReturnValue({
    query: { q: searchTerm, category: "all", sort: "latest", page: 1 },
    setSearch,
    setFilter: vi.fn(),
    setPage: vi.fn(),
    clampPageToRange: vi.fn(),
  });

  return render(<ProductListFilters />);
}

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.clearAllMocks();
});

describe("ProductListFilters 검색어 debounce", () => {
  test("입력 후 디바운스 시간이 지나면 setSearch 를 호출한다", () => {
    const setSearch = vi.fn();
    renderFilters(setSearch);

    fireEvent.change(screen.getByRole("searchbox"), {
      target: { value: "stanley" },
    });
    expect(setSearch).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(SEARCH_DEBOUNCE_MS);
    });
    expect(setSearch).toHaveBeenCalledWith("stanley");
  });

  test("디바운스 시간 전에는 setSearch 를 호출하지 않는다", () => {
    const setSearch = vi.fn();
    renderFilters(setSearch);

    fireEvent.change(screen.getByRole("searchbox"), {
      target: { value: "sta" },
    });
    act(() => {
      vi.advanceTimersByTime(SEARCH_DEBOUNCE_MS - 1);
    });

    expect(setSearch).not.toHaveBeenCalled();
  });

  test("제출(Enter/버튼)은 디바운스를 우회해 즉시 setSearch 를 호출한다", () => {
    const setSearch = vi.fn();
    renderFilters(setSearch);

    fireEvent.change(screen.getByRole("searchbox"), {
      target: { value: "nike" },
    });
    fireEvent.submit(screen.getByRole("search"));

    expect(setSearch).toHaveBeenCalledWith("nike");
  });
});
