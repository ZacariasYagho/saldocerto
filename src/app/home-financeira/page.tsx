'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { PlusCircle, DollarSign, Calendar, Users, FileText, Bell, X } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import Link from 'next/link'

// Definições de interfaces
interface DespesaRecorrente {
  id?: number;
  descricao: string;
  valor: number;
  vencimento: string | Date;
  frequencia: string;
}

interface Despesa {
  id?: number;
  descricao: string;
  valor: number;
  data: string;
  categoria?: string;
}

interface DespesaDividida {
  id?: number;
  descricao: string;
  valor: number;
  participantes: {
    nome: string;
    parte: number;
  }[];
}

interface DadosFinanceiros {
  saldoAtual: number;
  limiteMensal: number;
  gastosMes: number;
  despesasRecorrentes: DespesaRecorrente[];
  despesasDivididas: DespesaDividida[];
  despesasRegistradas: Despesa[];
}

function NotificationPopup({
  isOpen,
  onClose,
  notifications,
  toggleNotification,
}: {
  isOpen: boolean;
  onClose: () => void;
  notifications: { spendingLimit: boolean; upcomingExpenses: boolean };
  toggleNotification: (type: 'spendingLimit' | 'upcomingExpenses') => void;
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
  const [dados, setDados] = useState<DadosFinanceiros>({
    saldoAtual: 0,
    limiteMensal: 0,
    gastosMes: 0,
    despesasRecorrentes: [],
    despesasDivididas: [],
    despesasRegistradas: []
  });

  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const [notifications, setNotifications] = useState({
    spendingLimit: true,
    upcomingExpenses: true,
  })
  const [activeNotifications, setActiveNotifications] = useState<string[]>([])

  // Carrega dados iniciais
  useEffect(() => {
    carregarDados();

    // Recarrega dados a cada 5 minutos
    const interval = setInterval(carregarDados, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  // Função para carregar dados da API
  const carregarDados = async () => {
    try {
      console.log('Iniciando carregamento de dados...');

      // Busca dados do limite mensal
      const responseLimite = await fetch('/api/limite-mensal');
      const dadosLimite = await responseLimite.json();
      console.log('Dados do limite:', dadosLimite);

      // Busca dados das despesas recorrentes
      const responseDespesasRecorrentes = await fetch('/api/despesas-recorrentes');
      const dadosDespesasRecorrentes = await responseDespesasRecorrentes.json();
      console.log('Dados das despesas recorrentes:', dadosDespesasRecorrentes);

      // Busca dados das despesas registradas
      const responseDespesas = await fetch('/api/registro-despesas');
      const dadosDespesas: Despesa[] = await responseDespesas.json();
      console.log('Dados das despesas registradas:', dadosDespesas);

      // Busca dados das despesas divididas
      const responseDespesasDivididas = await fetch('/api/divisao-despesas');
      const dadosDespesasDivididas = await responseDespesasDivididas.json();
      console.log('Dados das despesas divididas:', dadosDespesasDivididas);

      // Calcula o total de gastos do mês atual
      const gastosMesRegistrados = dadosDespesas.reduce((total, despesa) => total + Number(despesa.valor), 0);
      const gastosMesRecorrentes = dadosDespesasRecorrentes.reduce((total: number, despesa: DespesaRecorrente) => total + despesa.valor, 0);
      const gastosMesDivididos = dadosDespesasDivididas.reduce((total: number, despesa: DespesaDividida) => total + despesa.valor, 0);

      // Total de gastos do mês
      const gastosMesTotal = gastosMesRegistrados + gastosMesRecorrentes + gastosMesDivididos;

      console.log('Total de gastos do mês:', gastosMesTotal);

      // Atualiza o estado com todos os dados
      const dadosAtualizados = {
        saldoAtual: dadosLimite.limiteMensal - gastosMesTotal,
        limiteMensal: dadosLimite.limiteMensal,
        gastosMes: gastosMesTotal, // Atualiza com o total de gastos
        despesasRecorrentes: dadosDespesasRecorrentes,
        despesasDivididas: dadosDespesasDivididas,
        despesasRegistradas: dadosDespesas
      };

      console.log('Dados atualizados:', dadosAtualizados);
      setDados(dadosAtualizados);

    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  };

  // Atualiza notificações quando os dados mudam
  useEffect(() => {
    const newNotifications = []
    const percentualGasto = dados.limiteMensal > 0 
      ? (dados.gastosMes / dados.limiteMensal) * 100 
      : 0;

    if (notifications.spendingLimit && percentualGasto >= 80) {
      newNotifications.push("Você está próximo do limite de gastos!")
    }

    if (notifications.upcomingExpenses) {
      const hoje = new Date()
      const proximosDias = new Date(hoje.getTime() + 5 * 24 * 60 * 60 * 1000)
      
      dados.despesasRecorrentes.forEach(despesa => {
        const dataVencimento = new Date(despesa.vencimento);
        if (dataVencimento >= hoje && dataVencimento <= proximosDias) {
          newNotifications.push(`${despesa.descricao} vence em breve!`)
        }
      })
    }

    setActiveNotifications(newNotifications)
  }, [dados, notifications])

  // Toggle de notificações
  const toggleNotification = async (type: 'spendingLimit' | 'upcomingExpenses') => {
    try {
      const novasNotificacoes = {
        ...notifications,
        [type]: !notifications[type]
      };

      const response = await fetch('/api/home-financeira', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tipo: 'notificacoes',
          notificacoes: novasNotificacoes
        })
      });

      if (response.ok) {
        setNotifications(novasNotificacoes);
      }
    } catch (error) {
      console.error('Erro ao atualizar notificações:', error);
    }
  }

  const percentualGasto = dados.limiteMensal > 0 
    ? (dados.gastosMes / dados.limiteMensal) * 100 
    : 0;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Barra lateral esquerda */}
      <div className="w-16 bg-white shadow-md flex flex-col items-center py-4 space-y-4">
        <Link href="/registro-despesas">
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
        <Link href="/relatorio-gastos-simplificado">
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
                {dados.despesasDivididas.map((despesa: DespesaDividida, index) => (
                  <li key={index} className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span>{despesa.descricao}</span>
                      <span className="font-semibold">R$ {despesa.valor.toFixed(2)}</span>
                    </div>
                    <div className="text-sm text-gray-500">
                      <p>Participantes:</p>
                      <ul className="pl-4">
                        {despesa.participantes.map((participante, idx) => (
                          <li key={idx}>
                            {participante.nome} - R$ {participante.parte.toFixed(2)}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Despesas Registradas */}
          <Card>
            <CardHeader>
              <CardTitle>Despesas Registradas</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {dados.despesasRegistradas.map((despesa, index) => (
                  <li key={index} className="flex justify-between items-center">
                    <span>{despesa.descricao}</span>
                    <span className="font-semibold">R$ {despesa.valor.toFixed(2)}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-sm text-gray-500">
                Total: R$ {dados.despesasRegistradas.reduce((acc, despesa) => acc + despesa.valor, 0).toFixed(2)}
              </p>
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