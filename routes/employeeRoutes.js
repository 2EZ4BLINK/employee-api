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
import { authorize } from "../middleware/authorize.js";
import { validateEmployeeQuery } from "../middleware/validateEmployeeQuery.js";

const router = express.Router();

router.get("/", authenticate, validateEmployeeQuery, fetchEmployees);
router.get("/:id", authenticate, fetchEmployeeById);

router.post(
  "/",
  authenticate,
  authorize("admin"),
  validateEmployee,
  postEmployee,
);
router.put(
  "/:id",
  authenticate,
  authorize("admin"),
  validateEmployee,
  putEmployee,
);
router.delete("/:id", authenticate, authorize("admin"), removeEmployee);

export default router;
