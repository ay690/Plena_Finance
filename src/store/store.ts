import { configureStore } from "@reduxjs/toolkit";
import portfolioReducer from "./slices/portfolioSlice";

export const store = configureStore({
  reducer: {
    portfolio: portfolioReducer,
  },
});

// Persist portfolio slice to localStorage
if (typeof window !== "undefined") {
  store.subscribe(() => {
    try {
      const state = store.getState();
      const toPersist = {
        tokens: state.portfolio.tokens,
        lastUpdated: state.portfolio.lastUpdated,
      };
      localStorage.setItem("portfolio_state", JSON.stringify(toPersist));
    } catch {
      // ignore write errors
    }
  });
}

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;