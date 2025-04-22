"use client"

import { useState } from "react"
import {
  Bell,
  ChevronRight,
  Clock,
  CreditCard,
  Eye,
  Home,
  BarChart2,
  Repeat,
  Wallet,
  User,
  Lock,
  HelpCircle,
  LogOut,
  Settings,
  Shield,
  Star,
  UserCircle,
  Menu,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import Link from "next/link"

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("profile")
  const [notifications, setNotifications] = useState(true)
  const [biometricAuth, setBiometricAuth] = useState(true)

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

      <div className="flex-1 p-4 pb-24">
        {/* Perfil do usuário */}
        <div className="border-2 border-green-500 rounded-3xl p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center">
              <UserCircle className="w-16 h-16 text-green-500" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Sr Jeferson</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-yellow-500">★</span>
                <span>Bronze nível 5</span>
              </div>
              <div className="mt-2">
                <span className="text-sm text-gray-400">ID: 12345678</span>
              </div>
            </div>
            <Button variant="outline" size="sm" className="ml-auto border-green-500 text-green-500">
              Editar
            </Button>
          </div>

          <div className="mt-6">
            <div className="flex justify-between mb-2">
              <span className="text-sm">Progresso para Nível 6</span>
              <span className="text-sm">28%</span>
            </div>
            <Progress value={28} className="h-2 bg-white/20">
              <div className="absolute h-full bg-green-500" style={{ width: "28%" }} />
            </Progress>
            <div className="mt-2 text-xs text-gray-400 text-center">Falta 72% para atingir o próximo nível</div>
          </div>
        </div>

        {/* Estatísticas da conta */}
        <div className="border-2 border-green-500 rounded-3xl p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Estatísticas da Conta</h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#0a1530] rounded-xl p-4">
              <div className="text-gray-400 text-sm">Total de Transações</div>
              <div className="text-xl font-bold mt-1">247</div>
            </div>

            <div className="bg-[#0a1530] rounded-xl p-4">
              <div className="text-gray-400 text-sm">Membro desde</div>
              <div className="text-xl font-bold mt-1">Jan 2023</div>
            </div>

            <div className="bg-[#0a1530] rounded-xl p-4">
              <div className="text-gray-400 text-sm">Nível de Verificação</div>
              <div className="text-xl font-bold mt-1 flex items-center">
                <Shield className="h-5 w-5 text-green-500 mr-1" />
                Completo
              </div>
            </div>

            <div className="bg-[#0a1530] rounded-xl p-4">
              <div className="text-gray-400 text-sm">Pontos de Fidelidade</div>
              <div className="text-xl font-bold mt-1 flex items-center">
                <Star className="h-5 w-5 text-yellow-500 mr-1" />
                1,250
              </div>
            </div>
          </div>
        </div>

        {/* Configurações */}
        <div className="border-2 border-green-500 rounded-3xl p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Configurações</h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-[#0a1530] rounded-xl">
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-green-500" />
                <span>Notificações</span>
              </div>
              <Switch
                checked={notifications}
                onCheckedChange={setNotifications}
                className="data-[state=checked]:bg-green-500"
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-[#0a1530] rounded-xl">
              <div className="flex items-center gap-3">
                <Lock className="h-5 w-5 text-green-500" />
                <span>Autenticação Biométrica</span>
              </div>
              <Switch
                checked={biometricAuth}
                onCheckedChange={setBiometricAuth}
                className="data-[state=checked]:bg-green-500"
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-[#0a1530] rounded-xl">
              <div className="flex items-center gap-3">
                <Eye className="h-5 w-5 text-green-500" />
                <span>Ocultar Saldo</span>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </div>

            <div className="flex items-center justify-between p-3 bg-[#0a1530] rounded-xl">
              <div className="flex items-center gap-3">
                <Settings className="h-5 w-5 text-green-500" />
                <span>Preferências</span>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Segurança */}
        <div className="border-2 border-green-500 rounded-3xl p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Segurança</h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-[#0a1530] rounded-xl">
              <div className="flex items-center gap-3">
                <Lock className="h-5 w-5 text-green-500" />
                <span>Alterar Senha</span>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </div>

            <div className="flex items-center justify-between p-3 bg-[#0a1530] rounded-xl">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-green-500" />
                <span>Autenticação de 2 Fatores</span>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </div>

            <div className="flex items-center justify-between p-3 bg-[#0a1530] rounded-xl">
              <div className="flex items-center gap-3">
                <CreditCard className="h-5 w-5 text-green-500" />
                <span>Métodos de Pagamento</span>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Suporte */}
        <div className="border-2 border-green-500 rounded-3xl p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Suporte</h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-[#0a1530] rounded-xl">
              <div className="flex items-center gap-3">
                <HelpCircle className="h-5 w-5 text-green-500" />
                <span>Central de Ajuda</span>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </div>

            <div className="flex items-center justify-between p-3 bg-[#0a1530] rounded-xl">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-green-500" />
                <span>Histórico de Atividades</span>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Botão de Logout */}
        <Button variant="outline" className="w-full border-red-500 text-red-500 hover:bg-red-500/10 mt-4">
          <LogOut className="h-5 w-5 mr-2" />
          Sair da Conta
        </Button>
      </div>

      {/* Navegação inferior (Bottom Navigation) estilo Binance */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#050a1c] border-t border-green-500/30 z-50">
        <div className="flex justify-around items-center h-16">
          <Link href="/app/page" className="flex flex-col items-center justify-center w-1/5 py-1 text-gray-400">
            <Home className="h-5 w-5 text-gray-400" />
            <span className="text-xs mt-1">Início</span>
          </Link>

          <button className="flex flex-col items-center justify-center w-1/5 py-1 text-gray-400">
            <BarChart2 className="h-5 w-5 text-gray-400" />
            <span className="text-xs mt-1">Mercado</span>
          </button>

          <button className="flex flex-col items-center justify-center w-1/5 py-1 text-gray-400">
            <Repeat className="h-5 w-5 text-gray-400" />
            <span className="text-xs mt-1">Negociar</span>
          </button>

          <Link href="/voin-wallet" className="flex flex-col items-center justify-center w-1/5 py-1 text-gray-400">
            <Wallet className="h-5 w-5 text-gray-400" />
            <span className="text-xs mt-1">Carteira</span>
          </Link>

          <div className="flex flex-col items-center justify-center w-1/5 py-1 text-green-500 relative">
            <User className="h-5 w-5 text-green-500" />
            <span className="text-xs mt-1">Perfil</span>
            <div className="absolute bottom-0 w-6 h-1 bg-green-500 rounded-t-full"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
