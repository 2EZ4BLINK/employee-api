import pool from "../config/db.js";

const getAllEmployees = async (
  limit,
  offset,
  search,
  department,
  sort,
  order,
) => {
  const [rows] = await pool.query(
    `
    SELECT * 
    FROM employees
    WHERE first_name LIKE CONCAT('%', ?, '%') AND (? = '' OR department = ?)
    ORDER BY ${sort} ${order}
    LIMIT ?
    OFFSET ?
    `,
    [search, department, department, limit, offset],
  );

  return rows;
};

const getEmployeeCount = async (search, department) => {
  const [rows] = await pool.query(
    `SELECT COUNT(*) AS total
     FROM employees
     WHERE first_name LIKE CONCAT('%', ?, '%') AND (? = '' OR department = ?)
     `,
    [search, department, department],
  );

  return rows[0].total;
};

const getEmployeeById = async (employeeId) => {
  const [rows] = await pool.query(`SELECT * FROM employees WHERE id = ?`, [
    employeeId,
  ]);

  return rows[0];
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
  getEmployeeCount,
};
