import pool from "../config/db.js";

const getAllEmployees = async () => {
  const [rows] = await pool.promise().query("SELECT * FROM employees");

  return rows;
};

const getEmployeeById = async (employeeId) => {
  const [rows] = await pool
    .promise()
    .query(`SELECT * FROM employees WHERE id = ?`, [employeeId]);

  return rows;
};

export { getAllEmployees, getEmployeeById };
