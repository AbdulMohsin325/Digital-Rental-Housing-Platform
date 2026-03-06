import express from 'express';
import {
    createHouse,
    getAllHouses,
    getHousesByRole,
    getApprovedHouses,
    getHouseById,
    updateHouse,
    deleteHouse,
    updateHouseStatus,
    getPendingHouses,
    updateHouseActiveStatus
} from '../controllers/houseController.js';
import { houseValidationRules } from '../middleware/validation.js';

import { protect, authorizeAdmin } from '../middleware/auth.js';

const router = express.Router();

router.post('/add', protect, houseValidationRules, createHouse);

router.get('/', getApprovedHouses);
router.get('/list', protect, getHousesByRole);
router.get('/admin', protect, authorizeAdmin, getAllHouses);
router.get('/admin/pending', protect, authorizeAdmin, getPendingHouses);
router.get('/:id', protect, getHouseById);


router.post('/:id', protect, updateHouse);
router.delete('/:id', protect, authorizeAdmin, deleteHouse);
router.post('/:id/status', protect, authorizeAdmin, updateHouseStatus);
router.post('/:id/active', protect, updateHouseActiveStatus);


router.post('/search', getAllHouses)

export default router;
