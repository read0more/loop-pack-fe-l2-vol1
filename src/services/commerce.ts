import type {
  HomeResponse,
  ProductListQuery,
  ProductListResponse,
} from "@/types/commerce";
import { buildProductListSearchParams } from "@/utils/productList";
import { requestJson } from "./requestJson";

const DEFAULT_BASE_URL = "http://localhost:3000";

export function getHome(): Promise<HomeResponse> {
  return requestJson<HomeResponse>(`${DEFAULT_BASE_URL}/api/home`);
}

export function getProducts(
  query: ProductListQuery,
): Promise<ProductListResponse> {
  const params = buildProductListSearchParams(query);

  return requestJson<ProductListResponse>(`/api/products?${params.toString()}`);
}
