// models/userModel.js
const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    first_name: { type: String, required: true, maxlength: 35, match: /^[a-zA-Z].*/ },
    last_name: { type: String, required: true, maxlength: 35, match: /^[a-zA-Z].*/ },
    email: { type: String, required: true, unique: true, validate: [validator.isEmail, 'Invalid email'] },
    password: { type: String, required: true },
    createdDate: { type: Date, default: Date.now },
    updatedDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);