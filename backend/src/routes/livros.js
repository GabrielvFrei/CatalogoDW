import express from 'express';
import auth from '../middleware/auth.js';
import isAdmin from '../middleware/isAdmin.js';
import { listLivros, createLivro, updateLivro, deleteLivro } from '../controllers/livrosController.js';

const router = express.Router();

// Público: rotas que qualquer visitante pode acessar
router.get('/', listLivros);

// Protegido: requer autenticação (e permissão de admin para mutações)
router.post('/', auth, isAdmin, createLivro);
router.put('/:id', auth, isAdmin, updateLivro);
router.delete('/:id', auth, isAdmin, deleteLivro);

export default router;
