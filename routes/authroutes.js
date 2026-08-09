import express from "express";
import { loginUser, postUser } from "../controllers/authController.js";
import { fetchEmployeeById } from "../controllers/employeeController.js";
import { validateLogin, validateSignup } from "../middleware/validateAuth.js";

const router = express.Router();

router.post("/signup", validateSignup, postUser);
router.post("/login", validateLogin, loginUser);

export default router;
