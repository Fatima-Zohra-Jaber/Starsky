import supabase from "../supabaseClient.js";

export const register = async (req, res) => {
  try {
    console.log('Requête d\'inscription reçue:', req.body);
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email et mot de passe requis" });
    }

    console.log('Tentative d\'inscription avec Supabase pour:', email);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      console.error('Erreur Supabase:', error);
      return res.status(400).json({ error: error.message });
    }

    console.log('Inscription réussie:', data);
    res.json({ message: "Utilisateur inscrit avec succès", data });
  } catch (err) {
    console.error('Erreur serveur:', err);
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
}

export const login = async (req, res) => {
  try {
    console.log('Requête de connexion reçue:', req.body);
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email et mot de passe requis" });
    }

    console.log('Tentative de connexion avec Supabase pour:', email);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Erreur de connexion Supabase:', error);
      return res.status(400).json({ error: error.message });
    }

    console.log('Connexion réussie:', data);
    res.json({ message: "Connexion réussie", data });
  } catch (err) {
    console.error('Erreur serveur:', err);
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
}

export const getIdUser = async (req) => {
  const token = req.headers.authorization?.split("Bearer ")[1];
  if (!token) return null;

  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data?.user) {
    return null;
  }

  return data.user.id;
};
