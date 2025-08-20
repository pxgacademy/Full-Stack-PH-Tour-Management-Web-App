/*

import express from "express";
import cookieParser from "cookie-parser";
import csrf from "csurf";

const app = express();
app.use(cookieParser());
app.use(express.json());

// Initialize CSRF protection (token will be stored in a cookie)
const csrfProtection = csrf({ cookie: true });

// Route to give CSRF token to frontend
app.get("/csrf-token", csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// Protected route
app.post("/transfer-money", csrfProtection, (req, res) => {
  res.json({ message: "Money transferred successfully" });
});

// Error handler
app.use((err, req, res, next) => {
  if (err.code === "EBADCSRFTOKEN") {
    return res.status(403).json({ error: "Invalid CSRF token" });
  }
  next(err);
});

app.listen(3000, () => console.log("Server running on port 3000"));

*/