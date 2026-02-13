import { createTaskAndNotify } from "../services/task.service.js";

export const createTask = async (req, res) => {
  try {
    const { title, interest, userId } = req.body;
    const task = await createTaskAndNotify({ title, interest, userId });
    return res.status(201).json(task);
  } catch (error) {
    const status = error.message === "title and userId are required" ? 400 : 500;
    return res.status(status).json({ error: error.message });
  }
};

