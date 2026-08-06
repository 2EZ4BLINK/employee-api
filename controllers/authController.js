import { createUser, getUser } from "../models/userModel.js";
import bcrypt from "bcrypt";

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

const fetchUserByEmail = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await getUser(email);

    if (user.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json(user[0]);
  } catch (error) {
    console.error(error);
    next({ message: "Failed getting user" });
  }
};

export { postUser, fetchUserByEmail };
