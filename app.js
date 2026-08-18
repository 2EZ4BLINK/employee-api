import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import { notFound } from "./middleware/notFound.js";
import employeeRoutes from "./routes/employeeRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

// Routes
app.get("/", (req, res) => {
  res.send("<h1>Hello World</h1>");
});
app.use("/employees", employeeRoutes);
app.use("/auth", authRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
