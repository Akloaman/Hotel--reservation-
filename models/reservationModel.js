const db = require('../config/db');

const Reservation = {
  // create reservation only if room is available, then mark room booked (transaction)
  create: (userId, roomId, checkIn, checkOut, cb) => {
    db.getConnection((err, conn) => {
      if (err) return cb(err);

      conn.beginTransaction((err) => {
        if (err) { conn.release(); return cb(err); }

        conn.query('SELECT status FROM rooms WHERE id=? FOR UPDATE', [roomId], (err, rows) => {
          if (err) { return conn.rollback(() => { conn.release(); cb(err); }); }
          if (rows.length === 0) { return conn.rollback(() => { conn.release(); cb(new Error('Room not found')); }); }

          if (rows[0].status !== 'available') {
            return conn.rollback(() => { conn.release(); cb(new Error('Room not available')); });
          }

          conn.query(
            'INSERT INTO reservations (user_id, room_id, check_in, check_out, status) VALUES (?, ?, ?, ?, "confirmed")',
            [userId, roomId, checkIn, checkOut],
            (err, result) => {
              if (err) { return conn.rollback(() => { conn.release(); cb(err); }); }

              conn.query('UPDATE rooms SET status="booked" WHERE id=?', [roomId], (err2) => {
                if (err2) { return conn.rollback(() => { conn.release(); cb(err2); }); }

                conn.commit((err3) => {
                  if (err3) { return conn.rollback(() => { conn.release(); cb(err3); }); }
                  conn.release();
                  cb(null, result);
                });
              });
            }
          );
        });
      });
    });
  },

  // get reservations for a specific user (join rooms)
  getByUserId: (userId, cb) => {
    const sql = `
      SELECT r.id, r.check_in, r.check_out, r.status, r.created_at,
             rm.id AS room_id, rm.room_number, rm.type, rm.price
      FROM reservations r
      JOIN rooms rm ON r.room_id = rm.id
      WHERE r.user_id = ?
      ORDER BY r.created_at DESC
    `;
    db.query(sql, [userId], cb);
  },

  // update reservation status; if cancelled -> free the room (transaction)
  updateStatus: (reservationId, status, cb) => {
    db.getConnection((err, conn) => {
      if (err) return cb(err);

      conn.beginTransaction((err) => {
        if (err) { conn.release(); return cb(err); }

        conn.query('SELECT room_id FROM reservations WHERE id=? FOR UPDATE', [reservationId], (err, rows) => {
          if (err) { return conn.rollback(() => { conn.release(); cb(err); }); }
          if (rows.length === 0) { return conn.rollback(() => { conn.release(); cb(new Error('Reservation not found')); }); }

          const roomId = rows[0].room_id;

          conn.query('UPDATE reservations SET status=? WHERE id=?', [status, reservationId], (err2) => {
            if (err2) { return conn.rollback(() => { conn.release(); cb(err2); }); }

            // if cancelled -> make room available
            const maybeRelease =
              status === 'cancelled'
                ? () => conn.query('UPDATE rooms SET status="available" WHERE id=?', [roomId], finalize)
                : finalize;

            function finalize(err3) {
              if (err3) { return conn.rollback(() => { conn.release(); cb(err3); }); }
              conn.commit((err4) => {
                if (err4) { return conn.rollback(() => { conn.release(); cb(err4); }); }
                conn.release();
                cb(null, { affectedRows: 1 });
              });
            }

            if (maybeRelease === finalize) finalize();
          });
        });
      });
    });
  },

  cancel: (reservationId, cb) => {
    // simply call updateStatus with 'cancelled'
    Reservation.updateStatus(reservationId, 'cancelled', cb);
  }
};

module.exports = Reservation;
