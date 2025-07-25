import express from 'express';
import { addProject, getProjects } from '../controllers/projectController.js';

// Création d'un routeur Express
const router = express.Router();

// Routes
router.post('/', addProject);
router.get('/:user_id', getProjects);

export default router;
