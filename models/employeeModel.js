import pool from "../config/db.js";

const getAllEmployees = async () => {
  const [rows] = await pool.promise().query("SELECT * FROM employees");

  return rows;
};

export { getAllEmployees };
