import { Router } from "express";
import { createTodo, deleteTodo, getTodo, updateTodo } from "../controller/todo.controller.js";

const todoRouter = Router();

// Get all todos for logged-in user
todoRouter.get("/", getTodo);

// Create a new todo
todoRouter.post("/", createTodo);

// Update a todo
todoRouter.put("/:id", updateTodo);

// Delete a todo
todoRouter.delete("/:id", deleteTodo);

export default todoRouter