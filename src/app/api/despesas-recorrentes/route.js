import { NextResponse } from 'next/server';

// Simulando um banco de dados em memória
let despesasRecorrentes = [];

// GET - Buscar todas as despesas recorrentes
export async function GET() {
  try {
    return NextResponse.json(despesasRecorrentes);
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao buscar despesas recorrentes' },
      { status: 500 }
    );
  }
}

// POST - Adicionar nova despesa recorrente
export async function POST(request) {
  try {
    const novaDespesa = await request.json();
    
    // Validação dos dados
    if (!novaDespesa.descricao || !novaDespesa.valor || !novaDespesa.frequencia) {
      return NextResponse.json(
        { error: 'Dados incompletos' },
        { status: 400 }
      );
    }

    // Adiciona ID e data de criação
    const despesaCompleta = {
      ...novaDespesa,
      id: Date.now(), // ID único baseado no timestamp
      dataCriacao: new Date(),
      proximaData: calcularProximaData(new Date(), novaDespesa.frequencia)
    };

    despesasRecorrentes.push(despesaCompleta);
    return NextResponse.json(despesaCompleta);
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao criar despesa recorrente' },
      { status: 500 }
    );
  }
}

// DELETE - Remover despesa recorrente
export async function DELETE(request) {
  try {
    const { id } = await request.json();
    // Filtra as despesas para remover a despesa com o ID fornecido
    despesasRecorrentes = despesasRecorrentes.filter(despesa => despesa.id !== id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao remover despesa recorrente' },
      { status: 500 }
    );
  }
}

// PUT - Atualizar despesa recorrente
export async function PUT(request) {
  try {
    const despesaAtualizada = await request.json();
    
    despesasRecorrentes = despesasRecorrentes.map(despesa => 
      despesa.id === despesaAtualizada.id ? despesaAtualizada : despesa
    );

    return NextResponse.json(despesaAtualizada);
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao atualizar despesa recorrente' },
      { status: 500 }
    );
  }
}

// Função auxiliar para calcular próxima data
function calcularProximaData(data, frequencia) {
  const novaData = new Date(data);
  switch (frequencia) {
    case 'diaria':
      novaData.setDate(novaData.getDate() + 1);
      break;
    case 'semanal':
      novaData.setDate(novaData.getDate() + 7);
      break;
    case 'mensal':
      novaData.setMonth(novaData.getMonth() + 1);
      break;
  }
  return novaData;
}
