import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// getConnection: aks the pool if it can borrow one of the database connections.
// Its purpose is simply to verify that:
// MySQL is running.
// The credentials are correct.
// The database exists.
// The application can connect.

pool.getConnection((err, connection) => {
  if (err) {
    console.error("Database connection failed: ", err.message);
    return;
  }

  console.log("✅ Connected to MySQL");

  connection.release();
});

export default pool;
