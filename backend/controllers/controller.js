// controllers/userController.js
const User = require('../models/userModel');
const { hashPassword } = require('../utils/passwordUtils');

const registerUser = async (req, res) => {
    try {
        const { first_name, last_name, email, password } = req.body;
        const hashedPassword = await hashPassword(password);
        const user = new User({ first_name, last_name, email, password: hashedPassword });
        await user.save();
        res.status(201).json({ message: 'User registered successfully', user });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = { registerUser };