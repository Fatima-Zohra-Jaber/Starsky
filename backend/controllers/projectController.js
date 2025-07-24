import supabase from '../db.js';

export const addProject = async (req, res) => {
  try {
    console.log('addProject req.body:', req.body);
    console.log('Headers:', req.headers);

    const { user_id, title, content } = req.body;

    if (!user_id || !title || !content) {
      return res.status(400).json({ error: "Données manquantes (user_id, title, content requis)" });
    }

    // Essayer avec une approche différente - utiliser rpc ou raw SQL
    const { data, error } = await supabase
      .from('projects')
      .insert([{ user_id, title, content }])
      // .select(); // Ajouter select() pour récupérer les données insérées

    if (error) {
      console.error('Erreur Supabase détaillée:', JSON.stringify(error, null, 2));
      return res.status(400).json({ error: error.message });
    }

    res.json({ message: "Projet enregistré", data });
  } catch (err) {
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
};

export const getProjects = async (req, res) => {
  const { user_id } = req.params;
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', user_id)
    .order('created_at', { ascending: false });
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
};

