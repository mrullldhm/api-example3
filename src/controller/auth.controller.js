import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../database/db.js";

export const signUp = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 8);

    // Insert user
    const insertUser = db.prepare(
      `INSERT INTO users (username, password) VALUES (?, ?)`
    );
    const result = insertUser.run(username, hashedPassword);

    // Insert default todo
    const defaultTodo = `Hello :) Add your first todo!`;
    const insertTodo = db.prepare(
      `INSERT INTO todos (user_id, task) VALUES (?, ?)`
    );
    insertTodo.run(result.lastInsertRowid, defaultTodo);

    // Create token
    const token = jwt.sign(
      { id: result.lastInsertRowid },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(201).json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(503).send({ message: "Database error" });
  }
};

export const signIn = async (req, res) => {
  const { username, password } = req.body;

  try {
    const getUser = db.prepare("SELECT * FROM users WHERE username = ?");
    const user = getUser.get(username);

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) {
      return res.status(401).send({ message: "Invalid password" });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });
    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(503).send({ message: "Server error" });
  }
};
