import express from "express";
import dotenv from "dotenv";
import "./config/db.js";
import employeeRoutes from "./routes/employeeRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { notFound } from "./middleware/notFound.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(express.json());

// Routes
app.use(employeeRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
