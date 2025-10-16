const mysql = require('mysql2');

// 1) Run setup (create DB + tables + seed rooms)
const setup = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  multipleStatements: true
});

const dbName = 'hotel_db';

const ddl = `
CREATE DATABASE IF NOT EXISTS ${dbName};
USE ${dbName};

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS rooms (
  id INT AUTO_INCREMENT PRIMARY KEY,
  room_number VARCHAR(50) NOT NULL UNIQUE,
  type VARCHAR(100) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  status ENUM('available','booked') DEFAULT 'available'
);

CREATE TABLE IF NOT EXISTS reservations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  room_id INT NOT NULL,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  status ENUM('pending','confirmed','cancelled') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE
);

-- seed a few rooms if not there
INSERT INTO rooms (room_number, type, price, status)
SELECT * FROM (SELECT '101', 'Single', 50.00, 'available') AS t
WHERE NOT EXISTS (SELECT 1 FROM rooms WHERE room_number='101') LIMIT 1;

INSERT INTO rooms (room_number, type, price, status)
SELECT * FROM (SELECT '102', 'Double', 80.00, 'available') AS t
WHERE NOT EXISTS (SELECT 1 FROM rooms WHERE room_number='102') LIMIT 1;

INSERT INTO rooms (room_number, type, price, status)
SELECT * FROM (SELECT '201', 'Suite', 150.00, 'available') AS t
WHERE NOT EXISTS (SELECT 1 FROM rooms WHERE room_number='201') LIMIT 1;
`;

setup.query(ddl, (err) => {
  if (err) throw err;
  console.log(`✅ Database "${dbName}" ready (with sample rooms).`);
  setup.end();
});

// 2) export a pool (so we can run transactions safely)
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: dbName,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = db;
