import express from 'express';
import auth from '../middleware/auth.js';
import { listDVDs, createDVD, updateDVD, deleteDVD } from '../controllers/dvdsController.js';

const router = express.Router();

// Public
router.get('/', listDVDs);

// Protected
router.post('/', auth, createDVD);
router.put('/:id', auth, updateDVD);
router.delete('/:id', auth, deleteDVD);

export default router;
