import express from "express";
import { fetchUserByEmail, postUser } from "../controllers/authController.js";
import { fetchEmployeeById } from "../controllers/employeeController.js";

const router = express.Router();

router.post("/signup", postUser);
router.get("/signup", fetchUserByEmail);

export default router;
