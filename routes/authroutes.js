import express from "express";
import {
  loginUser,
  postUser,
  refreshAccessToken,
} from "../controllers/authController.js";
import { fetchEmployeeById } from "../controllers/employeeController.js";
import { validateLogin, validateSignup } from "../middleware/validateAuth.js";
import { findUserById } from "../models/userModel.js";

const router = express.Router();

router.post("/signup", validateSignup, postUser);
router.post("/login", validateLogin, loginUser);
router.post("/refresh", refreshAccessToken);

export default router;
