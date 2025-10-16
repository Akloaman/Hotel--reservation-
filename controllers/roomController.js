const Room = require('../models/roomModel');

exports.createRoom = (req, res) => {
  const { room_number, type, price } = req.body;
  if (!room_number || !type || price == null)
    return res.status(400).json({ message: 'room_number, type, price required' });

  Room.create(room_number, type, price, (err, result) => {
    if (err) return res.status(500).json({ message: 'Error creating room', error: err.message });
    res.status(201).json({ message: 'Room created', roomId: result.insertId });
  });
};

exports.getRooms = (req, res) => {
  Room.getAll((err, rows) => {
    if (err) return res.status(500).json({ message: 'Error fetching rooms' });
    res.json(rows);
  });
};

exports.getAvailableRooms = (req, res) => {
  Room.getAvailable((err, rows) => {
    if (err) return res.status(500).json({ message: 'Error fetching available rooms' });
    res.json(rows);
  });
};

exports.getRoomById = (req, res) => {
  Room.findById(req.params.id, (err, rows) => {
    if (err) return res.status(500).json({ message: 'Error fetching room' });
    if (rows.length === 0) return res.status(404).json({ message: 'Room not found' });
    res.json(rows[0]);
  });
};

exports.updateRoom = (req, res) => {
  Room.update(req.params.id, req.body, (err, result) => {
    if (err) return res.status(500).json({ message: 'Error updating room', error: err.message });
    res.json({ message: 'Room updated' });
  });
};

exports.updateRoomStatus = (req, res) => {
  const { status } = req.body; // 'available' | 'booked'
  if (!status) return res.status(400).json({ message: 'status required' });

  Room.updateStatus(req.params.id, status, (err) => {
    if (err) return res.status(500).json({ message: 'Error updating status', error: err.message });
    res.json({ message: 'Room status updated' });
  });
};
