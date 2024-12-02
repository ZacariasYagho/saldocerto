import { NextResponse } from 'next/server';

// Simulando um banco de dados em memória
let despesasDivididas = [];
let idCounter = 0; // Contador para gerar IDs únicos

// Função para gerar um ID único
const generateId = () => {
  return `id-${Date.now()}-${idCounter++}`; // Gera um ID baseado no timestamp e um contador
};

// GET - Buscar todas as despesas divididas
export async function GET() {
  try {
    return NextResponse.json(despesasDivididas);
  } catch (error) {
    console.error('Erro ao buscar despesas:', error);
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
    if (!novaDespesa.descricao || !novaDespesa.valor || !novaDespesa.participantes || novaDespesa.participantes.length === 0) {
      return NextResponse.json(
        { error: 'Dados incompletos ou participantes ausentes' },
        { status: 400 }
      );
    }

    const valor = parseFloat(novaDespesa.valor);
    if (isNaN(valor) || valor <= 0) {
      return NextResponse.json(
        { error: 'Valor deve ser um número positivo' },
        { status: 400 }
      );
    }

    // Validação dos participantes
    for (const participante of novaDespesa.participantes) {
      if (!participante.nome || typeof participante.nome !== 'string' || participante.nome.trim() === '') {
        return NextResponse.json(
          { error: 'Nome de participante inválido' },
          { status: 400 }
        );
      }
    }

    // Adiciona ID e data de criação
    const despesaCompleta = {
      ...novaDespesa,
      id: generateId(), // Usando a função para gerar um ID único
      dataCriacao: new Date(),
      valorPorPessoa: valor / novaDespesa.participantes.length
    };

    despesasDivididas.push(despesaCompleta);

    // Atualiza também os dados da home financeira
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/home-financeira`, {
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

    // Verifica se a resposta da home financeira foi bem-sucedida
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Erro ao atualizar home financeira:', errorData);
      return NextResponse.json(
        { error: 'Erro ao atualizar home financeira' },
        { status: 500 }
      );
    }

    return NextResponse.json(despesaCompleta, { status: 201 }); // Retorna a despesa criada com status 201
  } catch (error) {
    console.error('Erro ao criar despesa dividida:', error);
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
    console.error('Erro ao remover despesa:', error);
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
    console.error('Erro ao atualizar despesa:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar despesa dividida' },
      { status: 500 }
    );
  }
}
