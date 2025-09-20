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
import { refreshPrices, removeToken, setTokens, addToken, type Token } from "../../../../store/slices/portfolioSlice";
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

export const WatchlistSection = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const { tokens, lastUpdated, isLoading } = useAppSelector(
    (state) => state.portfolio
  );

  const [editingTokenId, setEditingTokenId] = React.useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);

  React.useEffect(() => {
    if (tokens.length === 0) {
      dispatch(setTokens(mockTokens));
    }
  }, [dispatch, tokens.length]);

  const portfolioTotal = tokens.reduce(
    (sum, token) => sum + token.holdings * token.price,
    0
  );

  const portfolioData = tokens
    .filter((token) => token.holdings > 0)
    .map((token) => ({
      name: `${token.name} (${token.symbol})`,
      value: token.holdings * token.price,
      percentage:
        portfolioTotal > 0
          ? ((token.holdings * token.price) / portfolioTotal) * 100
          : 0,
    }));

  const handleRefreshPrices = () => {
    dispatch(refreshPrices());
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
  };

  const closeAddModal = () => setIsAddModalOpen(false);

  const handleConfirmAdd = () => {
    setIsAddModalOpen(false);
  };

  const existingIds = new Set(tokens.map((t) => t.id));
  const catalogTokens: Token[] = mockTokens as Token[];
  const filteredCatalog = catalogTokens.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.symbol.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col items-start gap-12 w-full">
      <Card className="w-full bg-darkbackgroundsbg-component rounded-xl border-0 relative">
        <CardContent className="flex items-start gap-[19px] p-6">
          <div className="flex flex-col items-start justify-between flex-1">
            <div className="flex flex-col items-start gap-5 flex-1">
              <div className="text-[#A1A1AA]">Portfolio Total</div>

              <div className="text-white text-6xl">
                $
                {portfolioTotal?.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>

              <div className="flex h-[128px] items-end justify-start w-full gap-2.5">
                <div className="text-[#A1A1AA]">
                  Last updated: {lastUpdated}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-start gap-5 flex-1">
            <div className="text-[#A1A1AA] ">Portfolio Breakdown</div>

            <div className="flex items-start gap-5 w-full">
              <PortfolioDonutChart />

              <div className="flex flex-col items-start justify-center gap-4 flex-1">
                {portfolioData.map((item, index) => (
                  <div
                    key={index}
                    style={{ color: COLORS[index % COLORS.length] }}
                  >
                    {item.name}
                  </div>
                ))}
              </div>

              <div className="flex flex-col items-start justify-end gap-4">
                {portfolioData?.map((item, index) => (
                  <div key={index} className="text-[#A1A1AA]">
                    {item.percentage.toFixed(1)}%
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col items-start gap-4 w-full">
        <div className="flex items-center gap-3 w-full">
          <div className="flex items-center gap-1 flex-1">
            <StarIcon className="w-7 h-7" fill="#A9E851" />
            <div className="text-zinc-400">Watchlist</div>
          </div>

          <Button
            variant="ghost"
            className="px-3 py-2 bg-[#ffffff0a] rounded-md h-auto gap-1.5 hover:scale-110 cursor-pointer"
            onClick={handleRefreshPrices}
            disabled={isLoading}
          >
            <RefreshCwIcon
              className={`w-[15px] h-[15px] ${
                isLoading ? "animate-spin" : "text-zinc-400"
              }`}
            />
            <span className="font-medium text-zinc-100 text-sm [font-family:'Inter',Helvetica] tracking-[0] leading-5 whitespace-nowrap hover:text-zinc-700">
              {isLoading ? "Refreshing..." : "Refresh Prices"}
            </span>
          </Button>

          <Button
            variant="ghost"
            className="px-3 py-2 bg-[#a9e851] rounded-md shadow-[0px_0px_0px_1px_#1f6619,0px_1px_2px_#1f661966,inset_0px_0.75px_0px_#ffffff33] h-auto gap-1.5 cursor-pointer"
            onClick={openAddModal}
          >
            <PlusIcon className="w-[15px] h-[15px]" />
            <span className="font-medium text-darkforegroundsfg-on-inverted text-sm [font-family:'Inter',Helvetica] tracking-[0] leading-5 whitespace-nowrap">
              Add Token
            </span>
          </Button>
        </div>

        <div className="flex flex-col items-start w-full rounded-xl overflow-hidden border border-solid border-[#ffffff14]">
          <Table>
            <TableHeader className="h-12 bg-zinc-800">
              <TableRow className="border-0">
                <TableHead className="pl-6 pr-16 py-0 text-zinc-400">
                  Token
                </TableHead>
                <TableHead className="text-zinc-400">Price</TableHead>
                <TableHead className="text-zinc-400">24h %</TableHead>
                <TableHead className="text-zinc-400">Sparkline (7d)</TableHead>
                <TableHead className="text-zinc-400">Holdings</TableHead>
                <TableHead className="text-zinc-400">Value</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="px-0 py-3">
              {tokens.map((token, index) => (
                <TableRow
                  key={index}
                  className={`h-12 ${
                    index % 2 === 0
                      ? "bg-[#212124]"
                      : "bg-darkbackgroundsbg-base-hover"
                  } border-0`}
                >
                  <TableCell className="px-6 py-0">
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
                  <TableCell className="px-6 py-0">
                    <div className="text-zinc-400">
                      $
                      {token.price.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-0">
                    <div
                      className={` ${
                        token.change24h >= 0 ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {token.change24h >= 0 ? "+" : ""}
                      {token.change24h.toFixed(2)}%
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-0">
                    <div className="w-20 h-8">
                      <MiniSparkline
                        data={token.sparklineData}
                        isPositive={token.change24h >= 0}
                      />
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-0">
                    <EditableCell
                      tokenId={token.id}
                      value={token.holdings}
                      isEditing={editingTokenId === token.id}
                      onSave={() => setEditingTokenId(null)}
                      onCancel={() => setEditingTokenId(null)}
                    />
                  </TableCell>
                  <TableCell className="px-6 py-0">
                    <div className="text-zinc-100">
                      $
                      {(token.holdings * token.price).toLocaleString(
                        undefined,
                        { minimumFractionDigits: 2, maximumFractionDigits: 2 }
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-0">
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

          <div className="flex justify-between items-center p-4 w-full">
            <div className="inline-flex items-center gap-1 px-2 py-1 rounded-md">
              <div className="text-zinc-400">{Math.min(10, tokens.length)}</div>
              <MinusIcon className="w-[15px] h-[15px]" />
              <div className="text-zinc-400">
                {Math.min(10, tokens.length)} of {tokens.length} results
              </div>
            </div>
            <div className="inline-flex items-center justify-end gap-2">
              <div className="px-2 py-1 rounded-md inline-flex items-center justify-center gap-1.5 overflow-hidden">
                <div className="text-zinc-400">
                  1 of {Math.ceil(tokens.length / 10)} pages
                </div>
              </div>

              <Button
                variant="ghost"
                className="px-2 py-1 rounded-md shadow-light-buttons-neutral h-auto gap-1.5 cursor-pointer"
              >
                <div className="text-zinc-600">Prev</div>
              </Button>

              <Button
                variant="ghost"
                className="px-2 py-1 rounded-md h-auto gap-1.5 cursor-pointer"
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
          {filteredCatalog.length === 0 ? (
            <div className="px-4 py-6 text-center text-zinc-500 text-sm">
              No tokens found.
            </div>
          ) : (
            filteredCatalog.map((t) => {
              const alreadyAdded = existingIds.has(t.id);
              const selected = selectedIds.includes(t.id) || alreadyAdded;
              return (
                <button
                  key={t.id}
                  onClick={() => {
                    if (alreadyAdded) {
                      // remove immediately
                      dispatch(removeToken(t.id));
                      setSelectedIds((prev) => prev.filter((x) => x !== t.id));
                    } else {
                      // add immediately
                      dispatch(addToken(t as Token));
                      setSelectedIds((prev) =>
                        prev.includes(t.id) ? prev : [...prev, t.id]
                      );
                    }
                  }}
                  className={`w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-[#26262a] ${
                    selected ? "bg-[#25331c]" : ""
                  }`}
                >
                  <div
                    className="w-8 h-8 rounded border-[0.5px] border-solid border-[#ffffff1a]"
                    style={{ background: `url(${t.icon}) 50% 50% / cover` }}
                  />
                  <div className="flex-1">
                    <div className="text-zinc-100 text-sm">
                      {t.name} <span className="text-zinc-400">({t.symbol})</span>
                    </div>
                  </div>
                  {/* star + radio indicator */}
                  <div className="flex items-center gap-2">
                    <StarIcon
                      className="w-4 h-4 cursor-pointer"
                      color={selected ? "#a9e851" : "#52525b"}
                      fill={selected ? "#a9e851" : "transparent"}
                    />
                    {selected ? (
                      <CircleIcon fill="#a9e851" className="w-5 h-5 text-[#a9e851] cursor-pointer" />
                    ) : (
                      <CircleIcon className="w-5 h-5 text-zinc-500 cursor-pointer" />
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>
      </ModalSection>
    </div>
  );
};
