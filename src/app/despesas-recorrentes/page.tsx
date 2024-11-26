'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { ArrowLeft } from 'lucide-react'

type Frequencia = 'diaria' | 'semanal' | 'mensal'

interface DespesaRecorrente {
  descricao: string
  valor: number
  frequencia: Frequencia
  proximaData: Date
}

export default function DespesasRecorrentes() {
  const [descricao, setDescricao] = useState('')
  const [valor, setValor] = useState('')
  const [frequencia, setFrequencia] = useState<Frequencia>('mensal')
  const [despesasRecorrentes, setDespesasRecorrentes] = useState<DespesaRecorrente[]>([])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const novaDespesa: DespesaRecorrente = {
      descricao,
      valor: parseFloat(valor),
      frequencia,
      proximaData: calcularProximaData(new Date(), frequencia)
    }
    setDespesasRecorrentes([...despesasRecorrentes, novaDespesa])
    
    // Limpar o formulário
    setDescricao('')
    setValor('')
    setFrequencia('mensal')

    toast.success('Despesa recorrente cadastrada com sucesso!')
  }

  const calcularProximaData = (data: Date, frequencia: Frequencia): Date => {
    const novaData = new Date(data)
    switch (frequencia) {
      case 'diaria':
        novaData.setDate(novaData.getDate() + 1)
        break
      case 'semanal':
        novaData.setDate(novaData.getDate() + 7)
        break
      case 'mensal':
        novaData.setMonth(novaData.getMonth() + 1)
        break
    }
    return novaData
  }

  // Simula a adição automática de despesas (em um cenário real, isso seria feito por um job agendado)
  const simularAdicaoAutomatica = () => {
    const hoje = new Date()
    const despesasAtualizadas = despesasRecorrentes.map(despesa => {
      if (despesa.proximaData <= hoje) {
        toast.info(`Despesa "${despesa.descricao}" adicionada automaticamente.`)
        return {
          ...despesa,
          proximaData: calcularProximaData(despesa.proximaData, despesa.frequencia)
        }
      }
      return despesa
    })
    setDespesasRecorrentes(despesasAtualizadas)
  }

  const handleBack = () => {
    // Add navigation logic here
    console.log('Voltar button clicked')
  }

  const removerDespesa = (index: number) => {
    const despesasAtualizadas = despesasRecorrentes.filter((_, i) => i !== index)
    setDespesasRecorrentes(despesasAtualizadas)
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
          <CardTitle>Cadastro de Despesas Recorrentes</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição</Label>
              <Input 
                id="descricao" 
                value={descricao} 
                onChange={(e) => setDescricao(e.target.value)} 
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="valor">Valor</Label>
              <Input 
                id="valor" 
                type="number" 
                step="0.01" 
                value={valor} 
                onChange={(e) => setValor(e.target.value)} 
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="frequencia">Frequência</Label>
              <Select value={frequencia} onValueChange={(value: Frequencia) => setFrequencia(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a frequência" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="diaria">Diária</SelectItem>
                  <SelectItem value="semanal">Semanal</SelectItem>
                  <SelectItem value="mensal">Mensal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full">Cadastrar Despesa Recorrente</Button>
          </form>
        </CardContent>
        <CardFooter className="flex-col items-start">
          <h3 className="text-lg font-semibold mb-2">Despesas Recorrentes Cadastradas</h3>
          <ul className="w-full space-y-2">
            {despesasRecorrentes.map((despesa, index) => (
              <li key={index} className="flex justify-between items-center bg-gray-100 p-2 rounded">
                <span>{despesa.descricao}</span>
                <span>R$ {despesa.valor.toFixed(2)} ({despesa.frequencia})</span>
                <Button onClick={() => removerDespesa(index)} className="ml-2">
                  Remover
                </Button>
              </li>
            ))}
          </ul>
          <Button onClick={simularAdicaoAutomatica} className="mt-4">
            Simular Adição Automática
          </Button>
        </CardFooter>
      </Card>
      <ToastContainer />
    </div>
  )
}