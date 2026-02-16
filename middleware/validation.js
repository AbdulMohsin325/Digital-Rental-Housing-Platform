import { body } from 'express-validator';

export const userValidationRules = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ max: 50 })
        .withMessage('Name cannot exceed 50 characters'),

    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Please provide a valid email')
        .normalizeEmail(),

    body('age')
        .optional()
        .isInt({ min: 0, max: 120 })
        .withMessage('Age must be between 0 and 120'),

    body('phone')
        .optional()
        .trim(),

    body('address.street').optional().trim(),
    body('address.city').optional().trim(),
    body('address.state').optional().trim(),
    body('address.zipCode').optional().trim(),
    body('address.country').optional().trim(),

    body('isActive')
        .optional()
        .isBoolean()
        .withMessage('isActive must be a boolean')
];
