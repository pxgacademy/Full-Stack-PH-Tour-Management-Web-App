import cors from "cors";
import express, { Request, Response } from "express";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import { notFound } from "./app/middlewares/notFound";
import { router } from "./routes";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ROUTES
app.use("/api/v1", router);

// ROOT ROUTES
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "Welcome to PH Tour Management Server" });
});

// Global Error Handler
app.use(globalErrorHandler);

// Not Found handler
app.use(notFound);

export default app;
