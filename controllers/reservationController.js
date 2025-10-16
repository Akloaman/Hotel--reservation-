const Reservation = require('../models/reservationModel');
const authenticateJWT =require('../middleware/auth');

exports.createReservation = (req, res) => {
  const { roomId, checkIn, checkOut } = req.body;
  const userId = req.authenticateJWT.user.id;

  if (!roomId || !checkIn || !checkOut)
    return res.status(400).json({ message:'roomId, checkIn, checkOut required' });

  Reservation.create(userId, roomId, checkIn, checkOut, (err, result) => {
    if (err) return res.status(400).json({ message: err.message || 'Error creating reservation' });
    res.status(201).json({ message: 'Reservation created', reservationId: result.insertId });
  });
};

exports.getReservations = (req, res) => {
  const userId = req.user.id;
  Reservation.getByUserId(userId, (err, rows) => {
    if (err) return res.status(500).json({ message: 'Error fetching reservations' });
    res.json(rows);
  });
};

exports.updateReservationStatus = (req, res) => {
  const { status } = req.body; // 'pending' | 'confirmed' | 'cancelled'
  if (!status) return res.status(400).json({ message: 'status required' });

  Reservation.updateStatus(req.params.id, status, (err) => {
    if (err) return res.status(400).json({ message: err.message || 'Error updating reservation' });
    res.json({ message: 'Reservation status updated' });
  });
};

exports.cancelReservation = (req, res) => {
  Reservation.cancel(req.params.id, (err) => {
    if (err) return res.status(400).json({ message: err.message || 'Error cancelling reservation' });
    res.json({ message: 'Reservation cancelled' });
  });
};
