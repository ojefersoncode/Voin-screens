"use client"

import type React from "react"

import { useState } from "react"
import {
  Eye,
  Menu,
  Plus,
  Send,
  Upload,
  Target,
  Trophy,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Home,
  BarChart2,
  Repeat,
  Wallet,
  User,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Area, AreaChart, CartesianGrid, Line, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { useRouter } from "next/navigation"

// Componente Progress personalizado para garantir as cores corretas
const Progress = ({
  value,
  className,
  children,
}: { value: number; className?: string; children?: React.ReactNode }) => {
  return (
    <div className={`relative w-full overflow-hidden rounded-full ${className}`}>
      <div className="w-full h-full bg-white/80" />
      <div className="absolute top-0 left-0 h-full bg-green-500 transition-all" style={{ width: `${value}%` }} />
      {children}
    </div>
  )
}

export default function VoinWallet() {
  const [showBalance, setShowBalance] = useState(true)
  const [timeRange, setTimeRange] = useState("7d")
  const [activeTab, setActiveTab] = useState("wallet")
  const router = useRouter()

  // Função para navegar para a página de perfil
  const navigateToProfile = () => {
    router.push("/profile")
  }

  // Função para navegar para a página de mercado
  const navigateToMarket = () => {
    router.push("/market")
  }

  // Função para navegar para a página de negociação
  const navigateToTrade = () => {
    router.push("/trade")
  }

  // Dados de exemplo para o histórico de transações
  const transactions = [
    {
      id: "tx1",
      date: "22/04/2025",
      time: "14:32",
      type: "entrada",
      amount: 5000.0,
      description: "Depósito",
      status: "concluída",
    },
    {
      id: "tx2",
      date: "20/04/2025",
      time: "09:15",
      type: "saída",
      amount: 1200.0,
      description: "Pagamento para João Silva",
      status: "concluída",
    },
    {
      id: "tx3",
      date: "18/04/2025",
      time: "16:45",
      type: "entrada",
      amount: 8500.0,
      description: "Transferência recebida",
      status: "concluída",
    },
    {
      id: "tx4",
      date: "15/04/2025",
      time: "11:20",
      type: "saída",
      amount: 3200.0,
      description: "Compra de tokens",
      status: "concluída",
    },
    {
      id: "tx5",
      date: "12/04/2025",
      time: "08:05",
      type: "saída",
      amount: 750.0,
      description: "Pagamento de serviço",
      status: "pendente",
    },
  ]

  // Dados para o gráfico de transações
  const chartData7d = [
    { date: "16/04", entrada: 0, saida: 2000, saldo: 125000 },
    { date: "17/04", entrada: 3000, saida: 0, saldo: 128000 },
    { date: "18/04", entrada: 8500, saida: 0, saldo: 136500 },
    { date: "19/04", entrada: 0, saida: 500, saldo: 136000 },
    { date: "20/04", entrada: 0, saida: 1200, saldo: 134800 },
    { date: "21/04", entrada: 0, saida: 0, saldo: 134800 },
    { date: "22/04", entrada: 5000, saida: 0, saldo: 139800 },
  ]

  const chartData30d = [
    { date: "24/03", entrada: 10000, saida: 0, saldo: 100000 },
    { date: "27/03", entrada: 0, saida: 5000, saldo: 95000 },
    { date: "01/04", entrada: 15000, saida: 0, saldo: 110000 },
    { date: "05/04", entrada: 0, saida: 3000, saldo: 107000 },
    { date: "08/04", entrada: 20000, saida: 0, saldo: 127000 },
    { date: "12/04", entrada: 0, saida: 750, saldo: 126250 },
    { date: "15/04", entrada: 0, saida: 3200, saldo: 123050 },
    { date: "18/04", entrada: 8500, saida: 0, saldo: 131550 },
    { date: "20/04", entrada: 0, saida: 1200, saldo: 130350 },
    { date: "22/04", entrada: 5000, saida: 0, saldo: 135350 },
  ]

  const chartData90d = [
    { date: "Jan", entrada: 50000, saida: 20000, saldo: 80000 },
    { date: "Fev", entrada: 35000, saida: 25000, saldo: 90000 },
    { date: "Mar", entrada: 45000, saida: 15000, saldo: 120000 },
    { date: "Abr", entrada: 13500, saida: 5150, saldo: 128350 },
  ]

  // Selecionar os dados do gráfico com base no período selecionado
  const getChartData = () => {
    switch (timeRange) {
      case "7d":
        return chartData7d
      case "30d":
        return chartData30d
      case "90d":
        return chartData90d
      default:
        return chartData7d
    }
  }

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
        <Button variant="ghost" size="icon" className="text-white bg-green-500 rounded-md">
          <Menu className="h-6 w-6" />
        </Button>
      </header>

      <div className="flex flex-col md:flex-row gap-6 p-4">
        {/* Left section - Balance card */}
        <div className="flex-1">
          <div className="border-2 border-green-500 rounded-3xl p-6 relative">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <span className="text-lg">Saldo disponível</span>
                <Eye className="h-5 w-5 cursor-pointer" onClick={() => setShowBalance(!showBalance)} />
              </div>
              <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                <span className="text-white font-bold">V</span>
              </div>
            </div>

            <h1 className="text-4xl font-bold mb-8">
              {showBalance ? "130,000,00" : "••••••••"} <span className="text-sm font-normal">voin</span>
            </h1>

            <div className="grid grid-cols-3 gap-4 mt-8">
              <div className="bg-green-500 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer">
                <Plus className="h-8 w-8 mb-2" />
                <span className="text-xs font-bold">ADICIONAR</span>
              </div>

              <div className="bg-green-500 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer">
                <Send className="h-8 w-8 mb-2" />
                <span className="text-xs font-bold">ENVIAR</span>
              </div>

              <div className="bg-green-500 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer">
                <Upload className="h-8 w-8 mb-2" />
                <span className="text-xs font-bold">Transferir</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right section - Progress */}
        <div className="flex-1">
          <h2 className="text-2xl font-bold mb-6">Bem vindo, sr jeferson!</h2>

          <div className="mb-8">
            <div className="flex justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-yellow-500">★</span>
                <span>Bronze nível 5</span>
              </div>
              <span>Nível 6</span>
            </div>

            <Progress value={28} className="h-4 bg-white/80">
              <div className="absolute -bottom-6 left-[28%] transform -translate-x-1/2">
                <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[8px] border-b-green-500"></div>
              </div>
            </Progress>

            <div className="mt-8 flex justify-center">
              <div className="bg-green-500 rounded-md px-4 py-2 text-sm">Falta 72% para nível 6</div>
            </div>
          </div>

          {/* Feature icons */}
          <div className="grid grid-cols-4 gap-4 mt-12">
            <div className="border-2 border-green-500 rounded-2xl p-4 flex items-center justify-center">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M18.36 12.76L14.5 8.9M14.5 8.9L10.64 12.76M14.5 8.9V19M22 8.27V4.64C22 3.74 21.26 3 20.36 3H16.73M2 15.73V19.36C2 20.26 2.74 21 3.64 21H7.27"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <div className="border-2 border-green-500 rounded-2xl p-4 flex items-center justify-center">
              <Target className="h-8 w-8 text-white" />
            </div>

            <div className="border-2 border-green-500 rounded-2xl p-4 flex items-center justify-center">
              <Trophy className="h-8 w-8 text-white" />
            </div>

            <div className="border-2 border-green-500 rounded-2xl p-4 flex items-center justify-center">
              <Clock className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Seção de gráfico de fluxo de transações */}
      <div className="p-4 mt-8">
        <h2 className="text-2xl font-bold mb-6">Fluxo de Transações</h2>

        <div className="border-2 border-green-500 rounded-3xl p-6 overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span>Entradas</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-white/80"></div>
                <span>Saídas</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-300"></div>
                <span>Saldo</span>
              </div>
            </div>

            <Tabs defaultValue="7d" value={timeRange} onValueChange={setTimeRange} className="w-auto">
              <TabsList className="bg-[#0a1530]">
                <TabsTrigger value="7d">7 dias</TabsTrigger>
                <TabsTrigger value="30d">30 dias</TabsTrigger>
                <TabsTrigger value="90d">90 dias</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="h-[300px] w-full">
            <ChartContainer
              config={{
                entrada: {
                  label: "Entradas",
                  color: "hsl(var(--chart-1))",
                },
                saida: {
                  label: "Saídas",
                  color: "hsl(var(--chart-2))",
                },
                saldo: {
                  label: "Saldo",
                  color: "hsl(var(--chart-3))",
                },
              }}
              className="h-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={getChartData()} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorEntrada" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00D37F" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#00D37F" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorSaida" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FFFFFF" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#FFFFFF" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1a2a4a" />
                  <XAxis dataKey="date" stroke="#8597b2" />
                  <YAxis stroke="#8597b2" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area type="monotone" dataKey="entrada" stroke="#00D37F" fillOpacity={1} fill="url(#colorEntrada)" />
                  <Area type="monotone" dataKey="saida" stroke="#FFFFFF" fillOpacity={1} fill="url(#colorSaida)" />
                  <Line
                    type="monotone"
                    dataKey="saldo"
                    stroke="#4AE3A9"
                    strokeWidth={2}
                    dot={{ r: 4, fill: "#4AE3A9", stroke: "#4AE3A9", strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="bg-[#0a1530] rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                  <ArrowUpRight className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Total de entradas</p>
                  <p className="text-xl font-bold">13.500,00 voin</p>
                </div>
              </div>
              <div className="text-green-500 text-sm font-medium">+10.5%</div>
            </div>

            <div className="bg-[#0a1530] rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                  <ArrowDownRight className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Total de saídas</p>
                  <p className="text-xl font-bold">5.150,00 voin</p>
                </div>
              </div>
              <div className="text-white text-sm font-medium">-3.2%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Seção de histórico de transações */}
      <div className="p-4 mt-8 mb-24">
        <h2 className="text-2xl font-bold mb-6">Histórico de Transações</h2>

        <div className="border-2 border-green-500 rounded-3xl p-4 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-green-500/30">
                  <th className="text-left py-3 px-4">Data/Hora</th>
                  <th className="text-left py-3 px-4">Descrição</th>
                  <th className="text-right py-3 px-4">Valor</th>
                  <th className="text-right py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr
                    key={transaction.id}
                    className="border-b border-green-500/10 hover:bg-green-500/5 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <div className="flex flex-col">
                        <span>{transaction.date}</span>
                        <span className="text-xs text-gray-400">{transaction.time}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">{transaction.description}</td>
                    <td
                      className={`py-4 px-4 text-right ${
                        transaction.type === "entrada" ? "text-green-500" : "text-white"
                      }`}
                    >
                      {transaction.type === "entrada" ? "+" : "-"} {transaction.amount.toLocaleString("pt-BR")} voin
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          transaction.status === "concluída"
                            ? "bg-green-500/20 text-green-500"
                            : "bg-yellow-500/20 text-yellow-500"
                        }`}
                      >
                        {transaction.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex justify-center">
            <Button variant="outline" className="border-green-500 text-green-500 hover:bg-green-500 hover:text-white">
              Ver todas as transações
            </Button>
          </div>
        </div>
      </div>

      {/* Navegação inferior (Bottom Navigation) estilo Binance */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#050a1c] border-t border-green-500/30 z-50">
        <div className="flex justify-around items-center h-16">
          <button
            className={`flex flex-col items-center justify-center w-1/5 py-1 ${activeTab === "home" ? "text-green-500" : "text-gray-400"}`}
            onClick={() => setActiveTab("home")}
          >
            <Home className={`h-5 w-5 ${activeTab === "home" ? "text-green-500" : "text-gray-400"}`} />
            <span className="text-xs mt-1">Início</span>
            {activeTab === "home" && <div className="absolute bottom-0 w-6 h-1 bg-green-500 rounded-t-full"></div>}
          </button>

          <button
            className={`flex flex-col items-center justify-center w-1/5 py-1 ${activeTab === "market" ? "text-green-500" : "text-gray-400"}`}
            onClick={navigateToMarket}
          >
            <BarChart2 className={`h-5 w-5 ${activeTab === "market" ? "text-green-500" : "text-gray-400"}`} />
            <span className="text-xs mt-1">Mercado</span>
            {activeTab === "market" && <div className="absolute bottom-0 w-6 h-1 bg-green-500 rounded-t-full"></div>}
          </button>

          <button
            className={`flex flex-col items-center justify-center w-1/5 py-1 ${activeTab === "trade" ? "text-green-500" : "text-gray-400"}`}
            onClick={navigateToTrade}
          >
            <Repeat className={`h-5 w-5 ${activeTab === "trade" ? "text-green-500" : "text-gray-400"}`} />
            <span className="text-xs mt-1">Negociar</span>
            {activeTab === "trade" && <div className="absolute bottom-0 w-6 h-1 bg-green-500 rounded-t-full"></div>}
          </button>

          <button
            className={`flex flex-col items-center justify-center w-1/5 py-1 ${activeTab === "wallet" ? "text-green-500" : "text-gray-400"}`}
            onClick={() => setActiveTab("wallet")}
          >
            <Wallet className={`h-5 w-5 ${activeTab === "wallet" ? "text-green-500" : "text-gray-400"}`} />
            <span className="text-xs mt-1">Carteira</span>
            {activeTab === "wallet" && <div className="absolute bottom-0 w-6 h-1 bg-green-500 rounded-t-full"></div>}
          </button>

          <button
            className={`flex flex-col items-center justify-center w-1/5 py-1 ${activeTab === "profile" ? "text-green-500" : "text-gray-400"}`}
            onClick={navigateToProfile}
          >
            <User className={`h-5 w-5 ${activeTab === "profile" ? "text-green-500" : "text-gray-400"}`} />
            <span className="text-xs mt-1">Perfil</span>
            {activeTab === "profile" && <div className="absolute bottom-0 w-6 h-1 bg-green-500 rounded-t-full"></div>}
          </button>
        </div>
      </div>
    </div>
  )
}
