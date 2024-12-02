'use client'
import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useRouter } from 'next/navigation'

export default function LimiteMensal() {
  const router = useRouter()
  const [limiteMensal, setLimiteMensal] = useState(1000)
  const [gastoAtual, setGastoAtual] = useState(0)
  const [novoLimite, setNovoLimite] = useState('')

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const response = await fetch('/api/limite-mensal');
      const dados = await response.json();
      
      if (response.ok) {
        setLimiteMensal(dados.limiteMensal);
        setGastoAtual(dados.gastoAtual);
      } else {
        toast.error('Erro ao carregar dados');
      }
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Erro ao carregar dados');
    }
  };

  const atualizarLimite = async () => {
    try {
      const valor = parseFloat(novoLimite);
      
      if (isNaN(valor) || valor <= 0) {
        toast.error('Por favor, insira um valor válido');
        return;
      }

      const response = await fetch('/api/limite-mensal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ valor })
      });

      if (response.ok) {
        const dados = await response.json();
        setLimiteMensal(dados.limiteMensal);
        setNovoLimite('');
        toast.success('Limite atualizado com sucesso!');
      } else {
        toast.error('Erro ao atualizar limite');
      }
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Erro ao atualizar limite');
    }
  };

  const saldoRestante = limiteMensal - gastoAtual;
  const percentualGasto = limiteMensal > 0 ? (gastoAtual / limiteMensal) * 100 : 0;

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
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