import express from "express";
import {
  postEmployee,
  fetchEmployeeById,
  fetchEmployees,
  putEmployee,
  removeEmployee,
} from "../controllers/employeeController.js";
import { validateEmployee } from "../middleware/validateEmployee.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("<h1>Hello World</h1>");
});
router.get("/employees", fetchEmployees);
router.get("/employees/:id", fetchEmployeeById);

router.post("/employees", validateEmployee, postEmployee);
router.put("/employees/:id", validateEmployee, putEmployee);
router.delete("/employees/:id", removeEmployee);

export default router;
