import express from "express";
import { loginUser, postUser } from "../controllers/authController.js";
import { fetchEmployeeById } from "../controllers/employeeController.js";
import { validateSignup } from "../middleware/validateAuth.js";

const router = express.Router();

router.post("/signup", validateSignup, postUser);
router.post("/login", loginUser);

export default router;
