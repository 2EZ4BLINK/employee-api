import express from "express";
import { postUser } from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", postUser);

export default router;
