import { createUser } from "../models/userModel";

const postUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = "";

    const userData = {
      name,
      email,
      hashedPassword,
    };

    const result = await createUser(userData);

    if (result.affectedRows == 0) {
      res.status(500).json({
        messgae: "Something went wrong",
      });
      return;
    }

    res.status(201).json({
      message: "User created successfully",
    });
  } catch (error) {
    console.error(error);
    next({ message: "Failed creating user" });
  }
};
