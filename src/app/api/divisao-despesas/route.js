import { NextResponse } from 'next/server';

// Simulando um banco de dados em memória
let despesasDivididas = [];

// GET - Buscar todas as despesas divididas
export async function GET() {
  try {
    return NextResponse.json(despesasDivididas);
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao buscar despesas divididas' },
      { status: 500 }
    );
  }
}

// POST - Adicionar nova despesa dividida
export async function POST(request) {
  try {
    const novaDespesa = await request.json();
    
    // Validação dos dados
    if (!novaDespesa.descricao || !novaDespesa.valor || !novaDespesa.participantes) {
      return NextResponse.json(
        { error: 'Dados incompletos' },
        { status: 400 }
      );
    }

    // Adiciona ID e data de criação
    const despesaCompleta = {
      ...novaDespesa,
      id: Date.now(),
      dataCriacao: new Date(),
      valorPorPessoa: novaDespesa.valor / novaDespesa.participantes.length
    };

    despesasDivididas.push(despesaCompleta);

    // Atualiza também os dados da home financeira
    await fetch('/api/home-financeira', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tipo: 'despesa-dividida',
        despesa: {
          descricao: despesaCompleta.descricao,
          valor: despesaCompleta.valor,
          participantes: despesaCompleta.participantes.length
        }
      })
    });

    return NextResponse.json(despesaCompleta);
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao criar despesa dividida' },
      { status: 500 }
    );
  }
}

// DELETE - Remover despesa dividida
export async function DELETE(request) {
  try {
    const { id } = await request.json();
    despesasDivididas = despesasDivididas.filter(despesa => despesa.id !== id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao remover despesa dividida' },
      { status: 500 }
    );
  }
}

// PUT - Atualizar despesa dividida
export async function PUT(request) {
  try {
    const despesaAtualizada = await request.json();
    
    despesasDivididas = despesasDivididas.map(despesa => 
      despesa.id === despesaAtualizada.id ? 
      {
        ...despesaAtualizada,
        valorPorPessoa: despesaAtualizada.valor / despesaAtualizada.participantes.length
      } : 
      despesa
    );

    return NextResponse.json(despesaAtualizada);
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao atualizar despesa dividida' },
      { status: 500 }
    );
  }
}
