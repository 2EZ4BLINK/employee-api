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

export { createUser };
