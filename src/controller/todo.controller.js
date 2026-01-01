import db from "../database/db.js";

export const getTodo = (req, res) => {
  const getTodos = db.prepare("SELECT * FROM todos WHERE user_id = ?");
  const todos = getTodos.all(req.userId);
  res.json(todos);
};

export const createTodo = (req, res) => {
  const { task } = req.body;
  const insertTodo = db.prepare(
    `INSERT INTO todos (user_id, task) VALUES (?, ?)`
  );
  const result = insertTodo.run(req.userId, task);

  res.json({ id: result.lastInsertRowid, task, completed: 0 });
};

export const updateTodo = (req, res) => {
  try {
    const { completed } = req.body;
    const { id } = req.params;
    const { page } = req.query;

    const updatedTodo = db.prepare(
      "UPDATE todos SET completed = ? WHERE id = ?"
    );
    updatedTodo.run(completed, id);

    res.json({ message: "Todo completed" });
  } catch (err) {
    next(err);
  }
};

export const deleteTodo = (req, res) => {
  const { id } = req.params;
  const userId = req.userId;
  const deleteTodo = db.prepare(
    `DELETE FROM todos WHERE id = ? AND user_id = ?`
  );
  deleteTodo.run(id, userId);

  res.send({ message: "Todo deleted" });
};
