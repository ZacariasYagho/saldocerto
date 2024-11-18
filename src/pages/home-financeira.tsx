'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { PlusCircle, DollarSign, PieChart, Calendar, Users, FileText, Bell, X } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import Link from 'next/link'

// Simulação de dados financeiros
const gerarDadosSimulados = () => ({
  saldoAtual: Math.random() * 10000,
  limiteMensal: 5000,
  gastosMes: Math.random() * 5000,
  despesasRecorrentes: [
    { descricao: "Netflix", valor: 39.90, vencimento: new Date(2024, 2, 15) },
    { descricao: "Academia", valor: 89.90, vencimento: new Date(2024, 2, 20) },
    { descricao: "Plano de Celular", valor: 59.99, vencimento: new Date(2024, 2, 25) },
  ],
  despesasDivididas: [
    { descricao: "Aluguel", valor: 1200, participantes: 2 },
    { descricao: "Conta de Luz", valor: 150, participantes: 3 },
  ],
})

function NotificationPopup({ isOpen, onClose, notifications, toggleNotification }: { 
  isOpen: boolean; 
  onClose: () => void; 
  notifications: { spendingLimit: boolean; upcomingExpenses: boolean }; 
  toggleNotification: (type: "spendingLimit" | "upcomingExpenses") => void; 
}) {
  return (
    <div className={`fixed inset-0 flex items-center justify-center z-50 ${isOpen ? '' : 'hidden'}`}>
      <div className="bg-white rounded-lg shadow-xl p-6 w-96 max-w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Gerenciamento de Notificações</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-6 w-6" />
          </Button>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span>Alerta de limite de gastos (80%)</span>
            <Switch
              checked={notifications.spendingLimit}
              onCheckedChange={() => toggleNotification('spendingLimit')}
            />
          </div>
          <div className="flex items-center justify-between">
            <span>Despesas próximas do vencimento</span>
            <Switch
              checked={notifications.upcomingExpenses}
              onCheckedChange={() => toggleNotification('upcomingExpenses')}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Component() {
  const [dados, setDados] = useState(gerarDadosSimulados())
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const [notifications, setNotifications] = useState({
    spendingLimit: true,
    upcomingExpenses: true,
  })
  const [activeNotifications, setActiveNotifications] = useState<string[]>([])

  useEffect(() => {
    // Simula a atualização de dados a cada 30 segundos
    const intervalo = setInterval(() => {
      setDados(gerarDadosSimulados())
    }, 30000)

    return () => clearInterval(intervalo)
  }, [])

  useEffect(() => {
    const newNotifications = []
    const percentualGasto = (dados.gastosMes / dados.limiteMensal) * 100

    if (notifications.spendingLimit && percentualGasto >= 80) {
      newNotifications.push("Você está próximo do limite de gastos!")
    }

    if (notifications.upcomingExpenses) {
      const hoje = new Date()
      const proximosDias = new Date(hoje.getTime() + 5 * 24 * 60 * 60 * 1000)
      dados.despesasRecorrentes.forEach(despesa => {
        if (despesa.vencimento >= hoje && despesa.vencimento <= proximosDias) {
          newNotifications.push(`${despesa.descricao} vence em breve!`)
        }
      })
    }

    setActiveNotifications(newNotifications)
  }, [dados, notifications])

  const percentualGasto = (dados.gastosMes / dados.limiteMensal) * 100

  const toggleNotification = (type: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [type]: !prev[type] }))
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Barra lateral esquerda */}
      <div className="w-16 bg-white shadow-md flex flex-col items-center py-4 space-y-4">
        <Link href="/adicionar-despesa">
          <Button variant="ghost" size="icon" title="Adicionar Despesa">
            <PlusCircle className="h-6 w-6" />
          </Button>
        </Link>
        <Link href="/limite-mensal">
          <Button variant="ghost" size="icon" title="Limite Mensal">
            <DollarSign className="h-6 w-6" />
          </Button>
        </Link>
        <Link href="/despesas-recorrentes">
          <Button variant="ghost" size="icon" title="Despesas Recorrentes">
            <Calendar className="h-6 w-6" />
          </Button>
        </Link>
        <Link href="/divisao-despesas">
          <Button variant="ghost" size="icon" title="Divisão de Despesas">
            <Users className="h-6 w-6" />
          </Button>
        </Link>
        <Link href="/relatorios">
          <Button variant="ghost" size="icon" title="Relatórios">
            <FileText className="h-6 w-6" />
          </Button>
        </Link>
      </div>

      {/* Conteúdo principal */}
      <div className="flex-1 p-8 overflow-auto">
        <div className="flex justify-end mb-4">
          <Button
            variant="ghost"
            size="icon"
            title="Notificações"
            className="relative"
            onClick={() => setIsNotificationOpen(true)}
          >
            <Bell className="h-6 w-6" />
            {activeNotifications.length > 0 && (
              <span className="absolute top-0 right-0 h-3 w-3 bg-red-500 rounded-full"></span>
            )}
          </Button>
        </div>
        <h1 className="text-3xl font-bold mb-6 mt-2 text-center">SALDO CERTO</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Saldo Atual */}
          <Card>
            <CardHeader>
              <CardTitle>Saldo Atual</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">R$ {dados.saldoAtual.toFixed(2)}</p>
            </CardContent>
          </Card>

          {/* Limite Mensal e Gastos */}
          <Card>
            <CardHeader>
              <CardTitle>Gastos do Mês</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Progress value={percentualGasto} className="w-full" />
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>R$ {dados.gastosMes.toFixed(2)} de R$ {dados.limiteMensal.toFixed(2)}</span>
                  <span className="font-medium">{percentualGasto.toFixed(1)}%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Despesas Recorrentes */}
          <Card>
            <CardHeader>
              <CardTitle>Despesas Recorrentes</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {dados.despesasRecorrentes.map((despesa, index) => (
                  <li key={index} className="flex justify-between items-center">
                    <span>{despesa.descricao}</span>
                    <span className="font-semibold">R$ {despesa.valor.toFixed(2)}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-sm text-gray-500">
                Total: R$ {dados.despesasRecorrentes.reduce((acc, despesa) => acc + despesa.valor, 0).toFixed(2)}
              </p>
            </CardContent>
          </Card>

          {/* Despesas Divididas */}
          <Card>
            <CardHeader>
              <CardTitle>Despesas Divididas</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {dados.despesasDivididas.map((despesa, index) => (
                  <li key={index} className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span>{despesa.descricao}</span>
                      <span className="font-semibold">R$ {despesa.valor.toFixed(2)}</span>
                    </div>
                    <p className="text-sm text-gray-500">
                      Dividido entre {despesa.participantes} pessoas -
                      R$ {(despesa.valor / despesa.participantes).toFixed(2)} cada
                    </p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Relatório Rápido */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Relatório Rápido</CardTitle>
            </CardHeader>
            <CardContent>
              {percentualGasto > 100 ? (
                <p className="text-red-500">Atenção! Você ultrapassou seu limite mensal de gastos.</p>
              ) : percentualGasto > 80 ? (
                <p className="text-yellow-500">Cuidado! Você está próximo de atingir seu limite mensal de gastos.</p>
              ) : (
                <p className="text-green-500">Seus gastos estão dentro do limite mensal. Continue assim!</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <NotificationPopup
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
        notifications={notifications}
        toggleNotification={toggleNotification}
      />
    </div>
  )
}