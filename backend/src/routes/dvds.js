import express from 'express';
import auth from '../middleware/auth.js';
import isAdmin from '../middleware/isAdmin.js';
import { listDVDs, createDVD, updateDVD, deleteDVD } from '../controllers/dvdsController.js';

const router = express.Router();

// Público: rotas que qualquer visitante pode acessar
router.get('/', listDVDs);

// Protegido: requer autenticação (e permissão de admin para mutações)
router.post('/', auth, isAdmin, createDVD);
router.put('/:id', auth, isAdmin, updateDVD);
router.delete('/:id', auth, isAdmin, deleteDVD);

export default router;
