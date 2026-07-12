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

const createEmployee = async (employee) => {
  const { first_name, last_name, email, department, salary } = employee;

  const [result] = await pool.promise().query(
    ` INSERT INTO employees
         (first_name, last_name, email, department, salary)
         VALUES ( ?,?,?,?,?)
       `,
    [first_name, last_name, email, department, salary],
  );

  return result;
};

export { getAllEmployees, getEmployeeById, createEmployee };
