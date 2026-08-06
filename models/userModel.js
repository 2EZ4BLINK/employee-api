import pool from "../config/db.js";

const createUser = async (body) => {
  const { name, email, hashedPassword } = body;

  const [result] = await pool.query(
    `INSERT INTO users (name, email, password)
    VALUES (?,?,?)`,
    [name, email, hashedPassword],
  );

  return result;
};

const getUser = async (email) => {
  const [rows] = await pool.query(`SELECT * FROM users WHERE email = ?`, [
    email,
  ]);

  return rows;
};

export { createUser, getUser };
