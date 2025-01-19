const { check } = require('express-validator');

const validateRating = [
    check('productId')
        .isInt({ min: 1 }).withMessage('ID продукта должен быть целым числом и больше 0'),
    check('rate')
        .isFloat({ min: 1, max: 5 }).withMessage('Рейтинг должен быть от 1 до 5'),
    check('name')
        .trim()
        .notEmpty().withMessage('Имя не может быть пустым')
        .isLength({ max: 50 }).withMessage('Имя должно содержать не более 50 символов'),
    check('review')
        .optional()
        .isLength({ max: 500 }).withMessage('Отзыв должен содержать не более 500 символов'),
];

module.exports = { validateRating };
