import { NextResponse } from 'next/server';

// Simulando um banco de dados em memória
let dadosFinanceiros = {
  saldoAtual: 0,
  limiteMensal: 0,
  gastosMes: 0,
  despesasMes: [],
  despesasRecorrentes: [],
  despesasDivididas: []
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
        // Atualiza o gastosMes com a nova despesa recorrente
        dadosFinanceiros.gastosMes += novosDados.despesa.valor;
        break;
      case 'despesa-dividida':
        dadosFinanceiros.despesasDivididas.push(novosDados.despesa);
        // Atualiza o gastosMes com a nova despesa dividida
        dadosFinanceiros.gastosMes += novosDados.despesa.valor;
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
      const despesaRemovida = dadosFinanceiros.despesasRecorrentes[id];
      dadosFinanceiros.despesasRecorrentes = dadosFinanceiros.despesasRecorrentes
        .filter((_, index) => index !== id);
      // Atualiza o gastosMes ao remover a despesa recorrente
      dadosFinanceiros.gastosMes -= despesaRemovida.valor;
    } else if (tipo === 'dividida') {
      const despesaRemovida = dadosFinanceiros.despesasDivididas[id];
      dadosFinanceiros.despesasDivididas = dadosFinanceiros.despesasDivididas
        .filter((_, index) => index !== id);
      // Atualiza o gastosMes ao remover a despesa dividida
      dadosFinanceiros.gastosMes -= despesaRemovida.valor;
    }

    return NextResponse.json(dadosFinanceiros);
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao remover despesa' },
      { status: 500 }
    );
  }
}
