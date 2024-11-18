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

type Expense = {
  descricao: string;
  valor: string;
  categoria: string;
  data: string;
}

export default function RegistroDespesas() {
  const [expense, setExpense] = useState<Expense>({
    descricao: '',
    valor: '',
    categoria: '',
    data: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setExpense(prev => ({ ...prev, [name]: value }))
  }

  const handleCategoryChange = (value: string) => {
    setExpense(prev => ({ ...prev, categoria: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would add the logic to save the expense
    console.log(expense)
    
    // Clear the form
    setExpense({
      descricao: '',
      valor: '',
      categoria: '',
      data: ''
    })

    // Show visual confirmation
    toast.success('Despesa adicionada com sucesso!', {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    })
  }

  const handleBack = () => {
    // Add navigation logic here
    console.log('Voltar button clicked')
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      <Button 
        variant="outline" 
        className="w-full justify-start" 
        onClick={handleBack}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Voltar
      </Button>
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
                  <SelectValue>Selecione uma categoria</SelectValue>
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
      <ToastContainer />
    </div>
  )
}