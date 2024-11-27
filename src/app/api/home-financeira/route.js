import { NextResponse } from 'next/server';

// Simulando um banco de dados em memória
let dadosFinanceiros = {
  saldoAtual: 5000,
  limiteMensal: 3000,
  gastosMes: 1500,
  despesasRecorrentes: [
    {
      descricao: "Netflix",
      valor: 39.90,
      vencimento: new Date(2024, 2, 15)
    },
    {
      descricao: "Academia",
      valor: 89.90,
      vencimento: new Date(2024, 2, 20)
    }
  ],
  despesasDivididas: [
    {
      descricao: "Aluguel",
      valor: 1200,
      participantes: 2
    },
    {
      descricao: "Conta de Luz",
      valor: 150,
      participantes: 3
    }
  ]
};

// GET - Buscar todos os dados
export async function GET() {
  return NextResponse.json(dadosFinanceiros);
}

// POST - Atualizar dados
export async function POST(request) {
  try {
    const novosDados = await request.json();
    
    // Atualiza os dados conforme o tipo
    switch(novosDados.tipo) {
      case 'saldo':
        dadosFinanceiros.saldoAtual = novosDados.valor;
        break;
      case 'limite':
        dadosFinanceiros.limiteMensal = novosDados.valor;
        break;
      case 'gastos':
        dadosFinanceiros.gastosMes = novosDados.valor;
        break;
      case 'despesa-recorrente':
        dadosFinanceiros.despesasRecorrentes.push(novosDados.despesa);
        break;
      case 'despesa-dividida':
        dadosFinanceiros.despesasDivididas.push(novosDados.despesa);
        break;
      case 'atualizar-tudo':
        dadosFinanceiros = { ...dadosFinanceiros, ...novosDados.dados };
        break;
    }

    return NextResponse.json(dadosFinanceiros);
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao atualizar dados' },
      { status: 500 }
    );
  }
}

// DELETE - Remover despesas
export async function DELETE(request) {
  try {
    const { tipo, id } = await request.json();
    
    if (tipo === 'recorrente') {
      dadosFinanceiros.despesasRecorrentes = dadosFinanceiros.despesasRecorrentes
        .filter((_, index) => index !== id);
    } else if (tipo === 'dividida') {
      dadosFinanceiros.despesasDivididas = dadosFinanceiros.despesasDivididas
        .filter((_, index) => index !== id);
    }

    return NextResponse.json(dadosFinanceiros);
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao remover despesa' },
      { status: 500 }
    );
  }
}
