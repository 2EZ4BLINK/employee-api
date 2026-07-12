import express from "express";
import {
  fetchEmployeeById,
  fetchEmployees,
} from "../controllers/employeeController.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("<h1>Hello fucking world</h1>");
});

router.get("/employees", fetchEmployees);
router.get("/employees/:id", fetchEmployeeById);

export default router;
