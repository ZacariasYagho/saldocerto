'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle, XCircle, HelpCircle, ArrowLeft } from "lucide-react"
import { useRouter } from 'next/navigation'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function RelatorioGastosSimplificado() {
  const router = useRouter()
  const [periodo, setPeriodo] = useState('mensal')
  const [isLoading, setIsLoading] = useState(false)
  const [dados, setDados] = useState({
    orcamento: 0,
    gastoTotal: 0,
    temDados: true,
    gastosPorCategoria: {}
  })

  useEffect(() => {
    carregarRelatorio();
  }, [periodo]);

  const carregarRelatorio = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/relatorio-gasto-simplificado?periodo=${periodo}`);
      
      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.status}`);
      }
      
      const dadosRelatorio = await response.json();
      
      if (!dadosRelatorio) {
        throw new Error('Dados não encontrados');
      }
      
      setDados({
        orcamento: dadosRelatorio.orcamento || 0,
        gastoTotal: dadosRelatorio.gastoTotal || 0,
        temDados: true,
        gastosPorCategoria: dadosRelatorio.gastosPorCategoria || {}
      });
      
    } catch (error) {
      console.error('Erro ao carregar relatório:', error);
      toast.error('Erro ao carregar relatório. Tente novamente.');
      
      setDados({
        orcamento: 0,
        gastoTotal: 0,
        temDados: false,
        gastosPorCategoria: {}
      });
    } finally {
      setIsLoading(false)
    }
  };

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

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
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
          {isLoading ? (
            <div className="text-center py-4">Carregando...</div>
          ) : (
            <>
              {relatorio && (
                <Alert variant={relatorio.tipo as 'default' | 'destructive'}>
                  <relatorio.icone className="h-4 w-4" />
                  <AlertTitle>{relatorio.titulo}</AlertTitle>
                  <AlertDescription>{relatorio.descricao}</AlertDescription>
                </Alert>
              )}
              {dados.temDados && (
                <div className="mt-4 space-y-2">
                  <p><strong>Orçamento {periodo}:</strong> R$ {dados.orcamento.toFixed(2)}</p>
                  <p><strong>Gasto total:</strong> R$ {dados.gastoTotal.toFixed(2)}</p>
                  {Object.entries(dados.gastosPorCategoria).length > 0 && (
                    <div className="mt-4">
                      <h3 className="font-semibold mb-2">Gastos por Categoria:</h3>
                      {Object.entries(dados.gastosPorCategoria).map(([categoria, valor]) => (
                        <p key={categoria}>
                          <strong>{categoria}:</strong> R$ {(valor as number).toFixed(2)}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
      <ToastContainer />
    </div>
  )
}