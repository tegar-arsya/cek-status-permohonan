import { NextApiRequest, NextApiResponse } from 'next';
import mysql from 'mysql2/promise';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    console.log('Connecting to database...');
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    console.log('Connected to database.');
    const [rows] = await connection.execute('SELECT 1 + 1 AS solution');
    await connection.end();

    console.log('Query executed successfully.');
    return res.status(200).json({ success: true, result: rows });
  } catch (error: any) {
    console.error('Error connecting to the database:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}

