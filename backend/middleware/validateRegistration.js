const { body, validationResult } = require('express-validator');

const validateRegistration = [
  body('first_name')
    .isString()
    .withMessage('First name must be a string')
    .isLength({ max: 35 })
    .withMessage('First name must be less than 35 characters')
    .matches(/^[a-zA-Z].*/)
    .withMessage('First name must start with an alphabet'),
  body('last_name')
    .isString()
    .withMessage('Last name must be a string')
    .isLength({ max: 35 })
    .withMessage('Last name must be less than 35 characters')
    .matches(/^[a-zA-Z].*/)
    .withMessage('Last name must start with an alphabet'),
  body('email')
    .isEmail()
    .withMessage('Email must be valid')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/)
    .withMessage('Password must contain at least one uppercase letter, one number, and one special character'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = validateRegistration;