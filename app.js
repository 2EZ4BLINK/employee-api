import express from "express";

import authRoutes from "./routes/authRoutes.js";
import { notFound } from "./middleware/notFound.js";
import employeeRoutes from "./routes/employeeRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("<h1>Hello World</h1>");
});
app.use("/employees", employeeRoutes);
app.use("/auth", authRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
