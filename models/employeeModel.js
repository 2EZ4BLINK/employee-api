import pool from "../config/db.js";

const getAllEmployees = async () => {
  const [rows] = await pool.query("SELECT * FROM employees");

  return rows;
};

const getEmployeeById = async (employeeId) => {
  const [rows] = await pool.query(`SELECT * FROM employees WHERE id = ?`, [
    employeeId,
  ]);

  return rows;
};

const createEmployee = async (employee) => {
  const { first_name, last_name, email, department, salary } = employee;

  const [result] = await pool.query(
    `INSERT INTO employees
         (first_name, last_name, email, department, salary)
         VALUES (?,?,?,?,?)
       `,
    [first_name, last_name, email, department, salary],
  );

  return result;
};

const updateEmployee = async (id, body) => {
  const { first_name, last_name, email, department, salary } = body;

  const [result] = await pool.query(
    "UPDATE employees SET first_name = ?, last_name = ?, email = ?, department = ?, salary = ? WHERE id = ?",
    [first_name, last_name, email, department, salary, id],
  );

  return result;
};

const deleteEmployee = async (id) => {
  const [result] = await pool.query("DELETE FROM employees WHERE id = ?", [id]);

  return result;
};

export {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
};
