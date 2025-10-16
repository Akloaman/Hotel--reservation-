const express = require('express');
const {
  createRoom,
  getRooms,
  getAvailableRooms,
  getRoomById,
  updateRoom,
  updateRoomStatus
} = require('../controllers/roomController');
const authenticateJWT = require('../middleware/auth');

const router = express.Router();

// public reads
router.get('/', getRooms);
router.get('/available', getAvailableRooms);
router.get('/:id', getRoomById);

// protected writes
router.post('/', authenticateJWT, createRoom);
router.put('/:id', authenticateJWT, updateRoom);
router.patch('/:id/status', authenticateJWT, updateRoomStatus);

module.exports = router;
