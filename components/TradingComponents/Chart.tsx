"use client";

import { useEffect, useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../ui/select";

import { ArrowUp, ArrowDown } from "lucide-react";
import NavBottom from "../HomeComponents/NavBottom";
import NavTrading from "./NavbarTrading";

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

declare global {
  interface Window {
    TradingView: any;
  }
}

export default function Chart() {
  const [selectedPair, setSelectedPair] = useState("BTCUSDT");
  const [currentPrice, setCurrentPrice] = useState(0.0);
  const [amount] = useState(25000);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/tv.js";
    script.async = true;
    script.onload = () => {
      if (window.TradingView) {
        new window.TradingView.widget({
          symbol: `BINANCE:${selectedPair}`,
          interval: "1",
          container_id: "tv_chart_container",
          locale: "br",
          theme: "dark",
          width: "100%",
          height: "450",
          style: "1",
          hide_top_toolbar: false,
          hide_legend: false,
          withdateranges: true,
          allow_symbol_change: true,
          overrides: {
            "paneProperties.background": "#001f3f", // fundo azul
            "paneProperties.vertGridProperties.color": "#0a3b5c",
            "paneProperties.horzGridProperties.color": "#0a3b5c",
            "scalesProperties.textColor": "#ffffff",
            "mainSeriesProperties.candleStyle.upColor": "#00ff99",
            "mainSeriesProperties.candleStyle.downColor": "#ff4d4d",
          },
        });
      }
    };
    document.body.appendChild(script);

    return () => {
      const container = document.getElementById("tv_chart_container");
      if (container) container.innerHTML = "";
    };
  }, [selectedPair]);

  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white flex flex-col">
      <div>
        <NavTrading />
      </div>

      {/* Gráfico TradingView */}
      <div className="flex justify-center p-4 py-2">
        <div id="tv_chart_container" className="w-full h-[450px]" />
      </div>

      {/* Informações */}
      <div className="p-4">
        <div className="grid grid-cols-2 bg-[#181818] border-t border-green-500/30">
          <div className="p-3 border border-green-500/30">
            <div className="text-xs text-gray-400">Par</div>
            <div className="font-bold">{selectedPair.replace("USDT", "")}</div>
          </div>
          <div className="p-3 border border-green-500/30">
            <div className="text-xs text-gray-400">Hora</div>
            <div className="font-bold">
              {new Date().toLocaleTimeString().substring(0, 5)}
            </div>
          </div>
          <div className="p-3 border border-green-500/30">
            <div className="text-xs text-gray-400">Montante</div>
            <div className="font-bold">R$ {amount.toLocaleString()}</div>
          </div>
          <div className="p-3 border border-green-500/30 flex items-center justify-between">
            <div>
              <div className="text-xs text-gray-400">Preço atual</div>
              <div className="font-bold">
                {currentPrice.toFixed(currentPrice < 1 ? 6 : 2)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Seletor e botões */}
      <div className="flex max-md:flex-wrap w-full items-center pb-20">
        <div className="flex w-60 max-sm:w-full p-4">
          <Select value={selectedPair} onValueChange={setSelectedPair}>
            <SelectTrigger className="bg-[#181818] text-white p-2 rounded border border-green-500/30">
              <SelectValue placeholder="Selecione um par" />
            </SelectTrigger>
            <SelectContent className="bg-[#181818] text-white border border-green-500/30">
              {availablePairs.map((pair) => (
                <SelectItem key={pair.value} value={pair.value}>
                  {pair.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex w-full p-4 gap-4">
          <button className="w-full bg-red-500 py-3 flex flex-col items-center justify-center">
            <ArrowDown className="h-6 w-6" />
          </button>
          <button className="w-full bg-green-500 py-3 flex flex-col items-center justify-center">
            <ArrowUp className="h-6 w-6" />
          </button>
        </div>
      </div>

      <div>
        <NavBottom />
      </div>
    </div>
  );
}
