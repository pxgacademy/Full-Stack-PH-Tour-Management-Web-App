import cors from "cors";
import express, { Request, Response } from "express";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
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

// Not Found handler (optional)
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "API Not Found",
  });
});

export default app;
