import type { JSX } from "react/jsx-dev-runtime";
import logo from "../../../../assets/Logo.png";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import walletIcon from "../../../../assets/wallet.png";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useAccount } from "wagmi";

export const PortfolioSection = (): JSX.Element => {
  const { isConnecting } = useAccount();
  return (
    <motion.div
      className="flex w-full h-auto md:h-14 relative items-center gap-2 md:gap-1.5 p-2 md:p-3"
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="flex items-center gap-2 md:gap-3 relative flex-1 grow">
        <motion.img
          className="relative flex-[0_0_auto] w-5 h-5 sm:w-7 sm:h-7 md:w-auto md:h-auto" 
          alt="Logo"
          src={logo}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.25 }}
        />

        <motion.div
          className="relative flex-1 font-semibold text-white 
                 text-sm sm:text-base md:text-xl  // 👈 smaller default, scale up later
                 tracking-[0] leading-5 sm:leading-6 truncate"
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.25, delay: 0.05 }}
        >
          Token Portfolio
        </motion.div>
      </div>

      <div className="inline-flex items-center gap-2 sm:gap-3 md:gap-6 relative flex-[0_0_auto]">
        <div className="rounded-[100px]">
          <ConnectButton.Custom>
            {({
              account,
              chain,
              openConnectModal,
              openAccountModal,
              mounted,
            }) => {
              const connected = mounted && account && chain;
              const connecting = isConnecting;

              return (
                <div>
                  {connecting ? (
                    <motion.button
                      disabled
                      className="flex items-center gap-1 sm:gap-2 
                             bg-[#A9E851] px-2 py-1 sm:px-4 sm:py-2  // 👈 smaller padding for small screens
                             rounded-full text-xs sm:text-sm md:text-base
                             cursor-not-allowed opacity-80"
                    >
                      <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
                      <span>Connecting…</span>
                    </motion.button>
                  ) : connected ? (
                    <motion.button
                      onClick={openAccountModal}
                      className="flex items-center gap-1 sm:gap-2 
                             bg-[#A9E851] px-2 py-1 sm:px-4 sm:py-2
                             rounded-full text-xs sm:text-sm md:text-base
                             cursor-pointer"
                      whileHover={{ scale: 1.06 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <img
                        src={walletIcon}
                        alt="Wallet"
                        className="w-3 h-3 sm:w-4 sm:h-4"
                      />
                      <span className="truncate max-w-[80px] sm:max-w-[100px]">
                        {account.displayName}
                      </span>
                    </motion.button>
                  ) : (
                    <motion.button
                      onClick={openConnectModal}
                      className="flex items-center gap-1 sm:gap-2 
                             bg-[#A9E851] px-2 py-1 sm:px-4 sm:py-2
                             rounded-full text-xs sm:text-sm md:text-base
                             cursor-pointer"
                      whileHover={{ scale: 1.06 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <img
                        src={walletIcon}
                        alt="Wallet"
                        className="w-4 h-4 sm:w-5 sm:h-5"
                      />
                      <span>Connect Wallet</span>
                    </motion.button>
                  )}
                </div>
              );
            }}
          </ConnectButton.Custom>
        </div>
      </div>
    </motion.div>
  );
};
