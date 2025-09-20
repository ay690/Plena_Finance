import { Button } from "../../../../components/ui/button";
import type { JSX } from "react/jsx-dev-runtime";
import logo from "../../../../assets/Logo.png";
import walletIcon from "../../../../assets/wallet.png";

export const PortfolioSection = (): JSX.Element => {
  return (
    <div className="flex w-full h-auto md:h-14 relative items-center gap-2 md:gap-1.5 p-2 md:p-3">
      <div className="flex items-center gap-2 md:gap-3 relative flex-1 grow">
        <img className="relative flex-[0_0_auto] w-6 h-6 sm:w-7 sm:h-7 md:w-auto md:h-auto" alt="Logo" src={logo} />

        <div className="relative flex-1 [font-family:'Inter',Helvetica] font-semibold text-white text-base sm:text-lg md:text-xl tracking-[0] leading-6 truncate">
          Token Portfolio
        </div>
      </div>

      <div className="inline-flex items-center gap-3 md:gap-6 relative flex-[0_0_auto]">
        <Button className="px-2.5 py-1.5 bg-[#a9e851] rounded-[100px] shadow-[0px_0px_0px_1px_#1f6619,0px_1px_2px_#1f661966,inset_0px_0.75px_0px_#ffffff33] inline-flex items-center justify-center gap-1.5 relative flex-[0_0_auto] overflow-hidden h-auto hover:bg-[#98d147] cursor-pointer">
          <img
            className="relative w-4 h-4 sm:w-5 sm:h-5"
            alt="Wallet"
            src={walletIcon}
          />

          <div className="mt-[-1.00px] text-black/70 font-medium text-xs sm:text-sm whitespace-nowrap">
            Connect Wallet
          </div>
        </Button>
      </div>
    </div>
  );
};
