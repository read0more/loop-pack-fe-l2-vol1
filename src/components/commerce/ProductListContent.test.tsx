// @vitest-environment jsdom
// Advanced C — 페이지 전환 중 기존 목록 유지(항목 4)

import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NuqsTestingAdapter } from "nuqs/adapters/testing";
import { ProductListContent } from "./ProductListContent";
import { getProducts } from "@/services/commerce";
import type { Product, ProductListResponse } from "@/types/commerce";

vi.mock("@/services/commerce", () => ({ getProducts: vi.fn() }));

const getProductsMock = vi.mocked(getProducts);

function makeProduct(id: string, name: string): Product {
  return {
    id,
    brand: "브랜드",
    name,
    category: "home",
    price: 1000,
    originalPrice: null,
    image: "/images/products/p1.jpg",
    freeShipping: false,
    sizes: [],
    rating: 0,
    reviewCount: 0,
    createdAt: "2024-01-01T00:00:00.000Z",
  };
}

function makeResponse(page: number, products: Product[]): ProductListResponse {
  return { products, categories: [], totalCount: 30, page, pageSize: 12 };
}

function renderList(searchParams = "?page=1") {
  const queryClient = new QueryClient();

  // hasMemory: URL 쓰기(setPage 등)를 읽기 상태에 반영해 실제 네비게이션처럼 동작하게 한다.
  return render(
    <QueryClientProvider client={queryClient}>
      <NuqsTestingAdapter searchParams={searchParams} hasMemory>
        <ProductListContent />
      </NuqsTestingAdapter>
    </QueryClientProvider>,
  );
}

beforeEach(() => {
  getProductsMock.mockReset();
});

afterEach(cleanup);

describe("ProductListContent", () => {
  test("페이지 전환 중 이전 목록을 유지한다(keepPreviousData)", async () => {
    // page 2 응답을 지연시켜 "전환 중" 상태를 만든다. page 별로 분기해
    // 자동 prefetch(항목 2)가 어떤 순서로 호출해도 같은 응답을 돌려주게 한다.
    let resolvePage2: (value: ProductListResponse) => void = () => {};
    const page2Promise = new Promise<ProductListResponse>((resolve) => {
      resolvePage2 = resolve;
    });
    getProductsMock.mockImplementation((query) =>
      query.page === 1
        ? Promise.resolve(makeResponse(1, [makeProduct("p1", "1페이지상품")]))
        : page2Promise,
    );

    renderList("?page=1");
    expect(await screen.findByText("1페이지상품")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "다음" }));

    // page 2 가 아직 도착 전이어도(전환 중) 이전 페이지 목록은 화면에 남아 있다
    await waitFor(() =>
      expect(
        getProductsMock.mock.calls.some((call) => call[0].page === 2),
      ).toBe(true),
    );
    expect(screen.getByText("1페이지상품")).toBeTruthy();

    resolvePage2(makeResponse(2, [makeProduct("p13", "2페이지상품")]));
    expect(await screen.findByText("2페이지상품")).toBeTruthy();
  });
});
