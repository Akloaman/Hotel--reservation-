const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const SECRET = process.env.JWT_SECRET || 'secret123';

exports.register = (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password)
    return res.status(400).json({ message: 'All fields required' });

  bcrypt.hash(password, 10, (err, hash) => {
    if (err) return res.status(500).json({ message: 'Hashing error' });

    User.create(username, email, hash, (err2, result) => {
      if (err2) return res.status(500).json({ message: 'Registration error', error: err2.message });
      res.status(201).json({ message: 'User registered', userId: result.insertId });
    });
  });
};

exports.login = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: 'Email and password required' });

  User.findByEmail(email, (err, rows) => {
    if (err) return res.status(500).json({ message: 'User fetch error' });
    if (rows.length === 0) return res.status(401).json({ message: 'Invalid credentials' });

    const user = rows[0];
    bcrypt.compare(password, user.password, (err2, ok) => {
      if (err2 || !ok) return res.status(401).json({ message: 'Invalid credentials' });

      const token = jwt.sign({ id: user.id, email: user.email }, SECRET, { expiresIn: '2h' });
      res.json({ message: 'Login successful', token });
    });
  });
};
