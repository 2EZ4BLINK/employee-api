import express from "express";
import {
  postEmployee,
  fetchEmployeeById,
  fetchEmployees,
  putEmployee,
} from "../controllers/employeeController.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("<h1>Hello fucking world</h1>");
});

router.get("/employees", fetchEmployees);
router.get("/employees/:id", fetchEmployeeById);

router.post("/employees", postEmployee);
router.put("/employees/:id", putEmployee);

export default router;
