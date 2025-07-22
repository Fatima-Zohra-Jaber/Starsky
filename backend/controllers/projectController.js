import supabase from '../supabaseClient.js';

export const addProject = async (req, res) => {
  console.log('addProject req.body:', req.body);
  const { user_id, title, content } = req.body;
  const { data, error } = await supabase
    .from('projects')
    .insert([{ user_id, title, content }]);
  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: "Projet enregistré", data });
};

export const getProjects = async (req, res) => {
  const { user_id } = req.params;
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', user_id);
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
};
