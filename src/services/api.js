// src/services/api.js
const API_URL = 'http://localhost:3001'; // Altere para sua URL do backend

export async function login(username, password) {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });
  return response.json();
}

export async function fetchTasks(token) {
  const response = await fetch(`${API_URL}/api/tasks`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return response.json();
}
