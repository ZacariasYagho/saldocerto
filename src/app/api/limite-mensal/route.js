import { NextResponse } from 'next/server';

// Simulando um banco de dados em memória
let dadosLimite = {
  limiteMensal: 1000,
  gastoAtual: 0,
  historicoLimites: []
};

// GET - Buscar limite atual e gastos
export async function GET() {
  try {
    return NextResponse.json({
      limiteMensal: dadosLimite.limiteMensal,
      gastoAtual: dadosLimite.gastoAtual
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao buscar dados do limite' },
      { status: 500 }
    );
  }
}

// POST - Atualizar limite mensal
export async function POST(request) {
  try {
    const { valor } = await request.json();
    
    // Validação do valor
    if (!valor || valor <= 0) {
      return NextResponse.json(
        { error: 'Valor inválido para o limite' },
        { status: 400 }
      );
    }

    // Guarda o limite anterior no histórico
    dadosLimite.historicoLimites.push({
      valor: dadosLimite.limiteMensal,
      data: new Date()
    });

    // Atualiza o novo limite
    dadosLimite.limiteMensal = valor;

    // Atualiza também na home financeira
    try {
      await fetch('/api/home-financeira', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tipo: 'limite',
          valor: valor
        })
      });
    } catch (error) {
      console.error('Erro ao atualizar home:', error);
    }

    return NextResponse.json({
      limiteMensal: dadosLimite.limiteMensal,
      gastoAtual: dadosLimite.gastoAtual
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao atualizar limite' },
      { status: 500 }
    );
  }
}

// PUT - Atualizar gasto atual
export async function PUT(request) {
  try {
    const { gastoAtual } = await request.json();
    
    if (gastoAtual < 0) {
      return NextResponse.json(
        { error: 'Gasto não pode ser negativo' },
        { status: 400 }
      );
    }

    dadosLimite.gastoAtual = gastoAtual;

    return NextResponse.json(dadosLimite);
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao atualizar gasto atual' },
      { status: 500 }
    );
  }
}
