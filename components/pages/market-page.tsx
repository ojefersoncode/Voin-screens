"use client";

import { useState, useEffect } from "react";
import {
  Home,
  BarChart2,
  Repeat,
  Wallet,
  User,
  Search,
  ArrowUp,
  ArrowDown,
  Menu,
  Star,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { LineChart, Line, ResponsiveContainer } from "recharts";

// Tipo para os dados da API da Binance
interface CryptoData {
  symbol: string;
  priceChange: string;
  priceChangePercent: string;
  lastPrice: string;
  volume: string;
  quoteVolume: string;
  highPrice: string;
  lowPrice: string;
}

// Tipo para os dados formatados das criptomoedas
interface FormattedCrypto {
  symbol: string;
  name: string;
  price: number;
  priceChangePercent: number;
  volume: number;
  marketCap?: number;
  logo: string;
  chartData: { value: number }[];
  favorite: boolean;
}

// Mapeamento de símbolos para nomes completos e logos
const cryptoInfo: Record<string, { name: string; logo: string }> = {
  BTCUSDT: { name: "Bitcoin", logo: "₿" },
  ETHUSDT: { name: "Ethereum", logo: "Ξ" },
  BNBUSDT: { name: "Binance Coin", logo: "BNB" },
  USDTUSDT: { name: "Tether", logo: "₮" },
  USDCUSDT: { name: "USD Coin", logo: "USDC" },
  SOLUSDT: { name: "Solana", logo: "SOL" },
  XRPUSDT: { name: "Ripple", logo: "XRP" },
  TRXUSDT: { name: "TRON", logo: "TRX" },
  ADAUSDT: { name: "Cardano", logo: "ADA" },
  PEPEUSDT: { name: "Pepe", logo: "PEPE" },
  TONUSDT: { name: "Toncoin", logo: "TON" },
  DOGEUSDT: { name: "Dogecoin", logo: "DOGE" },
  LINKUSDT: { name: "Chainlink", logo: "LINK" },
  LTCUSDT: { name: "Litecoin", logo: "LTC" },
  NEARUSDT: { name: "NEAR Protocol", logo: "NEAR" },
};

// Lista de símbolos que queremos exibir
const targetSymbols = [
  "BTCUSDT",
  "ETHUSDT",
  "USDTUSDT",
  "BNBUSDT",
  "USDCUSDT",
  "SOLUSDT",
  "XRPUSDT",
  "TRXUSDT",
  "ADAUSDT",
  "PEPEUSDT",
  "TONUSDT",
  "DOGEUSDT",
  "LINKUSDT",
  "LTCUSDT",
  "NEARUSDT",
];

// Função para gerar dados de gráfico aleatórios (para demonstração)
const generateChartData = (priceChangePercent: number) => {
  const data = [];
  let value = 100;
  const trend = priceChangePercent > 0 ? 1 : -1;

  for (let i = 0; i < 20; i++) {
    // Adiciona alguma aleatoriedade, mas mantém a tendência geral
    const change = Math.random() * 5 * trend + (Math.random() * 2 - 1);
    value += change;
    data.push({ value: Math.max(value, 10) });
  }

  return data;
};

export default function MarketPage() {
  const [activeTab, setActiveTab] = useState("market");
  const [marketTab, setMarketTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("marketCap");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [cryptoData, setCryptoData] = useState<FormattedCrypto[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Função para navegar para a página da carteira
  const navigateToWallet = () => {
    router.push("/voin-wallet");
  };

  // Função para navegar para a página de perfil
  const navigateToProfile = () => {
    router.push("/profile");
  };

  // Buscar dados da API da Binance
  useEffect(() => {
    const fetchCryptoData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "https://api.binance.com/api/v3/ticker/24hr"
        );
        const data: CryptoData[] = await response.json();

        // Filtrar apenas as criptomoedas que queremos exibir
        const filteredData = data.filter((item) =>
          targetSymbols.includes(item.symbol)
        );

        // Formatar os dados
        const formattedData: FormattedCrypto[] = filteredData.map((item) => {
          const info = cryptoInfo[item.symbol] || {
            name: item.symbol,
            logo: item.symbol.substring(0, 1),
          };

          return {
            symbol: item.symbol.replace("USDT", ""),
            name: info.name,
            price: Number.parseFloat(item.lastPrice),
            priceChangePercent: Number.parseFloat(item.priceChangePercent),
            volume: Number.parseFloat(item.quoteVolume),
            marketCap: Number.parseFloat(item.quoteVolume) * 0.5, // Estimativa simplificada para demonstração
            logo: info.logo,
            chartData: generateChartData(
              Number.parseFloat(item.priceChangePercent)
            ),
            favorite: false,
          };
        });

        setCryptoData(formattedData);
        setLoading(false);
      } catch (error) {
        console.error("Erro ao buscar dados da API:", error);
        // Dados de fallback em caso de erro na API
        const fallbackData: FormattedCrypto[] = targetSymbols.map((symbol) => {
          const info = cryptoInfo[symbol] || {
            name: symbol,
            logo: symbol.substring(0, 1),
          };
          const randomPrice = Math.random() * 10000;
          const randomChange = Math.random() * 10 - 5;

          return {
            symbol: symbol.replace("USDT", ""),
            name: info.name,
            price: randomPrice,
            priceChangePercent: randomChange,
            volume: randomPrice * 1000000,
            marketCap: randomPrice * 10000000,
            logo: info.logo,
            chartData: generateChartData(randomChange),
            favorite: false,
          };
        });

        setCryptoData(fallbackData);
        setLoading(false);
      }
    };

    fetchCryptoData();

    // Atualizar dados a cada 30 segundos
    const interval = setInterval(fetchCryptoData, 30000);
    return () => clearInterval(interval);
  }, []);

  // Função para alternar favorito
  const toggleFavorite = (symbol: string) => {
    setCryptoData((prev) =>
      prev.map((crypto) =>
        crypto.symbol === symbol
          ? { ...crypto, favorite: !crypto.favorite }
          : crypto
      )
    );
  };

  // Filtrar e ordenar os dados
  const filteredAndSortedData = cryptoData
    .filter((crypto) => {
      if (marketTab === "favorites" && !crypto.favorite) return false;
      if (
        searchQuery &&
        !crypto.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !crypto.symbol.toLowerCase().includes(searchQuery.toLowerCase())
      )
        return false;
      return true;
    })
    .sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "price":
          comparison = a.price - b.price;
          break;
        case "priceChangePercent":
          comparison = a.priceChangePercent - b.priceChangePercent;
          break;
        case "volume":
          comparison = a.volume - b.volume;
          break;
        case "marketCap":
          comparison = (a.marketCap || 0) - (b.marketCap || 0);
          break;
        default:
          comparison = (a.marketCap || 0) - (b.marketCap || 0);
      }

      return sortDirection === "asc" ? comparison : -comparison;
    });

  return (
    <div className="min-h-screen bg-[#050a1c] text-white flex flex-col">
      {/* Header */}
      <header className="p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
            <span className="text-white font-bold">V</span>
          </div>
          <span className="font-bold text-xl">VOIN</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="text-white bg-green-500 rounded-md"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </header>

      <div className="flex-1 p-4 pb-24">
        <h2 className="text-2xl font-bold mb-6">Mercado</h2>

        {/* Tabs para filtrar por categoria */}
        <Tabs
          defaultValue="all"
          value={marketTab}
          onValueChange={setMarketTab}
          className="w-full mb-6"
        >
          <TabsList className="bg-[#0a1530] w-full justify-start">
            <TabsTrigger value="all">Todas</TabsTrigger>
            <TabsTrigger value="favorites">Favoritas</TabsTrigger>
            <TabsTrigger value="gainers">Em Alta</TabsTrigger>
            <TabsTrigger value="losers">Em Baixa</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Barra de pesquisa */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar criptomoeda..."
            className="pl-10 bg-[#0a1530] border-none text-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Cabeçalho da tabela com opções de ordenação */}
        <div className="grid grid-cols-12 gap-2 px-4 py-3 bg-[#0a1530] rounded-t-xl text-sm text-gray-400">
          <div
            className="col-span-5 flex items-center gap-1 cursor-pointer"
            onClick={() => {
              setSortBy("name");
              setSortDirection(
                sortBy === "name" && sortDirection === "desc" ? "asc" : "desc"
              );
            }}
          >
            Criptomoeda
            {sortBy === "name" &&
              (sortDirection === "desc" ? (
                <ArrowDown className="h-3 w-3" />
              ) : (
                <ArrowUp className="h-3 w-3" />
              ))}
          </div>
          <div
            className="col-span-3 text-right cursor-pointer"
            onClick={() => {
              setSortBy("price");
              setSortDirection(
                sortBy === "price" && sortDirection === "desc" ? "asc" : "desc"
              );
            }}
          >
            Preço
            {sortBy === "price" &&
              (sortDirection === "desc" ? (
                <ArrowDown className="h-3 w-3 inline" />
              ) : (
                <ArrowUp className="h-3 w-3 inline" />
              ))}
          </div>
          <div
            className="col-span-2 text-right cursor-pointer"
            onClick={() => {
              setSortBy("priceChangePercent");
              setSortDirection(
                sortBy === "priceChangePercent" && sortDirection === "desc"
                  ? "asc"
                  : "desc"
              );
            }}
          >
            24h
            {sortBy === "priceChangePercent" &&
              (sortDirection === "desc" ? (
                <ArrowDown className="h-3 w-3 inline" />
              ) : (
                <ArrowUp className="h-3 w-3 inline" />
              ))}
          </div>
          <div className="col-span-2 text-right">Gráfico</div>
        </div>

        {/* Lista de criptomoedas */}
        <div className="rounded-b-xl overflow-hidden">
          {loading ? (
            // Esqueletos de carregamento
            Array(10)
              .fill(0)
              .map((_, index) => (
                <div
                  key={index}
                  className="grid grid-cols-12 gap-2 px-4 py-4 bg-[#0a1530] border-t border-[#1a2a4a]"
                >
                  <div className="col-span-5 flex items-center gap-3">
                    <Skeleton className="h-8 w-8 rounded-full bg-[#1a2a4a]" />
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-16 bg-[#1a2a4a]" />
                      <Skeleton className="h-3 w-24 bg-[#1a2a4a]" />
                    </div>
                  </div>
                  <div className="col-span-3 flex flex-col items-end justify-center">
                    <Skeleton className="h-4 w-20 bg-[#1a2a4a]" />
                  </div>
                  <div className="col-span-2 flex items-center justify-end">
                    <Skeleton className="h-4 w-12 bg-[#1a2a4a]" />
                  </div>
                  <div className="col-span-2">
                    <Skeleton className="h-12 w-full bg-[#1a2a4a]" />
                  </div>
                </div>
              ))
          ) : filteredAndSortedData.length > 0 ? (
            filteredAndSortedData.map((crypto) => (
              <div
                key={crypto.symbol}
                className="grid grid-cols-12 gap-2 px-4 py-4 bg-[#0a1530] border-t border-[#1a2a4a] hover:bg-[#1a2a4a] cursor-pointer"
                onClick={() => router.push(`/crypto/${crypto.symbol}`)}
              >
                <div className="col-span-5 flex items-center gap-3">
                  <div className="relative">
                    <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-xs font-bold">
                      {crypto.logo}
                    </div>
                    <button
                      className="absolute -top-1 -right-1 text-yellow-500 bg-[#0a1530] rounded-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(crypto.symbol);
                      }}
                    >
                      <Star
                        className={`h-3 w-3 ${
                          crypto.favorite ? "fill-yellow-500" : ""
                        }`}
                      />
                    </button>
                  </div>
                  <div>
                    <div className="font-medium">{crypto.symbol}</div>
                    <div className="text-xs text-gray-400">{crypto.name}</div>
                  </div>
                </div>
                <div className="col-span-3 flex flex-col items-end justify-center">
                  <div className="font-medium">
                    $
                    {crypto.price < 1
                      ? crypto.price.toFixed(4)
                      : crypto.price.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                  </div>
                </div>
                <div className="col-span-2 flex items-center justify-end">
                  <span
                    className={
                      crypto.priceChangePercent >= 0
                        ? "text-green-500"
                        : "text-red-500"
                    }
                  >
                    {crypto.priceChangePercent >= 0 ? "+" : ""}
                    {crypto.priceChangePercent.toFixed(2)}%
                  </span>
                </div>
                <div className="col-span-2 h-12">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={crypto.chartData}>
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke={
                          crypto.priceChangePercent >= 0 ? "#00D37F" : "#ef4444"
                        }
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-[#0a1530] p-8 text-center text-gray-400 rounded-b-xl">
              Nenhuma criptomoeda encontrada.
            </div>
          )}
        </div>

        {/* Botão para ver mais */}
        <div className="mt-6 flex justify-center">
          <Button
            variant="outline"
            className="border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
          >
            Ver mais criptomoedas
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Navegação inferior (Bottom Navigation) estilo Binance */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#050a1c] border-t border-green-500/30 z-50">
        <div className="flex justify-around items-center h-16">
          <button
            className="flex flex-col items-center justify-center w-1/5 py-1 text-gray-400"
            onClick={() => router.push("/")}
          >
            <Home className="h-5 w-5 text-gray-400" />
            <span className="text-xs mt-1">Início</span>
          </button>

          <div className="flex flex-col items-center justify-center w-1/5 py-1 text-green-500 relative">
            <BarChart2 className="h-5 w-5 text-green-500" />
            <span className="text-xs mt-1">Mercado</span>
            <div className="absolute bottom-0 w-6 h-1 bg-green-500 rounded-t-full"></div>
          </div>

          <button
            className="flex flex-col items-center justify-center w-1/5 py-1 text-gray-400"
            onClick={() => router.push("/trade")}
          >
            <Repeat className="h-5 w-5 text-gray-400" />
            <span className="text-xs mt-1">Negociar</span>
          </button>

          <button
            className="flex flex-col items-center justify-center w-1/5 py-1 text-gray-400"
            onClick={navigateToWallet}
          >
            <Wallet className="h-5 w-5 text-gray-400" />
            <span className="text-xs mt-1">Carteira</span>
          </button>

          <button
            className="flex flex-col items-center justify-center w-1/5 py-1 text-gray-400"
            onClick={navigateToProfile}
          >
            <User className="h-5 w-5 text-gray-400" />
            <span className="text-xs mt-1">Perfil</span>
          </button>
        </div>
      </div>
    </div>
  );
}
