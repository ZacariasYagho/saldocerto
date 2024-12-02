'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

type Expense = {
  id: number;
  descricao: string;
  valor: string;
  categoria: string;
  data: string;
}

export default function RegistroDespesas() {
  const router = useRouter()
  const [expense, setExpense] = useState<Expense>({
    id: 0,
    descricao: '',
    valor: '',
    categoria: '',
    data: ''
  })
  const [despesas, setDespesas] = useState<Expense[]>([]);

  // Carrega despesas do localStorage ao montar o componente
  useEffect(() => {
    try {
      const storedDespesas = localStorage.getItem('despesas');
      if (storedDespesas) {
        const parsedDespesas = JSON.parse(storedDespesas);
        // Verifica se parsedDespesas é um array
        if (Array.isArray(parsedDespesas)) {
          setDespesas(parsedDespesas);
        } else {
          console.error('Dados no localStorage não são um array válido');
        }
      }
    } catch (error) {
      console.error('Erro ao carregar despesas do localStorage:', error);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setExpense(prev => ({ ...prev, [name]: value }))
  }

  const handleCategoryChange = (value: string) => {
    setExpense(prev => ({ ...prev, categoria: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Verifica se todos os campos estão preenchidos
    if (!expense.descricao || !expense.valor || !expense.categoria || !expense.data) {
      toast.error('Todos os campos são obrigatórios.');
      return;
    }

    try {
      const response = await fetch('/api/registro-despesas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(expense)
      });

      if (response.ok) {
        const newExpense = await response.json();
        setDespesas(prev => {
          const updatedDespesas = [...prev, newExpense];
          localStorage.setItem('despesas', JSON.stringify(updatedDespesas)); // Atualiza o localStorage
          return updatedDespesas;
        });
        setExpense({ id: 0, descricao: '', valor: '', categoria: '', data: '' });
        toast.success('Despesa adicionada com sucesso!');
      } else {
        const erro = await response.json();
        console.error('Erro na resposta do servidor:', erro);
        toast.error(erro?.error || 'Erro ao adicionar despesa'); // Verifica se erro.error existe
      }
    } catch (error) {
      console.error('Erro ao enviar despesa:', error);
      toast.error('Erro ao adicionar despesa');
    }
  };

  const handleBack = () => {
    // Add navigation logic here
    console.log('Voltar button clicked')
  }

  const handleRemove = async (id: number) => {
    if (id === undefined) {
      toast.error('ID da despesa não encontrado.');
      return;
    }

    try {
      const response = await fetch('/api/registro-despesas', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });

      console.log('Resposta do servidor:', response);

      if (response.ok) {
        setDespesas(prev => {
          const updatedDespesas = prev.filter(d => d.id !== id);
          localStorage.setItem('despesas', JSON.stringify(updatedDespesas)); // Atualiza o localStorage
          return updatedDespesas;
        });
        toast.success('Despesa removida com sucesso!');
      } else {
        const erro = await response.json();
        console.error('Erro na resposta do servidor ao remover:', erro);
        toast.error(erro?.error || 'Erro ao remover despesa'); // Verifica se erro.error existe
      }
    } catch (error) {
      console.error('Erro ao remover despesa:', error);
      toast.error('Erro ao remover despesa');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Adicionar Despesa</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição</Label>
              <Input 
                id="descricao"
                name="descricao"
                value={expense.descricao} 
                onChange={handleChange} 
                required 
                aria-required="true"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="valor">Valor (R$)</Label>
              <Input 
                id="valor"
                name="valor"
                type="number" 
                step="0.01" 
                value={expense.valor} 
                onChange={handleChange} 
                required 
                aria-required="true"
                min="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="categoria">Categoria</Label>
              <Select value={expense.categoria} onValueChange={handleCategoryChange} required>
                <SelectTrigger id="categoria" aria-required="true">
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="alimentacao">Alimentação</SelectItem>
                  <SelectItem value="transporte">Transporte</SelectItem>
                  <SelectItem value="moradia">Moradia</SelectItem>
                  <SelectItem value="lazer">Lazer</SelectItem>
                  <SelectItem value="outros">Outros</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="data">Data</Label>
              <Input 
                id="data"
                name="data"
                type="date" 
                value={expense.data} 
                onChange={handleChange} 
                required 
                aria-required="true"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">Adicionar Despesa</Button>
          </CardFooter>
        </form>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Despesas Cadastradas</CardTitle>
        </CardHeader>
        <CardContent>
          {despesas.map(despesa => (
            <div key={despesa.id} className="flex justify-between items-center">
              <span>{despesa.descricao} - R$ {despesa.valor}</span>
              <Button onClick={() => handleRemove(despesa.id)} variant="outline" className="ml-2">Remover</Button>
            </div>
          ))}
        </CardContent>
      </Card>
      <ToastContainer />
    </div>
  )
}