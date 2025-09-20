import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState } from "../store";

export interface Token {
  id: string;
  icon: string;
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  sparklineData: number[];
  holdings: number;
}

interface PortfolioState {
  tokens: Token[];
  lastUpdated: string;
  isLoading: boolean;
}

const initialState: PortfolioState = {
  tokens: [],
  lastUpdated: "-",
  isLoading: false,
};

// Async thunk to refresh prices (simulates an API call)
export const refreshPrices = createAsyncThunk<
  Token[],
  void,
  { state: RootState }
>("portfolio/refreshPrices", async (_: void, { getState }) => {
  // simulate latency
  await new Promise((resolve) => setTimeout(resolve, 800));

  const { tokens } = getState().portfolio;
  const updated = tokens.map((t) => {
    // Simulate a price change within +/-5%
    const deltaPct = (Math.random() * 10 - 5) / 100; // -0.05 .. 0.05
    const newPrice = Math.max(0, t.price * (1 + deltaPct));
    const change24h = ((newPrice - t.price) / t.price) * 100;

    const spark = [...t.sparklineData, newPrice];
    // Keep only the last 7 points to match UI assumption
    const sparklineData = spark.slice(-7);

    return {
      ...t,
      price: newPrice,
      change24h,
      sparklineData,
    } as Token;
  });

  return updated;
});

const portfolioSlice = createSlice({
  name: "portfolio",
  initialState,
  reducers: {
    setTokens: (state, action: PayloadAction<Token[]>) => {
      state.tokens = action.payload;
      state.lastUpdated = new Date().toLocaleTimeString();
    },
    addToken: (state, action: PayloadAction<Token>) => {
      const exists = state.tokens.some((t) => t.id === action.payload.id);
      if (!exists) {
        state.tokens.push(action.payload);
        state.lastUpdated = new Date().toLocaleTimeString();
      }
    },
    updateHoldings: (
      state,
      action: PayloadAction<{ id: string; holdings: number }>
    ) => {
      const { id, holdings } = action.payload;
      const token = state.tokens.find((t) => t.id === id);
      if (token) {
        token.holdings = holdings;
      }
    },
    removeToken: (state, action: PayloadAction<string>) => {
      state.tokens = state.tokens.filter((t) => t.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(refreshPrices.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(refreshPrices.fulfilled, (state, action) => {
        state.tokens = action.payload;
        state.isLoading = false;
        state.lastUpdated = new Date().toLocaleTimeString();
      })
      .addCase(refreshPrices.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const { setTokens, addToken, updateHoldings, removeToken } =
  portfolioSlice.actions;
export default portfolioSlice.reducer;
