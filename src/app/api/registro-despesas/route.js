import { NextResponse } from 'next/server';

// Simulando um banco de dados em memória (para fins de desenvolvimento)
let despesas = [];

// GET - Buscar todas as despesas
export async function GET() {
  try {
    return NextResponse.json(despesas);
  } catch (error) {
    console.error('Erro ao buscar despesas:', error);
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
    if (!novaDespesa.descricao || !novaDespesa.valor) {
      return NextResponse.json(
        { error: 'Descrição e valor são obrigatórios' },
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
    // Aqui você deve salvar as despesas em um banco de dados ou arquivo

    // Atualiza o gasto atual na rota de limite mensal
    try {
      await fetch('/api/limite-mensal', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gastoAtual: despesaCompleta.valor // Adiciona o valor da nova despesa
        })
      });
    } catch (error) {
      console.error('Erro ao atualizar gasto atual:', error);
    }

    return NextResponse.json(despesaCompleta);
  } catch (error) {
    console.error('Erro ao registrar despesa:', error);
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

    despesas = despesas.filter(d => d.id !== id); // Remove a despesa da lista

    return NextResponse.json({ success: true }); // Retorna uma resposta de sucesso
  } catch (error) {
    console.error('Erro ao remover despesa:', error);
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
    // Aqui você deve atualizar o armazenamento persistente

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
    console.error('Erro ao atualizar despesa:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar despesa' },
      { status: 500 }
    );
  }
}
