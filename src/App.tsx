import React, { useState, useEffect } from 'react';

function App() {
  const [tasks, setTasks] = useState([]);
  const [token, setToken] = useState('');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingTaskTitle, setEditingTaskTitle] = useState('');

  const API_URL = 'http://localhost:3001'; // Altere se seu backend estiver em outro endereço

  // Função para fazer login
  const handleLogin = async () => {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'usuario', password: 'senha' }),
    });
    const data = await response.json();
    if (response.ok) {
      setToken(data.token);
      fetchTasks(data.token);
    } else {
      alert('Falha no login');
    }
  };

  // Buscar tarefas
  const fetchTasks = async (token) => {
    const response = await fetch(`${API_URL}/api/tasks`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    const data = await response.json();
    setTasks(data);
  };

  // Criar nova tarefa
  const handleAddTask = async () => {
    if (!token || newTaskTitle.trim() === '') return;
    const response = await fetch(`${API_URL}/api/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ title: newTaskTitle }),
    });
    const newTask = await response.json();
    setTasks([...tasks, newTask]);
    setNewTaskTitle('');
  };

  // Iniciar edição
  const handleEdit = (task) => {
    setEditingTaskId(task.id);
    setEditingTaskTitle(task.title);
  };

  // Salvar edição
  const handleSave = async () => {
    if (!token || !editingTaskId) return;
    const response = await fetch(`${API_URL}/api/tasks/${editingTaskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ title: editingTaskTitle }),
    });
    const updatedTask = await response.json();
    setTasks(tasks.map(t => (t.id === updatedTask.id ? updatedTask : t)));
    setEditingTaskId(null);
  };

  // Excluir tarefa
  const handleDelete = async (id) => {
    if (!token) return;
    await fetch(`${API_URL}/api/tasks/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    setTasks(tasks.filter(t => t.id !== id));
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Controle de Tarefas</h1>
      {!token ? (
        <button onClick={handleLogin}>Login</button>
      ) : (
        <>
          {/* Adicionar nova tarefa */}
          <div style={{ marginBottom: '20px' }}>
            <input
              type="text"
              placeholder="Nova tarefa"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
            />
            <button onClick={handleAddTask} style={{ marginLeft: '10px' }}>Adicionar</button>
          </div>
          
          {/* Lista de tarefas */}
          <ul>
            {tasks.map((task) => (
              <li key={task.id} style={{ marginBottom: '10px' }}>
                {editingTaskId === task.id ? (
                  <>
                    <input
                      type="text"
                      value={editingTaskTitle}
                      onChange={(e) => setEditingTaskTitle(e.target.value)}
                    />
                    <button onClick={handleSave} style={{ marginLeft: '10px' }}>Salvar</button>
                    <button onClick={() => setEditingTaskId(null)} style={{ marginLeft: '10px' }}>Cancelar</button>
                  </>
                ) : (
                  <>
                    {task.title}
                    <button onClick={() => handleEdit(task)} style={{ marginLeft: '10px' }}>Editar</button>
                    <button onClick={() => handleDelete(task.id)} style={{ marginLeft: '10px' }}>Excluir</button>
                  </>
                )}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default App;
