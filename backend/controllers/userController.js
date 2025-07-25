import supabase from "../db.js";

// Inscription d'un nouvel utilisateur
export const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email et mot de passe requis" });
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ message: "Utilisateur inscrit avec succès", data });
  } catch (err) {
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
}

// Connexion d'un utilisateur existant
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email et mot de passe requis" });
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ message: "Connexion réussie", data });
  } catch (err) {
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
}

// Récupération des informations de l'utilisateur connecté
export const getIdUser = (req, res) => {
  res.json({ user: req.user });
};


