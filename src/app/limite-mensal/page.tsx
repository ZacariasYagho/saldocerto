'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { ArrowLeft } from 'lucide-react'

export default function LimiteMensal() {
  const [limiteMensal, setLimiteMensal] = useState(1000) // Valor inicial padrão
  const [gastoAtual, setGastoAtual] = useState(0)
  const [novoLimite, setNovoLimite] = useState('')

  useEffect(() => {
    // Simula a obtenção do gasto atual de uma API ou banco de dados
    const fetchGastoAtual = async () => {
      // Aqui você faria uma chamada real para obter o gasto atual
      const gastoSimulado = Math.random() * limiteMensal
      setGastoAtual(gastoSimulado)
    }

    fetchGastoAtual()
  }, [limiteMensal])

  const atualizarLimite = () => {
    const limite = parseFloat(novoLimite)
    if (isNaN(limite) || limite <= 0) {
      toast.error('Por favor, insira um valor válido para o limite mensal.')
      return
    }
    setLimiteMensal(limite)
    setNovoLimite('')
    toast.success('Limite mensal atualizado com sucesso!')
  }

  const handleBack = () => {
    // Add navigation logic here
    console.log('Voltar button clicked')
  }

  const saldoRestante = limiteMensal - gastoAtual
  const percentualGasto = (gastoAtual / limiteMensal) * 100

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
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
          <CardTitle>Limite Mensal de Gastos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="limite-atual">Limite Atual</Label>
            <div className="text-2xl font-bold">R$ {limiteMensal.toFixed(2)}</div>
          </div>
          <div className="space-y-2">
            <Label>Saldo Restante</Label>
            <div className="text-2xl font-bold text-green-600">R$ {saldoRestante.toFixed(2)}</div>
          </div>
          <div className="space-y-2">
            <Label>Progresso de Gastos</Label>
            <Progress value={percentualGasto} className="w-full" />
            <div className="text-sm text-gray-500">
              {percentualGasto.toFixed(1)}% do limite utilizado
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="novo-limite">Definir Novo Limite</Label>
            <div className="flex space-x-2">
              <Input
                id="novo-limite"
                type="number"
                placeholder="Novo limite mensal"
                value={novoLimite}
                onChange={(e) => setNovoLimite(e.target.value)}
              />
              <Button onClick={atualizarLimite}>Atualizar</Button>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <div className="text-sm text-gray-500">
            Mantenha seus gastos sob controle para atingir suas metas financeiras.
          </div>
        </CardFooter>
      </Card>
      <ToastContainer />
    </div>
  )
}