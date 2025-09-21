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
  // Optional CoinGecko identifier for fetching live data
  coingeckoId?: string;
}

interface PortfolioState {
  tokens: Token[];
  lastUpdated: string;
  isLoading: boolean;
}

// Read persisted state from localStorage (if present)
const loadPersisted = (): PortfolioState | null => {
  try {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem("portfolio_state");
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<PortfolioState>;
    return {
      tokens: parsed.tokens ?? [],
      lastUpdated: parsed.lastUpdated ?? "-",
      isLoading: false,
    } as PortfolioState;
  } catch {
    return null;
  }
};

const initialState: PortfolioState =
  loadPersisted() ?? {
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

// Attempt to refresh prices using CoinGecko for tokens that have a coingeckoId
export const refreshPricesFromCoinGecko = createAsyncThunk<
  Token[],
  void,
  { state: RootState }
>("portfolio/refreshPricesFromCoinGecko", async (_: void, { getState }) => {
  const { tokens } = getState().portfolio;
  const ids = tokens
    .map((t) => t.coingeckoId || t.id)
    .filter((id) => typeof id === "string")
    .join(",");

  if (!ids) return tokens;

  const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${encodeURIComponent(
    ids
  )}&sparkline=true&price_change_percentage=24h`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("CG error");
    const data: Array<{
      id: string;
      symbol: string;
      name: string;
      image: string;
      current_price: number;
      price_change_percentage_24h: number;
      sparkline_in_7d?: { price: number[] };
    }> = await res.json();

    const map = new Map(data.map((d) => [d.id, d]));
    const updated: Token[] = tokens.map((t) => {
      const key = t.coingeckoId || t.id;
      const d = map.get(key);
      if (!d) return t;
      const spark = d.sparkline_in_7d?.price ?? t.sparklineData;
      return {
        ...t,
        icon: d.image || t.icon,
        price: d.current_price,
        change24h: d.price_change_percentage_24h ?? t.change24h,
        sparklineData: spark.slice(-7),
      };
    });

    return updated;
  } catch {
    // fallback to existing tokens if network fails
    return tokens;
  }
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
      })
      .addCase(refreshPricesFromCoinGecko.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(refreshPricesFromCoinGecko.fulfilled, (state, action) => {
        state.tokens = action.payload;
        state.isLoading = false;
        state.lastUpdated = new Date().toLocaleTimeString();
      })
      .addCase(refreshPricesFromCoinGecko.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const { setTokens, addToken, updateHoldings, removeToken } =
  portfolioSlice.actions;
export default portfolioSlice.reducer;
