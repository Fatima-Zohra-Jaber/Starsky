const API_BASE = "http://localhost:3000/api";

// Fonction utilitaire pour récupérer le token d'authentification
function getAuthToken() {
  // const userData = localStorage.getItem('user');
  const session = supabase.auth.getSession();
  

  if (session) {
    // const user = JSON.parse(userData);
    const access_token = session?.data?.session?.access_token;
    return access_token;
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

export async function getIdUser() {
  const token = getAuthToken();

  const res = await fetch(`${API_BASE}/users/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

  if (!res.ok) {
    const errorData = await res.text();
    console.error('Erreur API:', res.status, errorData);
    throw new Error(`HTTP ${res.status}: ${errorData}`);
  }

  return res.json();
}

export async function addProject(data) {
  const token = getAuthToken();
  const headers = { "Content-Type": "application/json" };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}/projects`, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function getProjects(userId) {
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