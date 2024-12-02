'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { ArrowLeft, X } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Participante {
  id: string
  nome: string
  parte: number
}

export default function DivisaoDespesas() {
  const router = useRouter()
  const [descricao, setDescricao] = useState('')
  const [valor, setValor] = useState('')
  const [novoParticipante, setNovoParticipante] = useState('')
  const [participantes, setParticipantes] = useState<Participante[]>([])
  const [currentDate, setCurrentDate] = useState('')

  useEffect(() => {
    carregarDespesas();
    setCurrentDate(new Date().toLocaleString());
  }, []);

  const carregarDespesas = async () => {
    try {
      const response = await fetch('/api/divisao-despesas');
      const dados = await response.json();
      // Aqui você pode decidir se quer carregar despesas anteriores
      // setDespesasDivididas(dados);
    } catch (error) {
      console.error('Erro ao carregar despesas:', error);
      toast.error('Erro ao carregar despesas');
    }
  };

  const adicionarParticipante = () => {
    if (novoParticipante.trim() === '') {
      toast.error('Por favor, insira um nome para o participante.')
      return
    }
    
    const novoParticipanteObj: Participante = {
      id: `id-${Date.now()}-${Math.random()}`,
      nome: novoParticipante.trim(),
      parte: 0
    }
    
    setParticipantes(prev => [...prev, novoParticipanteObj])
    setNovoParticipante('')
  }

  const removerParticipante = (id: string) => {
    setParticipantes(prev => prev.filter(p => p.id !== id))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const valorTotal = parseFloat(valor);
    if (isNaN(valorTotal) || valorTotal <= 0) {
      toast.error('Por favor, insira um valor válido para a despesa.');
      return;
    }
    if (participantes.length === 0) {
      toast.error('Adicione pelo menos um participante para dividir a despesa.');
      return;
    }

    const valorPorPessoa = valorTotal / participantes.length;
    const novoParticipantes = participantes.map(p => ({ ...p, parte: valorPorPessoa }));

    try {
      const response = await fetch('/api/divisao-despesas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          descricao,
          valor: valorTotal,
          participantes: novoParticipantes
        })
      });

      if (!response.ok) {
        const errorData = await response.json(); // Captura a resposta de erro
        toast.error(`Erro ao salvar despesa dividida: ${errorData.error || 'Erro desconhecido'}`);
        return;
      }

      const despesaAdicionada = await response.json(); // Captura a despesa adicionada
      setParticipantes(novoParticipantes);
      toast.success('Despesa dividida com sucesso!');
      
      // Limpar formulário
      setDescricao('');
      setValor('');
      setParticipantes([]);
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Erro ao salvar despesa dividida');
    }
  };

  const handleBack = () => {
    // Adicione a lógica de navegação aqui
    console.log('Voltar button clicked')
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
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
                {participantes.map((participante) => (
                  <li key={participante.id} className="flex justify-between items-center bg-gray-100 p-2 rounded">
                    <span>{participante.nome}</span>
                    <div className="flex items-center space-x-2">
                      {participante.parte > 0 && (
                        <span>R$ {participante.parte.toFixed(2)}</span>
                      )}
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon"
                        onClick={() => removerParticipante(participante.id)}
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
          <p>Despesa: {descricao || 'Não definida'}</p>
          <p>Valor Total: R$ {parseFloat(valor || '0').toFixed(2)}</p>
          <p>Número de Participantes: {participantes.length}</p>
          {participantes.length > 0 && valor && (
            <div className="w-full mt-2">
              <p>Valor por Pessoa: R$ {(parseFloat(valor) / participantes.length).toFixed(2)}</p>
              <div className="mt-2">
                <h4 className="font-medium">Divisão:</h4>
                <ul className="mt-1">
                  {participantes.map((p) => (
                    <li key={p.id} className="flex justify-between">
                      <span>{p.nome}</span>
                      <span>R$ {(parseFloat(valor) / participantes.length).toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </CardFooter>
      </Card>
      <ToastContainer />
      <p>Data atual: {currentDate}</p>
    </div>
  )
}