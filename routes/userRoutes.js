import express from 'express';
import {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
} from '../controllers/userController.js';
import { userValidationRules } from '../middleware/validation.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public route - CREATE new user (no authentication required)
router.post('/register', userValidationRules, createUser);

// // Protect all remaining routes - require authentication
// router.use(protect);

// GET all users (protected)
router.get('/user-list', getUsers);
router.get('/user-details', getUserById);
router.put('/update-details', updateUser);
router.delete('/delete-details', deleteUser);



export default router;
