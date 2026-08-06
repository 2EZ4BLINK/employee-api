import express from "express";
import { loginUser, postUser } from "../controllers/authController.js";
import { fetchEmployeeById } from "../controllers/employeeController.js";

const router = express.Router();

router.post("/signup", postUser);
router.post("/login", loginUser);

export default router;
