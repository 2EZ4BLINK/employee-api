import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import { createUser, findUserByEmail } from "../models/userModel.js";

const postUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
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

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "5m",
      },
    );

    return res.status(200).json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    console.error(error);
    next({ message: "Failed logging in" });
  }
};

export { postUser, loginUser };
