import { sendNotification } from "../services/notification.service.js";

export const createNotification = async (req, res) => {
  try {
    const { userId, title, message, type, action } = req.body;
    const notification = await sendNotification({ userId, title, message, type, action });
    res.status(201).json({ success: true, notification });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
