import { QueryClient, environmentManager } from "@tanstack/react-query";

// 전역 staleTime. 서버에서 prefetch 한 데이터가 클라 mount 즉시 stale 로 간주돼 중복 재요청되는 것을 막는다.
// (Advanced B 의 "초기 중복 요청 없음"이 성립하려면 prefetch 데이터가 클라에서 fresh 여야 한다)
const DEFAULT_STALE_TIME = 60 * 1000;

export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { staleTime: DEFAULT_STALE_TIME },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

// https://tanstack.com/query/v5/docs/framework/react/guides/advanced-ssr#initial-setup
export function getQueryClient() {
  // 서버: 요청마다 새 인스턴스 — 요청 간 캐시가 섞이지 않게 한다.
  if (environmentManager.isServer()) return makeQueryClient();

  // 브라우저: 싱글톤 — 렌더마다 새로 만들면 캐시가 초기화된다.
  browserQueryClient ??= makeQueryClient();

  return browserQueryClient;
}
