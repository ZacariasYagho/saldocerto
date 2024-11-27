import { NextResponse } from 'next/server';

// Simulando um banco de dados em memória
let relatorios = {
  mensal: {
    orcamento: 5000,
    gastoTotal: 0,
    gastosPorCategoria: {},
    ultimaAtualizacao: new Date()
  },
  trimestral: {
    orcamento: 15000,
    gastoTotal: 0,
    gastosPorCategoria: {},
    ultimaAtualizacao: new Date()
  },
  anual: {
    orcamento: 60000,
    gastoTotal: 0,
    gastosPorCategoria: {},
    ultimaAtualizacao: new Date()
  }
};

// GET - Buscar relatório por período
export async function GET(request) {
  try {
    // Pega o período da URL
    const { searchParams } = new URL(request.url);
    const periodo = searchParams.get('periodo') || 'mensal';

    // Busca despesas da API de registro-despesas
    try {
      const responseDespesas = await fetch('http://localhost:3000/api/registro-despesas');
      const despesas = await responseDespesas.json();

      // Filtra despesas pelo período
      const dataAtual = new Date();
      const despesasFiltradas = despesas.filter(despesa => {
        const dataDespesa = new Date(despesa.data);
        const diffMeses = (dataAtual.getFullYear() - dataDespesa.getFullYear()) * 12 + 
                         (dataAtual.getMonth() - dataDespesa.getMonth());
        
        switch(periodo) {
          case 'mensal':
            return diffMeses === 0;
          case 'trimestral':
            return diffMeses <= 2;
          case 'anual':
            return diffMeses <= 11;
          default:
            return false;
        }
      });

      // Calcula totais
      const gastoTotal = despesasFiltradas.reduce((total, despesa) => total + despesa.valor, 0);
      const gastosPorCategoria = despesasFiltradas.reduce((acc, despesa) => {
        acc[despesa.categoria] = (acc[despesa.categoria] || 0) + despesa.valor;
        return acc;
      }, {});

      // Atualiza e retorna o relatório
      relatorios[periodo] = {
        ...relatorios[periodo],
        gastoTotal,
        gastosPorCategoria,
        ultimaAtualizacao: new Date()
      };

      return NextResponse.json({
        ...relatorios[periodo],
        temDados: despesasFiltradas.length > 0
      });
    } catch (error) {
      console.error('Erro ao buscar despesas:', error);
      return NextResponse.json(relatorios[periodo]);
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao gerar relatório' },
      { status: 500 }
    );
  }
}

// POST - Atualizar orçamento do período
export async function POST(request) {
  try {
    const { periodo, orcamento } = await request.json();
    
    if (!periodo || !orcamento || orcamento <= 0) {
      return NextResponse.json(
        { error: 'Dados inválidos' },
        { status: 400 }
      );
    }

    relatorios[periodo].orcamento = orcamento;
    
    return NextResponse.json(relatorios[periodo]);
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao atualizar orçamento' },
      { status: 500 }
    );
  }
}
