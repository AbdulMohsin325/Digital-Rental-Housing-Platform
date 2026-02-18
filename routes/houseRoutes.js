import express from 'express';
import {
    createHouse,
    getAllHouses,
    getHouseById,
    updateHouse,
    deleteHouse
} from '../controllers/houseController.js';

import { protect, authorizeAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getAllHouses);
router.get('/:id', getHouseById);

router.post('/', protect, authorizeAdmin, createHouse);
router.put('/:id', protect, authorizeAdmin, updateHouse);
router.delete('/:id', protect, authorizeAdmin, deleteHouse);

export default router;
