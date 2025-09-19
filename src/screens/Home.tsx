import type { JSX } from "react";
import { PortfolioSection } from "./Home/sections/PortfolioSection/PortfolioSection";

export const Home = (): JSX.Element => {
  return (
    <main className="w-full p-4 mx-auto min-h-screen flex flex-col bg-darkbackgroundsbg-base">
      <PortfolioSection />
    </main>
  );
};
