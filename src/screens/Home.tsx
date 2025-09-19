import type { JSX } from "react";
import { WatchlistSection } from "./Home/sections/WatchlistSection/WatchlistSection";
import { PortfolioSection } from "./Home/sections/PortfolioSection/PortfolioSection";

export const Home = (): JSX.Element => {
  return (
    <main className="w-full p-10 mx-auto min-h-screen flex flex-col bg-darkbackgroundsbg-base">
      <PortfolioSection />
      <WatchlistSection />
    </main>
  );
};
