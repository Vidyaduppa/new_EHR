// services/userService.js
const User = require('../models/userModel');

const createUser = async (userData) => {
    const user = new User(userData);
    await user.save();
    return user;
};

module.exports = { createUser };