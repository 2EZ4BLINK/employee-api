import express from "express";
import { fetchEmployees } from "../controllers/employeeController.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("<h1>Hello fucking world</h1>");
});

router.get("/employees", fetchEmployees);

export default router;
