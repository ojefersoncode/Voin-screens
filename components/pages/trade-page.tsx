"use client";

import type React from "react";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Menu,
  TrendingUp,
  ArrowUp,
  ArrowDown,
  Edit3,
  Users,
  Trophy,
  Timer,
  ZoomIn,
  ZoomOut,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import NavBottom from "../HomeComponents/NavBottom";

// Tipo para os dados de velas (candlestick)
interface CandleData {
  time: number;
  timeStr: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

// Lista de pares de moedas disponíveis
const availablePairs = [
  { value: "BTCUSDT", label: "BTC/USDT" },
  { value: "ETHUSDT", label: "ETH/USDT" },
  { value: "BNBUSDT", label: "BNB/USDT" },
  { value: "USDCUSDT", label: "USDC/USDT" },
  { value: "SOLUSDT", label: "SOL/USDT" },
  { value: "XRPUSDT", label: "XRP/USDT" },
  { value: "TRXUSDT", label: "TRX/USDT" },
  { value: "ADAUSDT", label: "ADA/USDT" },
  { value: "PEPEUSDT", label: "PEPE/USDT" },
  { value: "TONUSDT", label: "TON/USDT" },
  { value: "DOGEUSDT", label: "DOGE/USDT" },
  { value: "LINKUSDT", label: "LINK/USDT" },
  { value: "LTCUSDT", label: "LTC/USDT" },
  { value: "NEARUSDT", label: "NEAR/USDT" },
];

// Mapeamento de intervalos para a API da Binance
const timeframeMap: Record<string, string> = {
  "1m": "1m",
  "5m": "5m",
  "15m": "15m",
  "1h": "1h",
  "4h": "4h",
  "1d": "1d",
};

export default function TradePage() {
  const [activeTab, setActiveTab] = useState("trade");
  const [selectedPair, setSelectedPair] = useState("BTCUSDT");
  const [selectedTimeframe, setSelectedTimeframe] = useState("1m");
  const [amount, setAmount] = useState(25000);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [timeUntilPurchase, setTimeUntilPurchase] = useState(22);
  const [timeUntilExpiration, setTimeUntilExpiration] = useState(52);
  const [candles, setCandles] = useState<CandleData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [priceChangePercent, setPriceChangePercent] = useState(0);

  // Estado para controle de zoom e pan
  const [scale, setScale] = useState(1);
  const [offsetX, setOffsetX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startDragX, setStartDragX] = useState(0);
  const [startOffsetX, setStartOffsetX] = useState(0);
  const [visibleCandleStart, setVisibleCandleStart] = useState(0);
  const [visibleCandleCount, setVisibleCandleCount] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);

  // Buscar dados da API da Binance
  const fetchCandleData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Obter dados de velas (klines)
      const interval = timeframeMap[selectedTimeframe];
      const limit = 100; // Número de velas a serem buscadas
      const klineUrl = `https://api.binance.com/api/v3/klines?symbol=${selectedPair}&interval=${interval}&limit=${limit}`;

      const klineResponse = await fetch(klineUrl);
      if (!klineResponse.ok) {
        throw new Error(
          `Erro ao buscar dados de velas: ${klineResponse.statusText}`
        );
      }

      const klineData = await klineResponse.json();

      // Obter dados de ticker para informações de preço atual e variação
      const tickerUrl = `https://api.binance.com/api/v3/ticker/24hr?symbol=${selectedPair}`;
      const tickerResponse = await fetch(tickerUrl);

      if (!tickerResponse.ok) {
        throw new Error(
          `Erro ao buscar dados de ticker: ${tickerResponse.statusText}`
        );
      }

      const tickerData = await tickerResponse.json();

      // Processar dados de velas
      const processedCandles: CandleData[] = klineData.map((kline: any) => {
        const time = kline[0];
        const date = new Date(time);
        const hours = date.getHours().toString().padStart(2, "0");
        const minutes = date.getMinutes().toString().padStart(2, "0");

        return {
          time,
          timeStr: `${hours}:${minutes}`,
          open: Number.parseFloat(kline[1]),
          high: Number.parseFloat(kline[2]),
          low: Number.parseFloat(kline[3]),
          close: Number.parseFloat(kline[4]),
          volume: Number.parseFloat(kline[5]),
        };
      });

      setCandles(processedCandles);
      setCurrentPrice(Number.parseFloat(tickerData.lastPrice));
      setPriceChangePercent(Number.parseFloat(tickerData.priceChangePercent));

      // Resetar zoom e pan quando mudar de par ou timeframe
      setScale(1);
      setOffsetX(0);
      setVisibleCandleStart(0);
      setVisibleCandleCount(processedCandles.length);

      setLoading(false);
    } catch (err) {
      console.error("Erro ao buscar dados:", err);
      setError(
        err instanceof Error ? err.message : "Erro desconhecido ao buscar dados"
      );
      setLoading(false);

      // Gerar dados de fallback em caso de erro
      generateFallbackData();
    }
  }, [selectedPair, selectedTimeframe]);

  // Gerar dados de fallback em caso de erro na API
  const generateFallbackData = () => {
    const newCandles: CandleData[] = [];
    let basePrice = selectedPair.includes("BTC")
      ? 65000
      : selectedPair.includes("ETH")
      ? 3500
      : selectedPair.includes("BNB")
      ? 600
      : 100;

    const now = new Date();
    const interval = timeframeMap[selectedTimeframe];
    const intervalMinutes = interval.includes("m")
      ? Number.parseInt(interval)
      : interval.includes("h")
      ? Number.parseInt(interval) * 60
      : interval.includes("d")
      ? Number.parseInt(interval) * 60 * 24
      : 1;

    for (let i = 99; i >= 0; i--) {
      const time = now.getTime() - i * intervalMinutes * 60 * 1000;
      const date = new Date(time);
      const hours = date.getHours().toString().padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");

      const volatility = basePrice * 0.01; // 1% de volatilidade
      const open = basePrice + (Math.random() * 2 - 1) * volatility;
      const close = open + (Math.random() * 2 - 1) * volatility;
      const high = Math.max(open, close) + Math.random() * volatility * 0.5;
      const low = Math.min(open, close) - Math.random() * volatility * 0.5;
      const volume = basePrice * (Math.random() * 100 + 50);

      newCandles.push({
        time,
        timeStr: `${hours}:${minutes}`,
        open,
        high,
        low,
        close,
        volume,
      });

      basePrice = close; // Usar o preço de fechamento como base para a próxima vela
    }

    setCandles(newCandles);
    setCurrentPrice(basePrice);
    setPriceChangePercent(Math.random() * 10 - 5); // Variação entre -5% e +5%

    // Resetar zoom e pan
    setScale(1);
    setOffsetX(0);
    setVisibleCandleStart(0);
    setVisibleCandleCount(newCandles.length);

    toast({
      title: "Usando dados simulados",
      description:
        "Não foi possível conectar à API da Binance. Exibindo dados simulados.",
      variant: "destructive",
    });
  };

  // Buscar dados quando o par ou timeframe mudar
  useEffect(() => {
    fetchCandleData();

    // Configurar atualização periódica
    const intervalId = setInterval(() => {
      fetchCandleData();
    }, 30000); // Atualizar a cada 30 segundos

    return () => clearInterval(intervalId);
  }, [selectedPair, selectedTimeframe, fetchCandleData]);

  // Função para desenhar o gráfico
  const drawChart = useCallback(() => {
    if (!canvasRef.current || candles.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Configurar o canvas para alta resolução
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, rect.width, rect.height);

    // Calcular o número de velas visíveis com base no zoom
    const totalCandles = candles.length;
    const visibleCount = Math.min(
      Math.ceil(totalCandles / scale),
      totalCandles
    );
    setVisibleCandleCount(visibleCount);

    // Calcular o índice inicial das velas visíveis com base no deslocamento
    const maxOffset = totalCandles - visibleCount;
    const normalizedOffset = Math.max(
      0,
      Math.min(maxOffset, -offsetX / (rect.width / totalCandles))
    );
    const startIdx = Math.floor(normalizedOffset);
    setVisibleCandleStart(startIdx);

    // Selecionar apenas as velas visíveis
    const visibleCandles = candles.slice(startIdx, startIdx + visibleCount);

    // Encontrar os valores mínimos e máximos para escala
    const prices = visibleCandles.flatMap((candle) => [
      candle.high,
      candle.low,
    ]);
    const minPrice = Math.min(...prices) * 0.999;
    const maxPrice = Math.max(...prices) * 1.001;
    const priceRange = maxPrice - minPrice;

    // Configurações de desenho
    const candleWidth = (rect.width / visibleCount) * 0.6;
    const spacing = (rect.width / visibleCount) * 0.4;
    const xStart = spacing / 2;

    // Desenhar linhas de grade
    ctx.strokeStyle = "#1a2a4a";
    ctx.lineWidth = 0.5;

    // Linhas horizontais
    for (let i = 0; i <= 5; i++) {
      const y = rect.height * (i / 5);
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(rect.width, y);
      ctx.stroke();

      // Adicionar valores de preço à direita
      const price = maxPrice - priceRange * (i / 5);
      ctx.fillStyle = "#8597b2";
      ctx.textAlign = "right";
      ctx.font = "10px Arial";
      ctx.fillText(price.toFixed(price < 1 ? 6 : 2), rect.width - 5, y - 5);
    }

    // Linhas verticais e marcadores de tempo
    const timeLabels = [];
    const timeStep = Math.max(1, Math.floor(visibleCount / 5));

    for (let i = 0; i < visibleCount; i += timeStep) {
      if (i < visibleCandles.length) {
        timeLabels.push({
          index: i,
          time: visibleCandles[i].timeStr,
        });
      }
    }

    timeLabels.forEach(({ index, time }) => {
      const x = xStart + index * (candleWidth + spacing) + candleWidth / 2;

      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, rect.height);
      ctx.stroke();

      // Adicionar valores de tempo abaixo
      ctx.fillStyle = "#8597b2";
      ctx.textAlign = "center";
      ctx.font = "10px Arial";
      ctx.fillText(time, x, rect.height - 5);
    });

    // Desenhar as velas
    visibleCandles.forEach((candle, i) => {
      const x = xStart + i * (candleWidth + spacing);
      const yOpen =
        rect.height - ((candle.open - minPrice) / priceRange) * rect.height;
      const yClose =
        rect.height - ((candle.close - minPrice) / priceRange) * rect.height;
      const yHigh =
        rect.height - ((candle.high - minPrice) / priceRange) * rect.height;
      const yLow =
        rect.height - ((candle.low - minPrice) / priceRange) * rect.height;

      // Determinar se é uma vela de alta (verde) ou baixa (vermelha)
      const isGreen = candle.close > candle.open;
      ctx.fillStyle = isGreen ? "#00D37F" : "#ff4d4f";
      ctx.strokeStyle = isGreen ? "#00D37F" : "#ff4d4f";

      // Desenhar o corpo da vela
      const candleHeight = Math.abs(yClose - yOpen);
      ctx.fillRect(
        x,
        isGreen ? yClose : yOpen,
        candleWidth,
        Math.max(1, candleHeight)
      );

      // Desenhar as sombras (wicks)
      ctx.beginPath();
      ctx.moveTo(x + candleWidth / 2, yHigh);
      ctx.lineTo(x + candleWidth / 2, isGreen ? yClose : yOpen);
      ctx.moveTo(x + candleWidth / 2, isGreen ? yOpen : yClose);
      ctx.lineTo(x + candleWidth / 2, yLow);
      ctx.stroke();
    });

    // Desenhar o preço atual como uma linha horizontal
    if (currentPrice >= minPrice && currentPrice <= maxPrice) {
      const yCurrentPrice =
        rect.height - ((currentPrice - minPrice) / priceRange) * rect.height;
      ctx.strokeStyle = "#00D37F";
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 3]);
      ctx.beginPath();
      ctx.moveTo(0, yCurrentPrice);
      ctx.lineTo(rect.width, yCurrentPrice);
      ctx.stroke();
      ctx.setLineDash([]);

      // Adicionar o valor do preço atual
      ctx.fillStyle = "#00D37F";
      ctx.textAlign = "right";
      ctx.font = "bold 10px Arial";
      ctx.fillText(
        currentPrice.toFixed(currentPrice < 1 ? 6 : 2),
        rect.width - 5,
        yCurrentPrice - 5
      );

      // Adicionar uma bolha de informação
      const bubbleX = rect.width * 0.8;
      const bubbleY = yCurrentPrice;
      const bubbleRadius = 20;

      ctx.beginPath();
      ctx.arc(bubbleX, bubbleY, bubbleRadius, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(0, 211, 127, 0.2)";
      ctx.fill();

      ctx.fillStyle = "#00D37F";
      ctx.textAlign = "center";
      ctx.font = "bold 10px Arial";
      ctx.fillText("500", bubbleX, bubbleY - 5);
      ctx.font = "8px Arial";
      ctx.fillText("Rp 3M", bubbleX, bubbleY + 8);
    }

    // Adicionar informação de zoom
    ctx.fillStyle = "#8597b2";
    ctx.textAlign = "left";
    ctx.font = "10px Arial";
    ctx.fillText(`Zoom: ${scale.toFixed(1)}x`, 10, 20);

    // Adicionar informação de carregamento se necessário
    if (loading) {
      ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
      ctx.fillRect(0, 0, rect.width, rect.height);

      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "center";
      ctx.font = "bold 16px Arial";
      ctx.fillText("Carregando dados...", rect.width / 2, rect.height / 2);
    }

    animationRef.current = requestAnimationFrame(drawChart);
  }, [
    candles,
    currentPrice,
    loading,
    scale,
    offsetX,
    visibleCandleCount,
    visibleCandleStart,
  ]);

  // Configurar o loop de animação para o gráfico
  useEffect(() => {
    animationRef.current = requestAnimationFrame(drawChart);

    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [drawChart]);

  // Manipuladores de eventos para zoom e pan
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    setStartDragX(e.clientX);
    setStartOffsetX(offsetX);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;

    const deltaX = e.clientX - startDragX;
    setOffsetX(startOffsetX + deltaX);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();

    // Ajustar o zoom com base na direção da roda do mouse
    const zoomFactor = 0.1;
    const newScale =
      e.deltaY < 0
        ? Math.min(scale + zoomFactor, 5) // Limitar zoom máximo a 5x
        : Math.max(scale - zoomFactor, 0.5); // Limitar zoom mínimo a 0.5x

    setScale(newScale);
  };

  // Manipuladores de eventos de toque para dispositivos móveis
  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length === 1) {
      // Pan com um dedo
      setIsDragging(true);
      setStartDragX(e.touches[0].clientX);
      setStartOffsetX(offsetX);
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault(); // Prevenir o comportamento padrão de scroll

    if (e.touches.length === 1 && isDragging) {
      // Pan com um dedo
      const deltaX = e.touches[0].clientX - startDragX;
      setOffsetX(startOffsetX + deltaX);
    } else if (e.touches.length === 2) {
      // Pinch-to-zoom com dois dedos
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];

      // Calcular a distância entre os dois toques
      const currentDistance = Math.hypot(
        touch1.clientX - touch2.clientX,
        touch1.clientY - touch2.clientY
      );

      // Se não temos uma distância inicial, definir agora
      if (!e.currentTarget.dataset.initialPinchDistance) {
        e.currentTarget.dataset.initialPinchDistance =
          currentDistance.toString();
        e.currentTarget.dataset.initialScale = scale.toString();
        return;
      }

      // Calcular o fator de zoom

      const initialDistance = Number.parseFloat(
        e.currentTarget.dataset.initialPinchDistance ?? "1"
      );
      const initialScale = Number.parseFloat(
        e.currentTarget.dataset.initialScale ?? "1"
      );

      const zoomFactor = currentDistance / initialDistance;

      // Aplicar o zoom
      const newScale = Math.min(Math.max(initialScale * zoomFactor, 0.5), 5);
      setScale(newScale);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLCanvasElement>) => {
    setIsDragging(false);

    // Limpar dados de pinch-to-zoom
    if (e.touches.length === 0) {
      e.currentTarget.dataset.initialPinchDistance = "";
      e.currentTarget.dataset.initialScale = "";
    }
  };

  // Resetar zoom e pan
  const resetZoomPan = () => {
    setScale(1);
    setOffsetX(0);
  };

  // Atualizar os temporizadores
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeUntilPurchase((prev) => (prev > 0 ? prev - 1 : 22));
      setTimeUntilExpiration((prev) => (prev > 0 ? prev - 1 : 52));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Formatar o tempo como MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-[#050a1c] text-white flex flex-col">
      {/* Header */}
      <header className="p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
            <span className="text-white font-bold">V</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-gray-400">Conta demo</span>
            <span className="font-bold">R$ 10.450,00</span>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="text-white bg-green-500 rounded-md"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </header>

      {/* Seletor de criptomoeda e timeframe */}
      <div className="px-4 py-2 flex justify-between items-center bg-[#0a1530]">
        <div className="flex items-center gap-2">
          <Select value={selectedPair} onValueChange={setSelectedPair}>
            <SelectTrigger className="w-[140px] bg-transparent border-none text-white">
              <SelectValue placeholder="Selecionar cripto" />
            </SelectTrigger>
            <SelectContent className="bg-[#0a1530] border-green-500">
              {availablePairs.map((pair) => (
                <SelectItem key={pair.value} value={pair.value}>
                  {pair.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Tabs
            defaultValue="1m"
            value={selectedTimeframe}
            onValueChange={setSelectedTimeframe}
            className="w-auto"
          >
            <TabsList className="bg-[#0a1530] border border-green-500/30">
              <TabsTrigger value="1m" className="text-xs">
                1m
              </TabsTrigger>
              <TabsTrigger value="5m" className="text-xs">
                5m
              </TabsTrigger>
              <TabsTrigger value="15m" className="text-xs">
                15m
              </TabsTrigger>
              <TabsTrigger value="1h" className="text-xs">
                1h
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Temporizadores */}
      <div className="grid grid-cols-2 text-center py-2 border-b border-green-500/30">
        <div className="flex flex-col">
          <span className="text-xs text-gray-400">Tempo até a compra</span>
          <span className="text-lg font-bold">
            {formatTime(timeUntilPurchase)}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-gray-400">Até a exp</span>
          <span className="text-lg font-bold">
            {formatTime(timeUntilExpiration)}
          </span>
        </div>
      </div>

      {/* Gráfico de velas */}
      <div
        ref={containerRef}
        className="flex-1 relative"
        style={{ height: "calc(100vh - 300px)", minHeight: "400px" }}
      >
        <canvas
          ref={canvasRef}
          className="w-full h-full cursor-grab"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        />

        {/* Controles de zoom */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <Button
            variant="outline"
            size="icon"
            className="bg-[#0a1530] border-green-500/30 h-8 w-8"
            onClick={() => setScale(Math.min(scale + 0.2, 5))}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="bg-[#0a1530] border-green-500/30 h-8 w-8"
            onClick={() => setScale(Math.max(scale - 0.2, 0.5))}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="bg-[#0a1530] border-green-500/30 h-8 w-8"
            onClick={resetZoomPan}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>

        {/* Informações do par */}
        <div className="absolute top-4 left-4 bg-[#0a1530]/80 p-2 rounded-md">
          <div className="text-sm font-bold">
            {selectedPair.replace("USDT", "/USDT")}
          </div>
          <div
            className={`text-xs ${
              priceChangePercent >= 0 ? "text-green-500" : "text-red-500"
            }`}
          >
            {priceChangePercent >= 0 ? "+" : ""}
            {priceChangePercent.toFixed(2)}%
          </div>
        </div>

        {/* Mensagem de erro */}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <div className="bg-[#0a1530] p-4 rounded-md max-w-md">
              <div className="text-red-500 font-bold mb-2">
                Erro ao carregar dados
              </div>
              <div className="text-sm">{error}</div>
              <Button
                className="mt-4 bg-green-500 hover:bg-green-600"
                onClick={fetchCandleData}
              >
                Tentar novamente
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Ferramentas de gráfico */}
      <div className="flex justify-between items-center px-4 py-2 bg-[#0a1530] border-t border-green-500/30">
        <button className="flex flex-col items-center justify-center">
          <div className="w-6 h-6 rounded-full bg-yellow-400 flex items-center justify-center">
            <TrendingUp className="h-3 w-3 text-black" />
          </div>
          <span className="text-xs mt-1">1m</span>
        </button>

        <button className="flex flex-col items-center justify-center">
          <Edit3 className="h-5 w-5 text-gray-400" />
        </button>

        <button className="flex flex-col items-center justify-center">
          <Users className="h-5 w-5 text-gray-400" />
        </button>

        <button className="flex flex-col items-center justify-center">
          <Timer className="h-5 w-5 text-gray-400" />
        </button>

        <div className="flex gap-2">
          <button className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
            <Users className="h-5 w-5 text-white" />
          </button>
          <button className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center">
            <Trophy className="h-5 w-5 text-white" />
          </button>
        </div>
      </div>

      {/* Informações de negociação */}
      <div className="bg-[#0a1530] border-t border-green-500/30">
        <div className="grid grid-cols-2">
          <div className="p-3 border-r border-b border-green-500/30">
            <div className="text-xs text-gray-400">FTT</div>
            <div className="font-bold">{selectedPair.replace("USDT", "")}</div>
          </div>
          <div className="p-3 border-b border-green-500/30">
            <div className="text-xs text-gray-400">Tempo</div>
            <div className="font-bold">
              {new Date().toLocaleTimeString().substring(0, 5)}
            </div>
          </div>
          <div className="p-3 border-r border-green-500/30">
            <div className="text-xs text-gray-400">Montante</div>
            <div className="font-bold">R$ {amount.toLocaleString()}</div>
          </div>
          <div className="p-3 flex items-center justify-between">
            <div>
              <div className="text-xs text-gray-400">Preço de Strike</div>
              <div className="flex items-center">
                <span className="text-red-400 mr-2">83%</span>
                <span className="font-bold">
                  {currentPrice.toFixed(currentPrice < 1 ? 6 : 2)}
                </span>
                <span className="text-green-500 ml-2">83%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Botões de compra/venda */}
      <div className="grid grid-cols-2">
        <button className="bg-green-500 py-4 flex flex-col items-center justify-center">
          <ArrowUp className="h-6 w-6 mb-1" />
          <span className="font-bold">R$ 45.750,00</span>
        </button>
        <button className="bg-red-500 py-4 flex flex-col items-center justify-center">
          <ArrowDown className="h-6 w-6 mb-1" />
          <span className="font-bold">R$ 45.750,00</span>
        </button>
      </div>

      {/* Navegação inferior (Bottom Navigation) estilo Binance */}
      <div>
        <NavBottom />
      </div>
    </div>
  );
}
