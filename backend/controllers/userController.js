import supabase from "../db.js";

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

export const getIdUser = (req, res) => {
  res.json({ user: req.user });
};

// export const getIdUser = async (req, res) => {
//   try {
//     console.log(req.headers.authorization);
//     const token = req.headers.authorization?.split("Bearer ")[1];

//     if (!token) {
//       return res.status(401).json({ error: "Token manquant" });
//     }

//     const { data, error } = await supabase.auth.getUser(token);

//     if (error || !data?.user) {
//       return res.status(401).json({ error: "Token invalide" });
//     }

//     res.json({ user: data.user });
//   } catch (err) {
//     res.status(500).json({ error: "Erreur interne du serveur" });
//   }
// };
