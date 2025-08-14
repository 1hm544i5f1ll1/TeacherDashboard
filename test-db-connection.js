// test-db-connection.js  (type: "module")
import { config } from 'dotenv';
config({ path: '.env', override: true, debug: true });

import mysql from 'mysql2/promise';

console.log('ENV:', {
  DB_HOST: process.env.DB_HOST,
  DB_USER: process.env.DB_USER,
  DB_NAME: process.env.DB_NAME,
});

const cfg = {
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};
console.log('Config:', { ...cfg, password: '***' });

try {
  const conn = await mysql.createConnection(cfg);
  const [rows] = await conn.query('SELECT DATABASE() db, 1 ok');
  console.log('✅ Connected:', rows);
  await conn.end();
} catch (e) {
  console.error('❌ Failed:', e.message);
}
