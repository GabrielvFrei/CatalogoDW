import express from 'express';
import auth from '../middleware/auth.js';
import { listCDs, createCD, updateCD, deleteCD } from '../controllers/cdsController.js';

const router = express.Router();

// Public
router.get('/', listCDs);

// Protected
router.post('/', auth, createCD);
router.put('/:id', auth, updateCD);
router.delete('/:id', auth, deleteCD);

export default router;
