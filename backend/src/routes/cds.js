import express from 'express';
import auth from '../middleware/auth.js';
import isAdmin from '../middleware/isAdmin.js';
import { listCDs, createCD, updateCD, deleteCD } from '../controllers/cdsController.js';

const router = express.Router();

// Público: rotas que qualquer visitante pode acessar
router.get('/', listCDs);

// Protegido: requer autenticação (e permissão de admin para mutações)
router.post('/', auth, isAdmin, createCD);
router.put('/:id', auth, isAdmin, updateCD);
router.delete('/:id', auth, isAdmin, deleteCD);

export default router;
