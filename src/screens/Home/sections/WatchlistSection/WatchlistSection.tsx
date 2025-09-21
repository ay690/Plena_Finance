/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  MinusIcon,
  MoreHorizontalIcon,
  PlusIcon,
  RefreshCwIcon,
  StarIcon,
  TrashIcon,
  Edit2Icon,
  SearchIcon,
  CircleIcon,
} from "lucide-react";
import React from "react";
import { useAppSelector, useAppDispatch } from "../../../../hooks/redux";
import { refreshPricesFromCoinGecko, refreshPrices, removeToken, setTokens, addToken, type Token } from "../../../../store/slices/portfolioSlice";
import { EditableCell } from "../../../../components/EditableCell";
import { MiniSparkline } from "../../../../components/MiniSparkline";
import { PortfolioDonutChart } from "../../../../components/PortfolioDonutChart";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent } from "../../../../components/ui/card";
import type { JSX } from "react/jsx-dev-runtime";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../../components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../../components/ui/dropdown-menu";
import { mockTokens } from "@/mockData/mockData";
import { ModalSection } from "@/screens/Home/sections/ModalSection/ModalSection";

const COLORS = [
  "#10b981", // green
  "#a78bfa", // purple
  "#60a5fa", // blue
  "#18c9dc", // cyan
  "#fb923c", // orange
  "#fb7185", // rose
];

// Small reusable debounce hook
function useDebounce<T>(value: T, delay = 500) {
  const [debounced, setDebounced] = React.useState(value);
  React.useEffect(() => {
    const id = window.setTimeout(() => setDebounced(value), delay);
    return () => window.clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

export const WatchlistSection = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const { tokens, lastUpdated, isLoading } = useAppSelector(
    (state) => state.portfolio
  );
 
  const [editingTokenId, setEditingTokenId] = React.useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const debouncedSearch = useDebounce(search, 500); // 500ms debounce
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const [outerRadius, setOuterRadius] = React.useState(75);
  const [searchLoading, setSearchLoading] = React.useState(false);
  const [trendingLoading, setTrendingLoading] = React.useState(false);
  const [searchResults, setSearchResults] = React.useState<
    { id: string; name: string; symbol: string; thumb?: string }[]
  >([]);
  const [trendingResults, setTrendingResults] = React.useState<
    { id: string; name: string; symbol: string; thumb?: string }[]
  >([]);


  const [currentPage, setCurrentPage] = React.useState(1);
  const pageSize = 10;
  const totalPages = Math.max(1, Math.ceil(tokens.length / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedTokens = tokens.slice(startIndex, endIndex);

  React.useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [tokens.length, totalPages, currentPage]);

  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setOuterRadius(56);
      } else if (window.innerWidth >= 820 && window.innerWidth <= 875) {
         setOuterRadius(60);
      } else {
        setOuterRadius(70);
      }
    }
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  React.useEffect(() => {
    if (tokens.length === 0) {
      dispatch(setTokens(mockTokens));
    }
  }, [dispatch, tokens.length]);

  // Auto-refresh prices periodically
  React.useEffect(() => {
    const interval = window.setInterval(() => {
      dispatch(refreshPricesFromCoinGecko());
    }, 60_000);
    return () => window.clearInterval(interval);
  }, [dispatch]);

  const portfolioTotal = tokens.reduce(
    (sum, token) => sum + token.holdings * token.price,
    0
  );

  const portfolioData = tokens?.filter((token) => token.holdings > 0)?.map((token) => ({
      name: `${token.name} (${token.symbol})`,
      value: token.holdings * token.price,
      percentage: portfolioTotal > 0 ? ((token.holdings * token.price) / portfolioTotal) * 100 : 0,
    }));

  const handleRefreshPrices = () => {
    // Try CoinGecko-backed refresh first; fallback to simulation
    dispatch(refreshPricesFromCoinGecko()).unwrap().catch(() => dispatch(refreshPrices()));
  };

  const handleRemoveToken = (tokenId: string) => {
    dispatch(removeToken(tokenId));
  };

  const handleEditHoldings = (tokenId: string) => {
    setEditingTokenId(tokenId);
  };

  const openAddModal = () => {
    setSelectedIds([]);
    setSearch("");
    setIsAddModalOpen(true);
    // Load trending on open
    void fetchTrending();
  };

  const closeAddModal = () => setIsAddModalOpen(false);

  const handleConfirmAdd = async () => {
    if (selectedIds.length === 0) return;
    try {
      // Fetch market data for selected ids from CoinGecko
      const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${encodeURIComponent(
        selectedIds.join(",")
      )}&sparkline=true&price_change_percentage=24h`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch market data");
      const data: Array<{
        id: string;
        symbol: string;
        name: string;
        image: string;
        current_price: number;
        price_change_percentage_24h: number;
        sparkline_in_7d?: { price: number[] };
      }> = await res.json();

      data?.forEach((d) => {
        const token: Token = {
          id: d.id,
          coingeckoId: d.id,
          icon: d.image,
          name: d.name,
          symbol: d.symbol.toUpperCase(),
          price: d.current_price,
          change24h: d.price_change_percentage_24h ?? 0,
          sparklineData: d.sparkline_in_7d?.price?.slice(-7) ?? [],
          holdings: 0,
        };
        dispatch(addToken(token));
      });
    } catch {
      // silent failover
    } finally {
      setIsAddModalOpen(false);
    }
  };

  const existingIds = new Set(tokens.map((t) => t.id));

  // CoinGecko search/trending helpers
  const fetchTrending = async () => {
    const controller = new AbortController();
    try {
      setTrendingLoading(true);
      const res = await fetch("https://api.coingecko.com/api/v3/search/trending", { signal: controller.signal });
      if (!res.ok) throw new Error("CG trending failed");
      const data: {
        coins: Array<{ item: { id: string; name: string; symbol: string; thumb: string } }>;
      } = await res.json();
      const mapped = data.coins.map((c) => ({
        id: c.item.id,
        name: c.item.name,
        symbol: c.item.symbol,
        thumb: c.item.thumb,
      }));
      setTrendingResults(mapped);
    } catch (err: any) {
      if (err.name === "AbortError") {
        // aborted
      } else {
        setTrendingResults([]);
      }
    } finally {
      setTrendingLoading(false);
    }
    return () => controller.abort();
  };

  // Search logic: uses debouncedSearch, AbortController, and a min-length guard
  React.useEffect(() => {
    // Guard: don't search for empty or very short queries
    if (!debouncedSearch || debouncedSearch.trim().length < 3) {
      setSearchResults([]);
      setSearchLoading(false);
      return;
    }

    let active = true;
    const controller = new AbortController();

    const doSearch = async () => {
      try {
        setSearchLoading(true);
        const res = await fetch(
          `https://api.coingecko.com/api/v3/search?query=${encodeURIComponent(debouncedSearch)}`,
          { signal: controller.signal }
        );
        if (!res.ok) throw new Error("CG search failed");
        const data: { coins: Array<{ id: string; name: string; symbol: string; thumb: string }> } =
          await res.json();
        if (!active) return;
        const mapped = data.coins.map((c) => ({
          id: c.id,
          name: c.name,
          symbol: c.symbol,
          thumb: c.thumb,
        }));
        setSearchResults(mapped);
      } catch (err: any) {
        if (err.name === "AbortError") {
          // aborted — do nothing
        } else {
          if (active) setSearchResults([]);
        }
      } finally {
        if (active) setSearchLoading(false);
      }
    };

    void doSearch();

    return () => {
      active = false;
      controller.abort();
    };
  }, [debouncedSearch]);

  return (
    <div className="flex flex-col items-start gap-6 md:gap-12 w-full">
      <Card className="w-full bg-darkbackgroundsbg-component rounded-xl border-0 relative">
        <CardContent className="flex flex-col md:flex-row items-start gap-4 md:gap-[19px] p-4 md:p-6">
          <div className="flex flex-col items-start justify-between flex-1 w-full">
            <div className="flex flex-col items-start gap-3 md:gap-5 flex-1 w-full">
              <div className="text-[#A1A1AA] text-sm md:text-base">Portfolio Total</div>

              <div className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
                $
                {portfolioTotal?.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>

              <div className="flex h-auto md:h-[128px] items-end justify-start w-full gap-2.5">
                <div className="text-[#A1A1AA] text-sm md:text-base">
                  Last updated: {lastUpdated}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-start gap-4 md:gap-5 flex-1 w-full">
            <div className="text-[#A1A1AA] text-sm md:text-base text-left md:text-left w-full">Portfolio Breakdown</div>

            <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-5 w-full">
              <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-56 md:h-56 flex items-center justify-center self-center md:self-auto">
                <PortfolioDonutChart width="100%" height="100%" innerRadius={32} outerRadius={outerRadius} />
              </div>

              <div className="flex flex-row items-start justify-between w-full gap-4">
                <div className="flex flex-col items-start justify-center gap-2 md:gap-4 flex-1">
                  {portfolioData.map((item, index) => (
                    <div
                      key={index}
                      style={{ color: COLORS[index % COLORS.length] }}
                    >
                      {item.name}
                    </div>
                  ))}
                </div>

                <div className="flex flex-col items-end justify-start gap-2 md:gap-4">
                  {portfolioData?.map((item, index) => (
                    <div key={index} className="text-[#A1A1AA]">
                      {item.percentage.toFixed(1)}%
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col items-start gap-4 w-full">
        <div className="flex flex-row items-center gap-2 w-full flex-nowrap">
          <div className="flex items-center gap-1 flex-1 min-w-0">
            <StarIcon className="w-7 h-7" fill="#A9E851" />
            <div className="text-zinc-400 text-lg md:text-xl truncate">Watchlist</div>
          </div>

          <div className="ml-auto flex items-center gap-2 justify-end flex-nowrap">
            <Button
              variant="ghost"
              className="bg-[#ffffff0a] rounded-md hover:scale-110 cursor-pointer flex items-center justify-center gap-1.5 h-8 w-8 p-0 md:h-auto md:w-auto md:px-3 md:py-2"
              onClick={handleRefreshPrices}
              disabled={isLoading}
            >
              <RefreshCwIcon
                className={`w-[15px] h-[15px] ${
                  isLoading ? "animate-spin" : "text-zinc-400"
                }`}
              />
              <span className="hidden md:inline font-medium text-zinc-100 text-sm [font-family:'Inter',Helvetica] tracking-[0] leading-5 whitespace-nowrap hover:text-zinc-700">
                {isLoading ? "Refreshing..." : "Refresh Prices"}
              </span>
            </Button>

            <Button
              variant="ghost"
              className="px-3 py-2 bg-[#a9e851] rounded-md shadow-[0px_0px_0px_1px_#1f6619,0px_1px_2px_#1f661966,inset_0px_0.75px_0px_#ffffff33] h-auto gap-1.5 cursor-pointer"
              onClick={openAddModal}
            >
              <PlusIcon className="w-[15px] h-[15px]" />
              <span className="font-medium text-darkforegroundsfg-on-inverted text-xs sm:text-sm [font-family:'Inter',Helvetica] tracking-[0] leading-5 whitespace-nowrap">
                Add Token
              </span>
            </Button>
          </div>
        </div>

        <div className="flex flex-col items-start w-full rounded-xl overflow-hidden border border-solid border-[#ffffff14]">
          <div className="w-full overflow-x-auto">
          <Table className="min-w-[640px] md:min-w-full">
            <TableHeader className="h-12 bg-zinc-800">
              <TableRow className="border-0">
                <TableHead className="pl-3 md:pl-6 pr-6 md:pr-16 py-0 text-zinc-400">
                  Token
                </TableHead>
                <TableHead className="text-zinc-400">Price</TableHead>
                <TableHead className="text-zinc-400 hidden md:table-cell">24h %</TableHead>
                <TableHead className="text-zinc-400 hidden lg:table-cell">Sparkline (7d)</TableHead>
                <TableHead className="text-zinc-400 hidden md:table-cell">Holdings</TableHead>
                <TableHead className="text-zinc-400">Value</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="px-0 py-3">
              {paginatedTokens.map((token, index) => (
                <TableRow
                  key={index}
                  className={`h-12 ${
                    index % 2 === 0
                      ? "bg-[#212124]"
                      : "bg-darkbackgroundsbg-base-hover"
                  } border-0`}
                >
                  <TableCell className="px-3 md:px-6 py-0">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded border-[0.5px] border-solid border-[#ffffff1a]"
                        style={{
                          background: `url(${token.icon}) 50% 50% / cover`,
                        }}
                      />
                      <div className="flex items-center flex-1">
                        <div>
                          <span className="text-zinc-100">{token.name} </span>
                          <span className="text-zinc-400">
                            ({token.symbol})
                          </span>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-3 md:px-6 py-0">
                    <div className="text-zinc-400">
                      $
                      {token.price.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </div>
                  </TableCell>
                  <TableCell className="px-3 md:px-6 py-0 hidden md:table-cell">
                    <div
                      className={` ${
                        token.change24h >= 0 ? "text-green-400" : "text-red-400"
                      }`}>
                      {token.change24h >= 0 ? "+" : ""}
                      {token.change24h.toFixed(2)}%
                    </div>
                  </TableCell>
                  <TableCell className="px-3 md:px-6 py-0 hidden lg:table-cell">
                    <div className="w-20 h-8">
                      <MiniSparkline
                        data={token.sparklineData}
                        isPositive={token.change24h >= 0}
                      />
                    </div>
                  </TableCell>
                  <TableCell className="px-3 md:px-6 py-0 hidden md:table-cell">
                    <EditableCell
                      tokenId={token.id}
                      value={token.holdings}
                      isEditing={editingTokenId === token.id}
                      onSave={() => setEditingTokenId(null)}
                      onCancel={() => setEditingTokenId(null)}
                    />
                  </TableCell>
                  <TableCell className="px-3 md:px-6 py-0">
                    <div className="text-zinc-100">
                      $
                      {(token.holdings * token.price).toLocaleString(
                        undefined,
                        { minimumFractionDigits: 2, maximumFractionDigits: 2 }
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="px-3 md:px-6 py-0">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
                          <MoreHorizontalIcon className="w-[15px] h-[15px]" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="bg-zinc-800 border-zinc-700"
                      >
                        <DropdownMenuItem
                          onClick={() => handleEditHoldings(token.id)}
                          className="text-zinc-400 hover:text-red-300 hover:bg-zinc-700 cursor-pointer"
                        >
                          <Edit2Icon className="w-4 h-4 mr-2" />
                          Edit Holdings
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleRemoveToken(token.id)}
                          className="text-red-400 hover:text-red-300 hover:bg-zinc-700 cursor-pointer"
                        >
                          <TrashIcon className="w-4 h-4 mr-2 text-red-400 " />
                          Remove
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </div>

          <div className="flex flex-col gap-3 md:flex-row md:justify-between md:items-center p-4 w-full">
            <div className="inline-flex items-center gap-1 px-2 py-1 rounded-md">
              <div className="text-zinc-400">{Math.max(0, Math.min(pageSize, tokens.length - startIndex))}</div>
              <MinusIcon className="w-[15px] h-[15px]" />
              <div className="text-zinc-400">
                {Math.max(0, Math.min(pageSize, tokens.length - startIndex))} of {tokens.length} results
              </div>
            </div>
            <div className="inline-flex items-center justify-end gap-2">
              <div className="px-2 py-1 rounded-md inline-flex items-center justify-center gap-1.5 overflow-hidden">
                <div className="text-zinc-400">
                  {currentPage} of {totalPages} pages
                </div>
              </div>

              <Button
                variant="ghost"
                className={`px-2 py-1 rounded-md shadow-light-buttons-neutral h-auto gap-1.5 ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              >
                <div className="text-zinc-600">Prev</div>
              </Button>

              <Button
                variant="ghost"
                className={`px-2 py-1 rounded-md h-auto gap-1.5 ${currentPage === totalPages || tokens.length === 0 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                disabled={currentPage === totalPages || tokens.length === 0}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              >
                <div className="text-zinc-400">Next</div>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Add Token Modal */}
      <ModalSection
        open={isAddModalOpen}
        onClose={closeAddModal}
        title={
          <div className="flex items-center gap-2 flex-1 bg-[#2a2a2e] rounded-md px-3 py-2">
            <SearchIcon className="w-4 h-4 text-zinc-400" />
            <input
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tokens (e.g., ETH, SOL)…"
              className="bg-transparent outline-none text-sm text-zinc-100 placeholder:text-zinc-500 flex-1"
            />
          </div>
        }
        footer={
          <Button
            variant="ghost"
            className={`px-3 py-2 rounded-md cursor-pointer h-auto gap-1.5 ${
              selectedIds.length === 0
                ? "bg-[#3a3a3f] text-zinc-500"
                : "bg-[#a9e851] text-black"
            }`}
            disabled={selectedIds.length === 0}
            onClick={handleConfirmAdd}
          >
            Add to Watchlist
          </Button>
        }
      >
        <div className="py-1">
          {debouncedSearch.trim().length >= 3 ? (
            searchLoading ? (
              <div className="px-4 py-6 text-center text-zinc-500 text-sm">Searching…</div>
            ) : searchResults.length === 0 ? (
              <div className="px-4 py-6 text-center text-zinc-500 text-sm">No tokens found.</div>
            ) : (
              searchResults.map((t) => {
                const alreadyAdded = existingIds.has(t.id);
                const selected = selectedIds.includes(t.id);
                return (
                  <button
                    key={t.id}
                    onClick={() => {
                      if (alreadyAdded) return; // prevent selecting already-added tokens
                      setSelectedIds((prev) =>
                        prev.includes(t.id)
                          ? prev.filter((x) => x !== t.id)
                          : [...prev, t.id]
                      );
                    }}
                    className={`w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-[#26262a] ${
                      selected ? "bg-[#25331c]" : ""
                    }`}
                  >
                    <div
                      className="w-8 h-8 rounded border-[0.5px] border-solid border-[#ffffff1a]"
                      style={{ background: `url(${t.thumb}) 50% 50% / cover` }}
                    />
                    <div className="flex-1">
                      <div className="text-zinc-100 text-sm">
                        {t.name} <span className="text-zinc-400">({t.symbol.toUpperCase()})</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <StarIcon
                        className="w-4 h-4 cursor-pointer"
                        color={selected ? "#a9e851" : "#52525b"}
                        fill={selected ? "#a9e851" : "transparent"}
                      />
                      {alreadyAdded ? (
                        <span className="text-xs text-zinc-500">Added</span>
                      ) : selected ? (
                        <CircleIcon fill="#a9e851" className="w-5 h-5 cursor-pointer text-[#a9e851]" />
                      ) : (
                        <CircleIcon className="w-5 h-5 text-zinc-500 cursor-pointer" />
                      )}
                    </div>
                  </button>
                );
              })
            )
          ) : (
            <>
              {search.length > 0 ? (
                <div className="px-4 pt-2 text-zinc-500 text-xs">Type at least 3 characters to search</div>
              ) : null}
              <div className="px-4 py-2 text-zinc-400 text-xs uppercase tracking-wider">Trending</div>
              {trendingLoading ? (
                <div className="px-4 py-6 text-center text-zinc-500 text-sm">Loading trending…</div>
              ) : trendingResults.length === 0 ? (
                <div className="px-4 py-6 text-center text-zinc-500 text-sm">No trending tokens</div>
              ) : (
                trendingResults.map((t) => {
                  const alreadyAdded = existingIds.has(t.id);
                  const selected = selectedIds.includes(t.id);
                  return (
                    <button
                      key={t.id}
                      onClick={() => {
                        if (alreadyAdded) return;
                        setSelectedIds((prev) =>
                          prev.includes(t.id)
                            ? prev.filter((x) => x !== t.id)
                            : [...prev, t.id]
                        );
                      }}
                      className={`w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-[#26262a] ${
                        selected ? "bg-[#25331c]" : ""
                      }`}
                    >
                      <div
                        className="w-8 h-8 rounded border-[0.5px] border-solid border-[#ffffff1a]"
                        style={{ background: `url(${t.thumb}) 50% 50% / cover` }}
                      />
                      <div className="flex-1">
                        <div className="text-zinc-100 text-sm">
                          {t.name} <span className="text-zinc-400">({t.symbol.toUpperCase()})</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <StarIcon
                          className="w-4 h-4"
                          color={selected ? "#a9e851" : "#52525b"}
                          fill={selected ? "#a9e851" : "transparent"}
                        />
                        {alreadyAdded ? (
                          <span className="text-xs text-zinc-500">Added</span>
                        ) : selected ? (
                          <CircleIcon fill="#a9e851" className="w-5 h-5 text-[#a9e851]" />
                        ) : (
                          <CircleIcon className="w-5 h-5 text-zinc-500" />
                        )}
                      </div>
                    </button>
                  );
                })
              )}
            </>
          )}
        </div>
      </ModalSection>
    </div>
  );
};
