const express = require('express');
const { updateUser } = require('../controllers/userController');
const { authenticate } = require('../middleware/authMiddleware');
const router = express.Router();

router.put('/update-user/:id', authenticate, updateUser);

module.exports = router;
