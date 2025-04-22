"use client";

import { Home, BarChart2, Repeat, Wallet, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NavBottom() {
  const router = useRouter();

  const navigateToWallet = () => router.push("/voin-wallet");
  const navigateToProfile = () => router.push("/profile");
  const navigateToMarket = () => router.push("/market");

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#050a1c] border-t border-green-500/30 z-50">
      <div className="flex justify-around items-center h-16">
        <button
          className="flex flex-col items-center justify-center w-1/5 py-1 text-gray-400"
          onClick={() => router.push("/")}
        >
          <Home className="h-5 w-5" />
          <span className="text-xs mt-1">Início</span>
        </button>
        <button
          className="flex flex-col items-center justify-center w-1/5 py-1 text-gray-400"
          onClick={navigateToMarket}
        >
          <BarChart2 className="h-5 w-5" />
          <span className="text-xs mt-1">Mercado</span>
        </button>
        <div className="flex flex-col items-center justify-center w-1/5 py-1 text-green-500 relative">
          <Repeat className="h-5 w-5" />
          <span className="text-xs mt-1">Negociar</span>
          <div className="absolute bottom-0 w-6 h-1 bg-green-500 rounded-t-full"></div>
        </div>
        <button
          className="flex flex-col items-center justify-center w-1/5 py-1 text-gray-400"
          onClick={navigateToWallet}
        >
          <Wallet className="h-5 w-5" />
          <span className="text-xs mt-1">Carteira</span>
        </button>
        <button
          className="flex flex-col items-center justify-center w-1/5 py-1 text-gray-400"
          onClick={navigateToProfile}
        >
          <User className="h-5 w-5" />
          <span className="text-xs mt-1">Perfil</span>
        </button>
      </div>
    </div>
  );
}
