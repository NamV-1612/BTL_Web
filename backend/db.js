import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '', // Mật khẩu XAMPP/MySQL của bạn
  database: process.env.DB_NAME || 'expense_tracker', // Database bạn vừa tạo
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;