const db = require('../config/db');

const User = {
  create: (username, email, hashedPassword, cb) => {
    db.query(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, hashedPassword],
      cb
    );
  },

  findByEmail: (email, cb) => {
    db.query('SELECT * FROM users WHERE email = ?', [email], cb);
  },

  findById: (id, cb) => {
    db.query(
      'SELECT id, username, email, created_at FROM users WHERE id = ?',
      [id],
      cb
    );
  },

  getAll: (cb) => {
    db.query('SELECT id, username, email, created_at FROM users', cb);
  }
};

module.exports = User;
