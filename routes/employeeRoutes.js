import express from "express";
import {
  postEmployee,
  fetchEmployeeById,
  fetchEmployees,
  putEmployee,
  removeEmployee,
} from "../controllers/employeeController.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("<h1>Hello fucking world</h1>");
});
router.get("/employees", fetchEmployees);
router.get("/employees/:id", fetchEmployeeById);

router.post("/employees", postEmployee);
router.put("/employees/:id", putEmployee);
router.delete("/employees/:id", removeEmployee);

export default router;
