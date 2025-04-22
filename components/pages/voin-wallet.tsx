"use client";

import type React from "react";
import NavTrading from "../TradingComponents/NavbarTrading";
import Cash from "../HomeComponents/cash";
import NavBottom from "../HomeComponents/NavBottom";
import Trasition from "../HomeComponents/Trasition";

export default function VoinWallet() {
  return (
    <div className="min-h-screen bg-[#050a1c] text-white flex flex-col">
      <div>
        <NavTrading />
      </div>

      <div>
        <Cash />
      </div>

      <div>
        <Trasition />
      </div>

      <div>
        <NavBottom />
      </div>
    </div>
  );
}
