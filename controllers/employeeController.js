import {
  getEmployeeById,
  getAllEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployeeCount,
} from "../models/employeeModel.js";

const fetchEmployees = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = req.query.search || "";
    const department = req.query.department || "";
    const sort = req.query.sort || "id";
    const order = req.query.order || "asc";

    const offset = (page - 1) * limit;

    const employees = await getAllEmployees(
      limit,
      offset,
      search,
      department,
      sort,
      order,
    );
    const totalEmployees = await getEmployeeCount(search, department);

    const totalPages = Math.ceil(totalEmployees / limit);

    return res.status(200).json({
      employees,
      pagination: {
        currentPage: page,
        limit,
        totalEmployees,
        totalPages,
      },
    });
  } catch (error) {
    console.error(error);
    console.log("error: ", error);

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

    res.json(employees);
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
