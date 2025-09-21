import type { JSX } from "react/jsx-dev-runtime";
import logo from "../../../../assets/Logo.png";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import walletIcon from "../../../../assets/wallet.png";
import { motion } from "framer-motion";

export const PortfolioSection = (): JSX.Element => {
  return (
    <motion.div
      className="flex w-full h-auto md:h-14 relative items-center gap-2 md:gap-1.5 p-2 md:p-3"
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="flex items-center gap-2 md:gap-3 relative flex-1 grow">
        <motion.img
          className="relative flex-[0_0_auto] w-6 h-6 sm:w-7 sm:h-7 md:w-auto md:h-auto"
          alt="Logo"
          src={logo}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.25 }}
        />

        <motion.div
          className="relative flex-1 [font-family:'Inter',Helvetica] font-semibold text-white text-base sm:text-lg md:text-xl tracking-[0] leading-6 truncate"
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.25, delay: 0.05 }}
        >
          Token Portfolio
        </motion.div>
      </div>

      <div className="inline-flex items-center gap-3 md:gap-6 relative flex-[0_0_auto]">
        <div className="rounded-[100px]">
          <ConnectButton.Custom>
            {({ account, chain, openConnectModal, openAccountModal, mounted }) => {
              const connected = mounted && account && chain;
              return (
                <div>
                  {connected ? (
                    <motion.button
                      onClick={openAccountModal}
                      className="flex items-center gap-2 bg-[#A9E851] px-4 py-2 rounded-full text-darkforegroundsfg-on-inverted cursor-pointer"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25, delay: 0.1 }}
                      whileHover={{ scale: 1.06 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <img src={walletIcon} alt="Wallet" className="w-4 h-4" />
                      <span className="truncate max-w-[100px]">
                        {account.displayName}
                      </span>
                    </motion.button>
                  ) : (
                    <motion.button
                      onClick={openConnectModal}
                      className="flex items-center gap-2 bg-[#A9E851] px-4 py-2 rounded-full text-darkforegroundsfg-on-inverted cursor-pointer"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25, delay: 0.1 }}
                      whileHover={{ scale: 1.06 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <img src={walletIcon} alt="Wallet" className="w-4 h-4" />
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
