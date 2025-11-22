import express from 'express';
import auth from '../middleware/auth.js';
import { listAutores, createAutor, updateAutor, deleteAutor } from '../controllers/autoresController.js';

const router = express.Router();

// Public
router.get('/', listAutores);

// Protected
router.post('/', auth, createAutor);
router.put('/:id', auth, updateAutor);
router.delete('/:id', auth, deleteAutor);

export default router;
