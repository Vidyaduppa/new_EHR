const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const { forgotPassword, resetPassword,getUsers } = require("../controllers/authController");

router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post('/register', register);
router.post('/login', login);
router.get('/users', getUsers);
module.exports = router;
