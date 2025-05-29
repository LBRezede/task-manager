const express = require('express');
const router = express.Router();

// Dados fictícios de tarefas
let tasks = [
  { id: 1, title: 'Estudar Node.js', completed: false },
  { id: 2, title: 'Criar API', completed: false }
];

// Middleware para verificar o token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Listar tarefas
router.get('/', authenticateToken, (req, res) => {
  res.json(tasks);
});

// Criar tarefa
router.post('/', authenticateToken, (req, res) => {
  const { title } = req.body;
  const newTask = {
    id: tasks.length + 1,
    title,
    completed: false
  };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

// Atualizar tarefa
router.put('/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { title, completed } = req.body;
  const task = tasks.find(t => t.id === parseInt(id));
  if (task) {
    task.title = title !== undefined ? title : task.title;
    task.completed = completed !== undefined ? completed : task.completed;
    res.json(task);
  } else {
    res.status(404).json({ message: 'Tarefa não encontrada' });
  }
});

// Deletar tarefa
router.delete('/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  tasks = tasks.filter(t => t.id !== parseInt(id));
  res.status(204).end();
});

module.exports = router;
