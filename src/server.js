import express from "express";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import authRouter from "./routes/auth.Route.js";
import todoRouter from "./routes/todo.route.js";
import dotenv from "dotenv";
import authMiddleware from "./middleware/auth.middleware.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url); // Get the File Path
const __dirname = dirname(__filename); // Get the Directory Path

// Middleware (built-in)
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public"))); // Serving Static Files
// Middleware (custom)

// app.method (route, handler)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Routes
app.use("/auth", authRouter);
app.use("/todo", authMiddleware, todoRouter);

// app.listen(port, callback)
app.listen(PORT, () => {
  console.log(`The server connect in in http://localhost:${PORT}`);
});
