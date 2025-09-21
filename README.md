# Plena Portfolio

Token portfolio dashboard built with React, TypeScript, Vite, and Tailwind CSS. It integrates RainbowKit + Wagmi + Viem for wallet connections across multiple chains, Redux Toolkit for portfolio state, and TanStack Query for async data.

## Features

- **Wallet connect (RainbowKit + Wagmi)** with WalletConnect project ID.
- **Multi-chain support**: Ethereum mainnet, Polygon, Arbitrum, Base, Optimism (`src/wallet/config.ts`).
- **Portfolio tracking** with persisted state in `localStorage` (`src/store/store.ts`).
- **Watchlist section** loaded lazily with `React.Suspense` (`src/screens/Home.tsx`).
- **Charts and UI** using Recharts, Radix UI primitives, and Tailwind CSS.
- **Modern build**: Vite + React SWC, TypeScript, ESLint, Tailwind v4.
 - **Market data (CoinGecko)** via public API endpoints with client-side caching.

## Tech stack

- **Framework**: React 19 + TypeScript, Vite 7 (`vite.config.ts`, alias `@` → `src/`).
- **Styling**: Tailwind CSS v4 (`tailwindcss`, `@tailwindcss/vite`), utility helpers (`clsx`, `tailwind-merge`).
- **State**: Redux Toolkit + React Redux, persisted slice to `localStorage`.
- **Web3**: RainbowKit, Wagmi, Viem; chains configured in `src/wallet/config.ts`.
- **Data**: TanStack Query (via `QueryClientProvider` in `src/main.tsx`).
- **Charts/UI**: Recharts, Radix UI Dropdown Menu, Lucide icons, Framer Motion.

## Project structure

- `index.html` — App mount and script entry.
- `src/main.tsx` — App bootstrap: Wagmi, RainbowKit, QueryClient, Redux Provider, renders `Home`.
- `src/screens/Home.tsx` — Main layout; renders `PortfolioSection` and lazy `WatchlistSection`.
- `src/screens/Home/sections/...` — Feature sections of the Home screen.
- `src/store/` — Redux store and `portfolioSlice` (persisted to `localStorage`).
- `src/components/` — UI components (buttons, cards, dropdown-menu, charts, spinner, etc.).
- `src/wallet/config.ts` — Wagmi + RainbowKit configuration and enabled chains.
- `src/mockData/` — Mock portfolio/watchlist data.
- `vite.config.ts` — Vite plugins and path alias.
- `public/` — Static assets (favicon, etc.).

## Getting Started

- **Clone the repository**

```bash
git clone https://github.com/ay690/Plena_Finance.git
cd Plena_Finance
```

- **Install dependencies**

```bash
npm install
# or
yarn
```

- **Run the development server**

```bash
npm run dev
# or
yarn dev
```

- **Access the application**

- Open your browser and navigate to http://localhost:5173 to view the application.

### Prerequisites
- React 19+
- Node.js 18+ (LTS recommended)
- npm (project includes `package-lock.json`)

### Environment variables

Create a `.env` file at the project root and set:

```bash
# WalletConnect Project ID (required for RainbowKit/Wagmi)
VITE_WC_PROJECT_ID=your_walletconnect_project_id
```

If not provided, the app falls back to `'YOUR_WALLETCONNECT_PROJECT_ID'` (see `src/wallet/config.ts`).

### Development

```bash
npm run dev
```

Vite will print a local dev URL. Open it in your browser.

### Type-check, build, and preview

```bash
# Type-check and build for production
npm run build

# Preview the production build locally
npm run preview
```

### Lint

```bash
npm run lint
```

## Key implementation details

- **Wallet setup**: `src/wallet/config.ts` defines `wagmiConfig` using `getDefaultConfig` from RainbowKit, enabling Mainnet, Polygon, Arbitrum, Base, and Optimism with default `http()` transports.
- **Providers**: `src/main.tsx` composes `WagmiProvider`, `QueryClientProvider`, `RainbowKitProvider`, and Redux `Provider` to render `Home`.
- **State persistence**: `src/store/store.ts` subscribes to store updates and persists `portfolio.tokens` and `lastUpdated` to `localStorage`.
- **Code-splitting**: `WatchlistSection` is lazy-loaded via `React.lazy` + `Suspense`.
- **Alias**: Import using `@/` for paths resolved to `src/`.

## CoinGecko API integration

This app can fetch public crypto market data using the CoinGecko API (no API key required for public endpoints). Use it for prices, market caps, and coin metadata to enrich the portfolio and watchlist.

- Docs: https://www.coingecko.com/en/api/documentation
- Base URL: https://api.coingecko.com/api/v3
- Note: Rate limits and terms of use can change. Always check the official docs for the latest limits and attribution requirements.


## Deployment

This is a static Vite app. Any static host (Netlify, Vercel, GitHub Pages, Cloudflare Pages) will work.

1. Ensure `VITE_WC_PROJECT_ID` is set in your hosting provider’s environment settings.
2. Build with `npm run build`.
3. Deploy the `dist/` folder.

## Troubleshooting

- **Wallet modal not opening**: Confirm `VITE_WC_PROJECT_ID` is configured and valid.
- **Blank screen after build**: Verify static hosting serves the built `dist/` folder and no path base issues.
- **CORS or chain RPC issues**: Custom RPCs aren’t set—defaults use `http()`; consider configuring custom transports if needed.

## License

This project is licensed under the [MIT License](./LICENSE).

---

## Appendix: Original Vite Template Notes
 ## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
