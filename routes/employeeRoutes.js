import express from "express";
import {
  postEmployee,
  fetchEmployeeById,
  fetchEmployees,
  putEmployee,
  removeEmployee,
} from "../controllers/employeeController.js";
import { validateEmployee } from "../middleware/validateEmployee.js";
import { authenticate } from "../middleware/authenticate.js";

const router = express.Router();

router.get("/", authenticate, fetchEmployees);
router.get("/:id", fetchEmployeeById);

router.post("/", validateEmployee, postEmployee);
router.put("/:id", validateEmployee, putEmployee);
router.delete("/:id", removeEmployee);

export default router;
