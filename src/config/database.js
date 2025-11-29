import mysql from 'mysql2';
import dotenv from 'dotenv';    


dotenv.config();

const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER ,
  port: process.env.DB_PORT || 3306,
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'Doctor_Appointment',
});

db.connect((err) => {
  if (err) {
    console.error('❌ Error connecting to MySQL:', err.stack);
    return;
  }
  console.log('✅ Connected to MySQL as ID:', db.threadId);
});

export default db;