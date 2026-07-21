import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import { getProducts } from "@/services/commerce";
import { normalizeProductListQuery } from "@/utils/productList";
import type { ProductListQuery } from "@/types/commerce";

// 과제 기본 제공 타입에서 Pick으로 필요한 필드만 뽑아 필수화한 타입 정의.
// pageSize는 fetcher가 채우므로 여기 포함하지 않는다.
export type ProductListParams = Required<
  Pick<ProductListQuery, "q" | "category" | "sort" | "page">
>;

export const productQueries = {
  all: () => ["products"] as const,
  lists: () => [...productQueries.all(), "list"] as const,
  list: (query: ProductListParams) => {
    // 정규화한 조건을 queryKey와 요청 양쪽에 넘긴다 → URL→queryKey→API가 한 경로로 일치하고 캐시 중복이 없다
    const normalized = normalizeProductListQuery(query);

    return queryOptions({
      queryKey: [...productQueries.lists(), normalized],
      queryFn: () => getProducts(normalized),
      // 조건/페이지 전환 시 이전 결과를 유지해 빈 화면·로딩 깜빡임을 없앤다.
      placeholderData: keepPreviousData,
    });
  },
};
