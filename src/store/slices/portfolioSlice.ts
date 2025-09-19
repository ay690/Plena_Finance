import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface PortfolioItem {
  name: string;
  color: string;
  percentage: string;
  value: number;
}

interface PortfolioState {
  totalValue: string;
  lastUpdated: string;
  items: PortfolioItem[];
}

const initialState: PortfolioState = {
  totalValue: '$10,275.08',
  lastUpdated: '3:42:12 PM',
  items: [
    {
      name: "Bitcoin (BTC)",
      color: "text-darktagstag-green-icon",
      percentage: "21.0%",
      value: 21.0,
    },
    {
      name: "Ethereum (ETH)",
      color: "text-darktagstag-purple-icon",
      percentage: "64.6%",
      value: 64.6,
    },
    {
      name: "Solana (SOL)",
      color: "text-blue-400",
      percentage: "14.4%",
      value: 14.4,
    },
    {
      name: "Dogecoin (DOGE)",
      color: "text-[#18c9dc]",
      percentage: "14.4%",
      value: 14.4,
    },
    {
      name: "USDC (USDC)",
      color: "text-orange-400",
      percentage: "8.2%",
      value: 8.2,
    },
    {
      name: "Stellar (XLM)",
      color: "text-rose-400",
      percentage: "5.8%",
      value: 5.8,
    },
  ],
};

const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState,
  reducers: {
    updateTotalValue: (state, action: PayloadAction<string>) => {
      state.totalValue = action.payload;
    },
    updateLastUpdated: (state, action: PayloadAction<string>) => {
      state.lastUpdated = action.payload;
    },
    updatePortfolioItem: (state, action: PayloadAction<{ index: number; item: PortfolioItem }>) => {
      state.items[action.payload.index] = action.payload.item;
    },
  },
});

export const { updateTotalValue, updateLastUpdated, updatePortfolioItem } = portfolioSlice.actions;
export default portfolioSlice.reducer;