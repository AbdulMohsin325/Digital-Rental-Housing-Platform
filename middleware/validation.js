import { body } from 'express-validator';

export const userValidationRules = [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('age').optional().isInt({ min: 0, max: 120 }).withMessage('Age must be between 0 and 120'),
    body('phone').optional(),
    body('address.street').optional(),
    body('address.city').optional(),
    body('address.state').optional(),
    body('address.zipCode').optional(),
    body('address.country').optional(),
    body('isActive').optional().isBoolean().withMessage('isActive must be a boolean')
];
