import { describe, expect, test } from "vitest";
import { resolveProductListQuery } from "@/hooks/productListSearchParams";
import type { ProductListParams } from "@/queries/products";

const BASE: ProductListParams = {
  q: "",
  category: "all",
  sort: "latest",
  page: 1,
};

describe("resolveProductListQuery — URL 파싱값을 상품 목록 조회 조건(queryKey 재료)으로 변환", () => {
  test("page 하한(<1)을 1로 클램프한다", () => {
    expect(resolveProductListQuery({ ...BASE, page: 0 }).page).toBe(1);
    expect(resolveProductListQuery({ ...BASE, page: -5 }).page).toBe(1);
  });

  test("유효한 page 는 그대로 둔다", () => {
    expect(resolveProductListQuery({ ...BASE, page: 3 }).page).toBe(3);
  });

  test("q·category·sort 는 그대로 통과시킨다", () => {
    const resolved = resolveProductListQuery({
      q: "stanley",
      category: "home",
      sort: "price-asc",
      page: 2,
    });

    expect(resolved).toEqual({
      q: "stanley",
      category: "home",
      sort: "price-asc",
      page: 2,
    });
  });
});
