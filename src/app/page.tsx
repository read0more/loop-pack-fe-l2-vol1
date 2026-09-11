import { Suspense } from "react";
import { CommerceHeader } from "@/widgets/commerce";
import { HomeSection, generateHomeMetadata } from "@/_pages/home";
import { HeroSkeleton } from "@/examples/week-07-performance/HeroSkeleton";
import app from "@/_app/styles/app.module.css";
import layout from "@/shared/ui/layout.module.css";

// 10주차 2단계 조건부 실행 자가 검증용 변경. 이 브랜치는 머지하지 않는다.
export const generateMetadata = generateHomeMetadata;

export default function HomePage() {
  return (
    <main className={app.page}>
      <CommerceHeader />
      <h1 className={layout.sectionTitle}>홈</h1>
      <Suspense
        fallback={
          <>
            <HeroSkeleton />
            <p className={layout.status}>홈 데이터를 불러오는 중…</p>
          </>
        }
      >
        <HomeSection />
      </Suspense>
    </main>
  );
}
