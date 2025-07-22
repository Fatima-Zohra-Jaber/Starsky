import express from 'express';
import { addProject, getProjects } from '../controllers/projectController.js';
const router = express.Router();

router.post('/', addProject);
router.get('/:user_id', getProjects);

export default router;
