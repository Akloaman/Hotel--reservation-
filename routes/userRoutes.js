const express = require('express');
const { getUserById, getAllUsers } = require('../controllers/userController');
const authenticateJWT = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticateJWT, getAllUsers);
router.get('/:id', authenticateJWT, getUserById);

module.exports = router;
