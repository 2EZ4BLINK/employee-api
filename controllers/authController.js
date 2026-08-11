import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import { createUser, findUserByEmail } from "../models/userModel.js";

const postUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const userEmail = await findUserByEmail(email);

    if (userEmail)
      return res.status(409).json({
        message: "Email already exists",
      });

    const hashedPassword = await bcrypt.hash(password, 10);

    const userData = {
      name,
      email,
      hashedPassword,
    };

    const result = await createUser(userData);

    if (result.affectedRows == 0) {
      return res.status(500).json({
        message: "Something went wrong",
      });
    }

    res.status(201).json({
      message: "User created successfully",
    });
  } catch (error) {
    console.error(error);
    next({ message: "Failed creating user" });
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const isMatched = await bcrypt.compare(password, user.password);

    if (!isMatched) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const accessToken = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_ACCESS_SECRET,
      {
        expiresIn: "5m",
      },
    );

    const refreshToken = jwt.sign(
      {
        id: user.id,
      },
      process.env.JWT_REFRESH_SECRET,
      {
        expiresIn: "7d",
      },
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Login successful",
      accessToken,
    });
  } catch (error) {
    console.error(error);
    next({
      status: 500,
      message: "Failed logging in",
    });
  }
};

export const refreshAccessToken = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        message: "No refresh token",
      });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    const user = await findUserById(decoded.id);

    if (!user) {
      return res.status(401).json({
        message: "User no longer exists",
      });
    }

    const accessToken = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_ACCESS_SECRET,
      {
        expiresIn: "5m",
      },
    );

    return res.status(200).json({
      message: "New token created",
      accessToken,
    });
  } catch (error) {
    console.error(error);

    return next({
      status: 401,
      message: "Invalid or expired refresh token",
    });
  }
};

export { postUser, loginUser };
