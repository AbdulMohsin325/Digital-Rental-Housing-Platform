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

// Protect all routes - require authentication
router.use(protect);

// GET all users and CREATE new user
router.route('/')
    .get(getUsers)
    .post(userValidationRules, createUser);

// GET, UPDATE, and DELETE user by ID
router.route('/:id')
    .get(getUserById)
    .put(updateUser)
    .delete(deleteUser);

export default router;
