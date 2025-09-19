import eth from "../assets/etherum.png";
import usdcIcon from "../assets/USDC.png";
import btc from "../assets/btc-thumbnail.png";
import dogeIcon from "../assets/dodge.png";
import stellarIcon from "../assets/stellar.png";
import solanaIcon from "../assets/SOL.png";

export const mockTokens = [
  {
    id: "ethereum",
    icon: eth,
    name: "Ethereum",
    symbol: "ETH",
    price: 2654.32,
    change24h: 2.3,
    sparklineData: [2600, 2620, 2580, 2640, 2630, 2650, 2654.32],
    holdings: 0.05,
  },
  {
    id: "bitcoin",
    icon: btc,
    name: "Bitcoin",
    symbol: "BTC",
    price: 43250.67,
    change24h: -1.2,
    sparklineData: [43800, 43600, 43400, 43200, 43100, 43300, 43250.67],
    holdings: 0.05,
  },
  {
    id: "solana",
    icon: solanaIcon,
    name: "Solana",
    symbol: "SOL",
    price: 98.45,
    change24h: 4.7,
    sparklineData: [94, 95, 92, 96, 97, 99, 98.45],
    holdings: 15.0,
  },
  {
    id: "dogecoin",
    icon: dogeIcon,
    name: "Dogecoin",
    symbol: "DOGE",
    price: 0.08,
    change24h: 2.3,
    sparklineData: [0.078, 0.079, 0.077, 0.081, 0.08, 0.082, 0.08],
    holdings: 1000.0,
  },
  {
    id: "usdc",
    icon: usdcIcon,
    name: "USDC",
    symbol: "USDC",
    price: 1.0,
    change24h: 0.01,
    sparklineData: [1.001, 1.0, 0.999, 1.001, 1.0, 1.001, 1.0],
    holdings: 5000.0,
  },
  {
    id: "stellar",
    icon: stellarIcon,
    name: "Stellar",
    symbol: "XLM",
    price: 0.12,
    change24h: -2.1,
    sparklineData: [0.125, 0.123, 0.121, 0.119, 0.118, 0.12, 0.12],
    holdings: 2500.0,
  },
];
