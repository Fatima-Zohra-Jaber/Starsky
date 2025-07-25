const API_BASE = "http://localhost:3000/api";

// Fonction utilitaire pour récupérer le token d'authentification
function getAuthToken() {
  const userData = localStorage.getItem('user');
  if (userData) {
    try {
      const user = JSON.parse(userData);
      return user.token;
    } catch (error) {
      console.error('Erreur lors du parsing des données utilisateur:', error);
      return null;
    }
  }
  return null;
}

// Authentification
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

// Connexion
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

// Récupération des informations de l'utilisateur connecté
export async function getIdUser() {
  const token = getAuthToken();
  
  if (!token) {
    throw new Error('Aucun token d\'authentification trouvé');
  }

  const res = await fetch(`${API_BASE}/users/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });


  if (!res.ok) {
    const errorData = await res.text();
    console.error('Erreur API:', res.status, errorData);
    throw new Error(`HTTP ${res.status}: ${errorData}`);
  }

  const result = await res.json();
  return result;
}

// Ajout d'un projet
export async function addProject(data) {

  // Récupération du token d'authentification
  const token = getAuthToken();

  if (!token) {
    throw new Error('Aucun token d\'authentification trouvé');
  }

  const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  };

  const res = await fetch(`${API_BASE}/projects`, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.text();
    throw new Error(`HTTP ${res.status}: ${errorData}`);
  }

  return res.json();
}

// Récupération des projets d'un utilisateur
export async function getProjects(userId) {

  // Récupération du token d'authentification
  const token = getAuthToken();
  const headers = { "Content-Type": "application/json" };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}/projects/${userId}`, {
    headers
  });
  return res.json();
}