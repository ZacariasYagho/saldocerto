'use client';
import { useState, useEffect } from 'react';
import { apiService } from '@/services/api';

export default function MeuComponente() {
  const [dados, setDados] = useState([]);
  const [editando, setEditando] = useState(null);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    const dadosCarregados = await apiService.buscarDados();
    setDados(dadosCarregados);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const dado = {
      nome: formData.get('nome'),
      email: formData.get('email'),
      // outros campos...
    };

    if (editando) {
      await apiService.atualizarDado({ ...dado, id: editando.id });
      setEditando(null);
    } else {
      await apiService.criarDado(dado);
    }

    carregarDados();
    e.target.reset();
  };

  const handleDelete = async (id) => {
    await apiService.deletarDado(id);
    carregarDados();
  };

  const handleEdit = (item) => {
    setEditando(item);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input 
          name="nome" 
          placeholder="Nome"
          defaultValue={editando?.nome || ''}
        />
        <input 
          name="email" 
          placeholder="Email"
          defaultValue={editando?.email || ''}
        />
        <button type="submit">
          {editando ? 'Atualizar' : 'Salvar'}
        </button>
        {editando && (
          <button type="button" onClick={() => setEditando(null)}>
            Cancelar
          </button>
        )}
      </form>

      <ul>
        {dados.map((item) => (
          <li key={item.id}>
            {item.nome} - {item.email}
            <button onClick={() => handleEdit(item)}>Editar</button>
            <button onClick={() => handleDelete(item.id)}>Deletar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}