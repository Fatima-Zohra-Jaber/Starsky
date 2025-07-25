import supabase from "../db.js";

// Middleware pour vérifier le token JWT
export async function verifyToken(req, res, next) {
  // Récupération du token dans le header Authorization
  const token = req.headers.authorization?.split("Bearer ")[1];
  if (!token) return res.status(401).json({ error: "Token manquant" });

  // Utilisation de la fonction getUser de Supabase pour vérifier le token
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data?.user) return res.status(401).json({ error: "Token invalide" });
  req.user = data.user;
  next(); // Passe au middleware/route suivant
}

