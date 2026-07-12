import express from "express";
import dotenv from "dotenv";
import "./config/db.js";
import employeeRoutes from "./routes/employeeRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(employeeRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
