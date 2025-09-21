import type { JSX } from "react/jsx-dev-runtime";
import logo from "../../../../assets/Logo.png";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import walletIcon from "../../../../assets/wallet.png";

export const PortfolioSection = (): JSX.Element => {
  return (
    <div className="flex w-full h-auto md:h-14 relative items-center gap-2 md:gap-1.5 p-2 md:p-3">
      <div className="flex items-center gap-2 md:gap-3 relative flex-1 grow">
        <img
          className="relative flex-[0_0_auto] w-6 h-6 sm:w-7 sm:h-7 md:w-auto md:h-auto"
          alt="Logo"
          src={logo}
        />

        <div className="relative flex-1 [font-family:'Inter',Helvetica] font-semibold text-white text-base sm:text-lg md:text-xl tracking-[0] leading-6 truncate">
          Token Portfolio
        </div>
      </div>

      <div className="inline-flex items-center gap-3 md:gap-6 relative flex-[0_0_auto]">
        <div className="rounded-[100px]">
          <ConnectButton.Custom>
            {({ account, chain, openConnectModal, openAccountModal, mounted }) => {
              const connected = mounted && account && chain;
              return (
                <div>
                  {connected ? (
                    <button
                      onClick={openAccountModal}
                      className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-white hover:bg-white/20 hover:scale-110 transition cursor-pointer"
                    >
                      <img src={walletIcon} alt="Wallet" className="w-5 h-5" />
                      <span className="truncate max-w-[100px]">
                        {account.displayName}
                      </span>
                    </button>
                  ) : (
                    <button
                      onClick={openConnectModal}
                      className="flex items-center gap-2 bg-[#A9E851] px-4 py-2 rounded-full text-darkforegroundsfg-on-inverted hover:scale-110 transition cursor-pointer"
                    >
                      <img src={walletIcon} alt="Wallet" className="w-5 h-5" />
                      <span>Connect Wallet</span>
                    </button>
                  )}
                </div>
              );
            }}
          </ConnectButton.Custom>
        </div>
      </div>
    </div>
  );
};
