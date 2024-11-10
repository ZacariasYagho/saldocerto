'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { ArrowLeft, X } from 'lucide-react'

interface Participante {
  nome: string
  parte: number
}

export default function DivisaoDespesas() {
  const [descricao, setDescricao] = useState('')
  const [valor, setValor] = useState('')
  const [novoParticipante, setNovoParticipante] = useState('')
  const [participantes, setParticipantes] = useState<Participante[]>([])

  const adicionarParticipante = () => {
    if (novoParticipante.trim() === '') {
      toast.error('Por favor, insira um nome para o participante.')
      return
    }
    setParticipantes([...participantes, { nome: novoParticipante, parte: 0 }])
    setNovoParticipante('')
  }

  const removerParticipante = (index: number) => {
    setParticipantes(participantes.filter((_, i) => i !== index))
  }

  const calcularDivisao = () => {
    const valorTotal = parseFloat(valor)
    if (isNaN(valorTotal) || valorTotal <= 0) {
      toast.error('Por favor, insira um valor válido para a despesa.')
      return
    }
    if (participantes.length === 0) {
      toast.error('Adicione pelo menos um participante para dividir a despesa.')
      return
    }
    const valorPorPessoa = valorTotal / participantes.length
    const novoParticipantes = participantes.map(p => ({ ...p, parte: valorPorPessoa }))
    setParticipantes(novoParticipantes)
    toast.success('Despesa dividida com sucesso!')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    calcularDivisao()
  }

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
          <CardTitle>Divisão de Despesas</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição da Despesa</Label>
              <Input 
                id="descricao" 
                value={descricao} 
                onChange={(e) => setDescricao(e.target.value)} 
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="valor">Valor Total</Label>
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
              <Label htmlFor="novo-participante">Adicionar Participante</Label>
              <div className="flex space-x-2">
                <Input 
                  id="novo-participante" 
                  value={novoParticipante} 
                  onChange={(e) => setNovoParticipante(e.target.value)} 
                  placeholder="Nome do participante"
                />
                <Button type="button" onClick={adicionarParticipante}>Adicionar</Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Participantes</Label>
              <ul className="space-y-2">
                {participantes.map((participante, index) => (
                  <li key={index} className="flex justify-between items-center bg-gray-100 p-2 rounded">
                    <span>{participante.nome}</span>
                    <div className="flex items-center space-x-2">
                      <span>R$ {participante.parte.toFixed(2)}</span>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon"
                        onClick={() => removerParticipante(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <Button type="submit" className="w-full">Calcular Divisão</Button>
          </form>
        </CardContent>
        <CardFooter className="flex-col items-start">
          <h3 className="text-lg font-semibold mb-2">Resumo da Divisão</h3>
          <p>Despesa: {descricao}</p>
          <p>Valor Total: R$ {parseFloat(valor || '0').toFixed(2)}</p>
          <p>Número de Participantes: {participantes.length}</p>
          {participantes.length > 0 && (
            <p>Valor por Pessoa: R$ {(parseFloat(valor || '0') / participantes.length).toFixed(2)}</p>
          )}
        </CardFooter>
      </Card>
      <ToastContainer />
    </div>
  )
}