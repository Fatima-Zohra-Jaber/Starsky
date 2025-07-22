const API_BASE = "http://localhost:3000/api";

// Fonction utilitaire pour récupérer le token d'authentification
function getAuthToken() {
  const userData = localStorage.getItem('user');
  if (userData) {
    const user = JSON.parse(userData);
    return user.token;
  }
  return null;
}

export async function register(data) {
  const res = await fetch(`${API_BASE}/users/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.text();
    console.error('Erreur API:', res.status, errorData);
    throw new Error(`HTTP ${res.status}: ${errorData}`);
  }

  return res.json();
}

export async function login(data) {
  const res = await fetch(`${API_BASE}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.text();
    console.error('Erreur API:', res.status, errorData);
    throw new Error(`HTTP ${res.status}: ${errorData}`);
  }

  return res.json();
}


