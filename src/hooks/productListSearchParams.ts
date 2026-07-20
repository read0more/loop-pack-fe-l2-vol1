// 서버·클라 공용이라 parser 는 nuqs/server 에서 가져온다
import {
  parseAsInteger,
  parseAsString,
  parseAsStringLiteral,
} from "nuqs/server";
import { PRODUCT_LIST_DEFAULTS } from "@/utils/productList";
import {
  CATEGORY_VALUES,
  SORT_VALUES,
} from "@/components/commerce/productListOptions";
import type { ProductListParams } from "@/queries/products";

export const FIRST_PAGE = 1;

export const productListParsers = {
  q: parseAsString.withDefault(PRODUCT_LIST_DEFAULTS.q),
  category: parseAsStringLiteral(CATEGORY_VALUES).withDefault(
    PRODUCT_LIST_DEFAULTS.category,
  ),
  sort: parseAsStringLiteral(SORT_VALUES).withDefault(
    PRODUCT_LIST_DEFAULTS.sort,
  ),
  page: parseAsInteger.withDefault(PRODUCT_LIST_DEFAULTS.page),
};

// page 하한 규칙: FIRST_PAGE 미만이면 FIRST_PAGE 로 올리고, FIRST_PAGE 이상이면 그대로
export function clampPageToLowerBound(page: number): number {
  return Math.max(FIRST_PAGE, page);
}

export function resolveProductListQuery(
  parsed: ProductListParams,
): ProductListParams {
  return { ...parsed, page: clampPageToLowerBound(parsed.page) };
}
