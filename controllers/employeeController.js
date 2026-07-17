import {
  getEmployeeById,
  getAllEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from "../models/employeeModel.js";

const fetchEmployees = async (req, res, next) => {
  try {
    const employees = await getAllEmployees();
    res.json(employees);
  } catch (error) {
    console.error(error);
    next({ message: "Failed getting employees" });
  }
};

const fetchEmployeeById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const employees = await getEmployeeById(id);

    if (employees.length === 0) {
      return res.status(404).json({
        message: "Employee not found",
      });
    }

    res.json(employees[0]);
  } catch (error) {
    console.error(error);
    next({ message: "Failed getting employee" });
  }
};

const postEmployee = async (req, res, next) => {
  try {
    const { first_name, last_name, email, department, salary } = req.body;

    const employeeData = {
      first_name,
      last_name,
      email,
      department,
      salary,
    };

    const result = await createEmployee(employeeData);

    res.status(201).json({
      message: "Employee created successfully.",
      id: result.insertId,
    });
  } catch (error) {
    console.error(error);
    next({ message: "Failed creating employee" });
  }
};

const putEmployee = async (req, res, next) => {
  try {
    const { id } = req.params;
    const body = req.body;

    const result = await updateEmployee(id, body);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Employee not found",
      });
    }

    res.status(200).json({
      message: "Employee updated successfully",
    });
  } catch (error) {
    console.error(error);
    next({ message: "Failed updating employee" });
  }
};

const removeEmployee = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await deleteEmployee(id);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Employee doesn't exist",
      });
    }

    res.status(200).json({
      message: "Employee deleted successfully",
    });
  } catch (error) {
    console.error(error);
    next({ message: "Failed deleting employee" });
  }
};

export {
  fetchEmployees,
  fetchEmployeeById,
  postEmployee,
  putEmployee,
  removeEmployee,
};
