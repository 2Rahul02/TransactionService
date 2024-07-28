import pool from '../config/database';

const setupDatabase = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS transactions (
        trans_id INTEGER PRIMARY KEY,
        amount NUMERIC NOT NULL,
        type VARCHAR(50) NOT NULL,
        parent_id INTEGER REFERENCES transactions(trans_id)
      )
    `);
  } catch (err) {
    process.exit(1);
  }
};

setupDatabase();
