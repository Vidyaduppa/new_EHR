// controllers/userController.js
const User = require('../models/User');

exports.updateUser = async (req, res) => {
  try {
    const { first_name, last_name } = req.body;
    const { id } = req.params;
    if (!first_name || !last_name) return res.status(400).json({ message: 'First name and last name are required' });

    const updatedUser = await User.findByIdAndUpdate(id, { first_name, last_name, updatedDate: new Date().toISOString() }, { new: true });
    if (!updatedUser) return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'User updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
