import type { JSX } from "react";
import React, { Suspense } from "react";
import { PortfolioSection } from "./Home/sections/PortfolioSection/PortfolioSection";
import { Spinner } from "@/components/SpinnerUI";

const WatchlistSection = React.lazy(() =>
  import("./Home/sections/WatchlistSection/WatchlistSection").then((m) => ({
    default: m.WatchlistSection,
  }))
);

export const Home = (): JSX.Element => {
  return (
    <main className="w-full p-10 mx-auto min-h-screen flex flex-col bg-darkbackgroundsbg-base">
      <PortfolioSection />
      <Suspense fallback={<Spinner />}>
        <WatchlistSection />
      </Suspense>
    </main>
  );
};
