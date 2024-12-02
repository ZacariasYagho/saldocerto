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

// POST - Atualizar limite mensal ou registrar um gasto
export async function POST(request) {
  try {
    const { valor, gasto } = await request.json();
    
    // Se um gasto for fornecido, registrar o gasto
    if (gasto) {
      // Validação do gasto
      if (!gasto.descricao || !gasto.valor) {
        return NextResponse.json(
          { error: 'Descrição e valor são obrigatórios' },
          { status: 400 }
        );
      }

      // Atualiza o gasto atual
      dadosLimite.gastoAtual += parseFloat(gasto.valor);
      // Aqui você pode adicionar lógica para armazenar o gasto em um histórico, se necessário

      return NextResponse.json(dadosLimite);
    }

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

    return NextResponse.json({
      limiteMensal: dadosLimite.limiteMensal,
      gastoAtual: dadosLimite.gastoAtual
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Erro ao atualizar limite' },
      { status: 500 }
    );
  }
}

// PUT - Atualizar gasto atual
export async function PUT(request) {
  try {
    const { gastoAtual } = await request.json();
    
    // Validação do gasto atual
    if (gastoAtual < 0) {
      return NextResponse.json(
        { error: 'Gasto não pode ser negativo' },
        { status: 400 }
      );
    }

    // Atualiza o gasto atual
    dadosLimite.gastoAtual += gastoAtual;

    return NextResponse.json(dadosLimite);
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao atualizar gasto atual' },
      { status: 500 }
    );
  }
}
