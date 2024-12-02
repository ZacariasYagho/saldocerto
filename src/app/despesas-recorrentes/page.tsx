'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useRouter } from 'next/navigation'

type Frequencia = 'diaria' | 'semanal' | 'mensal'

interface DespesaRecorrente {
  id?: number;
  descricao: string;
  valor: number;
  frequencia: Frequencia;
  proximaData: Date;
}

export default function DespesasRecorrentes() {
  const router = useRouter()
  const [descricao, setDescricao] = useState('')
  const [valor, setValor] = useState('')
  const [frequencia, setFrequencia] = useState<Frequencia>('mensal')
  const [despesasRecorrentes, setDespesasRecorrentes] = useState<DespesaRecorrente[]>([])
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Carregar despesas ao montar o componente
  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/despesas-recorrentes');
      
      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }
      
      const dados = await response.json();
      
      // Verifica se dados é um array
      if (!Array.isArray(dados)) {
        throw new Error('Formato de dados inválido');
      }
      
      // Converte as datas string para objeto Date
      const despesasFormatadas = dados.map(despesa => ({
        ...despesa,
        proximaData: new Date(despesa.proximaData)
      }));
      
      setDespesasRecorrentes(despesasFormatadas);
    } catch (error) {
      const mensagem = error instanceof Error ? error.message : 'Erro ao carregar despesas';
      setError(mensagem);
      toast.error(mensagem);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const novaDespesa: DespesaRecorrente = {
      descricao,
      valor: parseFloat(valor),
      frequencia,
      proximaData: calcularProximaData(new Date(), frequencia)
    };

    try {
      const response = await fetch('/api/despesas-recorrentes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novaDespesa)
      });

      if (response.ok) {
        const despesaSalva = await response.json();
        setDespesasRecorrentes([...despesasRecorrentes, despesaSalva]);
        
        // Limpar o formulário
        setDescricao('');
        setValor('');
        setFrequencia('mensal');

        toast.success('Despesa recorrente cadastrada com sucesso!');
      } else {
        toast.error('Erro ao cadastrar despesa');
      }
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Erro ao cadastrar despesa');
    }
  };

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

  const removerDespesa = async (id: number) => {
    try {
      const response = await fetch('/api/despesas-recorrentes', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });

      if (response.ok) {
        setDespesasRecorrentes(despesas => 
          despesas.filter(despesa => despesa.id !== id)
        );
        toast.success('Despesa removida com sucesso!');
      } else {
        toast.error('Erro ao remover despesa');
      }
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Erro ao remover despesa');
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Cadastro de Despesas Recorrentes</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-4">
              Carregando despesas...
            </div>
          ) : error ? (
            <div className="text-red-500 text-center py-4">
              {error}
              <Button 
                onClick={() => carregarDados()} 
                variant="outline" 
                size="sm" 
                className="ml-2"
              >
                Tentar novamente
              </Button>
            </div>
          ) : (
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
          )}
        </CardContent>
        <CardFooter className="flex-col items-start">
          <h3 className="text-lg font-semibold mb-2">Despesas Recorrentes Cadastradas</h3>
          <ul className="w-full space-y-2">
            {despesasRecorrentes.map((despesa, index) => (
              <li key={index} className="flex justify-between items-center bg-gray-100 p-2 rounded">
                <span>{despesa.descricao}</span>
                <span>R$ {despesa.valor.toFixed(2)} ({despesa.frequencia})</span>
                <Button 
                  onClick={() => despesa.id ? removerDespesa(despesa.id) : null} 
                  className="ml-2"
                  disabled={!despesa.id}
                >
                  Remover
                </Button>
              </li>
            ))}
          </ul>
        </CardFooter>
      </Card>
      <ToastContainer />
    </div>
  )
}