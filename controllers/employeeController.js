import {
  getEmployeeById,
  getAllEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from "../models/employeeModel.js";

const fetchEmployees = async (req, res) => {
  try {
    const employees = await getAllEmployees();

    res.json(employees);
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong.",
    });
  }
};

const fetchEmployeeById = async (req, res) => {
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
    res.status(500).json({
      message: "Something went wrong.",
    });
  }
};

const postEmployee = async (req, res) => {
  try {
    const result = await createEmployee(req.body);

    res.status(201).json({
      message: "Employee created successfully.",
      id: result.insertId,
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong.",
    });
  }
};

const putEmployee = async (req, res) => {
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
    res.status(500).json({
      message: "Something went wrong.",
    });
  }
};

const removeEmployee = async (req, res) => {
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
    res.status(500).json({
      message: "Something went wrong.",
    });
  }
};

export {
  fetchEmployees,
  fetchEmployeeById,
  postEmployee,
  putEmployee,
  removeEmployee,
};
