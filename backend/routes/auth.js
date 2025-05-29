const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Dados fictícios de usuário (substitua por banco de dados na implementação real)
const users = [
  { id: 1, username: 'usuario', password: 'senha' }
];

// Rota de login
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (user) {
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } else {
    res.status(401).json({ message: 'Credenciais inválidas' });
  }
});

module.exports = router;
