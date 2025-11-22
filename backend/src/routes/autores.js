import express from 'express';
import auth from '../middleware/auth.js';
import isAdmin from '../middleware/isAdmin.js';
import { listAutores, createAutor, updateAutor, deleteAutor } from '../controllers/autoresController.js';

const router = express.Router();

// Público: rotas que qualquer visitante pode acessar
router.get('/', listAutores);

// Protegido: requer autenticação (e permissão de admin para mutações)
router.post('/', auth, isAdmin, createAutor);
router.put('/:id', auth, isAdmin, updateAutor);
router.delete('/:id', auth, isAdmin, deleteAutor);

export default router;
