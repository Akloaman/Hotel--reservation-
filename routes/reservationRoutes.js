const express = require('express');
const {
  createReservation,
  getReservations,
  updateReservationStatus,
  cancelReservation
} = require('../controllers/reservationController');
const authenticateJWT = require('../middleware/auth');

const router = express.Router();

router.post('/', authenticateJWT, createReservation);
router.get('/', authenticateJWT, getReservations);
router.put('/:id', authenticateJWT, updateReservationStatus);
router.delete('/:id', authenticateJWT, cancelReservation);

module.exports = router;
