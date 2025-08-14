// test-server.js - Simple test to verify server startup
import { config } from 'dotenv';
config({ path: '.env', override: true, debug: true });

import mysql from 'mysql2/promise';

console.log('🔍 Testing database connection...');
console.log('Environment variables:');
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD ? '[SET]' : '[NOT SET]');

async function testConnection() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    const [rows] = await connection.query('SELECT 1 as test, DATABASE() as db');
    console.log('✅ Database connection successful:', rows[0]);
    
    await connection.end();
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
}

testConnection().then(success => {
  if (success) {
    console.log('🚀 Database test passed! Server should start successfully.');
  } else {
    console.log('💥 Database test failed! Check your .env file and MySQL connection.');
  }
});
