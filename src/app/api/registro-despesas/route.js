import { NextResponse } from 'next/server';

// Simulando um banco de dados em memória
let despesas = [];

// GET - Buscar todas as despesas
export async function GET() {
  try {
    return NextResponse.json(despesas);
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao buscar despesas' },
      { status: 500 }
    );
  }
}

// POST - Adicionar nova despesa
export async function POST(request) {
  try {
    const novaDespesa = await request.json();
    
    // Validação dos dados
    if (!novaDespesa.descricao || !novaDespesa.valor || !novaDespesa.categoria || !novaDespesa.data) {
      return NextResponse.json(
        { error: 'Todos os campos são obrigatórios' },
        { status: 400 }
      );
    }

    // Validação do valor
    if (parseFloat(novaDespesa.valor) <= 0) {
      return NextResponse.json(
        { error: 'O valor deve ser maior que zero' },
        { status: 400 }
      );
    }

    // Adiciona ID e timestamp
    const despesaCompleta = {
      ...novaDespesa,
      id: Date.now(),
      timestamp: new Date(),
      valor: parseFloat(novaDespesa.valor)
    };

    // Adiciona à lista de despesas
    despesas.push(despesaCompleta);

    // Atualiza o gasto mensal na home financeira
    try {
      await fetch('/api/home-financeira', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tipo: 'gastos',
          valor: despesaCompleta.valor
        })
      });
    } catch (error) {
      console.error('Erro ao atualizar home:', error);
    }

    return NextResponse.json(despesaCompleta);
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao registrar despesa' },
      { status: 500 }
    );
  }
}

// DELETE - Remover despesa
export async function DELETE(request) {
  try {
    const { id } = await request.json();
    const despesaRemovida = despesas.find(d => d.id === id);
    
    if (!despesaRemovida) {
      return NextResponse.json(
        { error: 'Despesa não encontrada' },
        { status: 404 }
      );
    }

    despesas = despesas.filter(d => d.id !== id);

    // Atualiza o gasto mensal na home financeira (subtrai o valor removido)
    try {
      await fetch('/api/home-financeira', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tipo: 'gastos',
          valor: -despesaRemovida.valor // valor negativo para subtrair
        })
      });
    } catch (error) {
      console.error('Erro ao atualizar home:', error);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao remover despesa' },
      { status: 500 }
    );
  }
}

// PUT - Atualizar despesa
export async function PUT(request) {
  try {
    const despesaAtualizada = await request.json();
    
    if (!despesaAtualizada.id) {
      return NextResponse.json(
        { error: 'ID da despesa é obrigatório' },
        { status: 400 }
      );
    }

    const despesaAntiga = despesas.find(d => d.id === despesaAtualizada.id);
    if (!despesaAntiga) {
      return NextResponse.json(
        { error: 'Despesa não encontrada' },
        { status: 404 }
      );
    }

    // Atualiza a despesa
    despesas = despesas.map(d => 
      d.id === despesaAtualizada.id ? 
      { ...despesaAtualizada, valor: parseFloat(despesaAtualizada.valor) } : 
      d
    );

    // Atualiza o gasto mensal na home financeira (diferença entre valores)
    const diferenca = parseFloat(despesaAtualizada.valor) - despesaAntiga.valor;
    try {
      await fetch('/api/home-financeira', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tipo: 'gastos',
          valor: diferenca
        })
      });
    } catch (error) {
      console.error('Erro ao atualizar home:', error);
    }

    return NextResponse.json(despesaAtualizada);
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao atualizar despesa' },
      { status: 500 }
    );
  }
}
