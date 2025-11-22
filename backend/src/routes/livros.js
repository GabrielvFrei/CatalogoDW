import express from 'express';
import auth from '../middleware/auth.js';
import { listLivros, createLivro, updateLivro, deleteLivro } from '../controllers/livrosController.js';

const router = express.Router();

// Public
router.get('/', listLivros);

// Protected
router.post('/', auth, createLivro);
router.put('/:id', auth, updateLivro);
router.delete('/:id', auth, deleteLivro);

export default router;
