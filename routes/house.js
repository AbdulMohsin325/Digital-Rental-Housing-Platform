import express from 'express'
import { createProperty, getAllProperties } from '../controllers/propertyController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .get(getAllProperties)
    .post(protect, createProperty);

export default router;
