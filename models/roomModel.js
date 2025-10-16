const db = require('../config/db');

const Room = {
  create: (room_number, type, price, cb) => {
    db.query(
      'INSERT INTO rooms (room_number, type, price, status) VALUES (?, ?, ?, "available")',
      [room_number, type, price],
      cb
    );
  },

  getAll: (cb) => {
    db.query('SELECT * FROM rooms ORDER BY room_number ASC', cb);
  },

  getAvailable: (cb) => {
    db.query('SELECT * FROM rooms WHERE status="available" ORDER BY room_number ASC', cb);
  },

  findById: (id, cb) => {
    db.query('SELECT * FROM rooms WHERE id = ?', [id], cb);
  },

  update: (id, payload, cb) => {
    const { room_number, type, price } = payload;
    db.query(
      'UPDATE rooms SET room_number=?, type=?, price=? WHERE id=?',
      [room_number, type, price, id],
      cb
    );
  },

  updateStatus: (id, status, cb) => {
    db.query('UPDATE rooms SET status=? WHERE id=?', [status, id], cb);
  }
};

module.exports = Room;
