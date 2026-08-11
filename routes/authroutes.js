import express from "express";
import {
  loginUser,
  logoutUser,
  postUser,
  refreshAccessToken,
} from "../controllers/authController.js";
import { validateLogin, validateSignup } from "../middleware/validateAuth.js";

const router = express.Router();

router.post("/signup", validateSignup, postUser);
router.post("/login", validateLogin, loginUser);
router.post("/refresh", refreshAccessToken);
router.post("/logout", logoutUser);

export default router;
