import { getAllEmployees } from "../models/employeeModel.js";

const fetchEmployees = async (req, res) => {
  try {
    const employees = await getAllEmployees();

    res.send(employees);
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong.",
    });
  }
};

export { fetchEmployees };
