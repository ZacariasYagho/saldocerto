'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle, XCircle, HelpCircle, ArrowLeft } from "lucide-react"

// Simulação de dados de gastos
const gerarDadosSimulados = (meses: number) => {
  const orcamento = 5000 * meses // Orçamento mensal de R$ 5000
  const gastoTotal = Math.random() * (orcamento * 1.2) // Gasto entre 0 e 120% do orçamento
  const temDados = Math.random() > 0.1 // 90% de chance de ter dados
  return { orcamento, gastoTotal, temDados }
}

export default function RelatorioGastosSimplificado() {
  const [periodo, setPeriodo] = useState('mensal')
  const [dados, setDados] = useState({ orcamento: 0, gastoTotal: 0, temDados: true })

  useEffect(() => {
    // Simula a obtenção de dados baseado no período selecionado
    const meses = periodo === 'mensal' ? 1 : periodo === 'trimestral' ? 3 : 12
    setDados(gerarDadosSimulados(meses))
  }, [periodo])

  const analisarGastos = () => {
    const { orcamento, gastoTotal, temDados } = dados

    if (!temDados) {
      return {
        tipo: 'info',
        titulo: 'Sem dados suficientes',
        descricao: 'Não há dados suficientes para gerar um relatório neste período.',
        icone: HelpCircle
      }
    }

    if (gastoTotal === 0) {
      return {
        tipo: 'warning',
        titulo: 'Nenhum gasto registrado',
        descricao: 'Você não registrou nenhum gasto neste período. Certifique-se de manter seus registros atualizados.',
        icone: AlertCircle
      }
    }

    if (gastoTotal > orcamento) {
      return {
        tipo: 'destructive',
        titulo: 'Gastos acima do orçamento',
        descricao: `Você gastou R$ ${(gastoTotal - orcamento).toFixed(2)} a mais do que o planejado. Considere revisar seus gastos.`,
        icone: XCircle
      }
    }

    if (gastoTotal <= orcamento) {
      return {
        tipo: 'success',
        titulo: 'Dentro do orçamento',
        descricao: `Parabéns! Você economizou R$ ${(orcamento - gastoTotal).toFixed(2)} neste período.`,
        icone: CheckCircle
      }
    }
  }

  const relatorio = analisarGastos()

  const handleBack = () => {
    // Add navigation logic here
    console.log('Voltar button clicked')
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      <Button 
        variant="outline" 
        className="w-full justify-start"
        onClick={handleBack}
        aria-label="Voltar"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Voltar
      </Button>
      <Card>
        <CardHeader>
          <CardTitle>Relatório de Gastos Simplificado</CardTitle>
          <div className="flex justify-end">
            <Select value={periodo} onValueChange={setPeriodo}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Selecione o período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mensal">Mensal</SelectItem>
                <SelectItem value="trimestral">Trimestral</SelectItem>
                <SelectItem value="anual">Anual</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Alert variant={relatorio.tipo as 'default' | 'destructive'}>
            <relatorio.icone className="h-4 w-4" />
            <AlertTitle>{relatorio.titulo}</AlertTitle>
            <AlertDescription>{relatorio.descricao}</AlertDescription>
          </Alert>
          {dados.temDados && (
            <div className="mt-4 space-y-2">
              <p><strong>Orçamento {periodo}:</strong> R$ {dados.orcamento.toFixed(2)}</p>
              <p><strong>Gasto total:</strong> R$ {dados.gastoTotal.toFixed(2)}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}