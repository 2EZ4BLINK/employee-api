import { getEmployeeById, getAllEmployees } from "../models/employeeModel.js";

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
    const employeeId = req.params.id;
    const employee = await getEmployeeById(employeeId);

    if (employee.length === 0) {
      return res.status(404).json({
        message: "Employee not found",
      });
    }

    res.json(employee);
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong.",
    });
  }
};

export { fetchEmployees, fetchEmployeeById };
