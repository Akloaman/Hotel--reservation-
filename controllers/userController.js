const User = require('../models/userModel');

exports.getUserById = (req, res) => {
  User.findById(req.params.id, (err, rows) => {
    if (err) return res.status(500).json({ message: 'Error fetching user' });
    if (rows.length === 0) return res.status(404).json({ message: 'User not found' });
    res.json(rows[0]);
  });
};

exports.getAllUsers = (req, res) => {
  User.getAll((err, rows) => {
    if (err) return res.status(500).json({ message: 'Error fetching users' });
    res.json(rows);
  });
};
