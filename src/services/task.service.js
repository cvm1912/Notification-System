import Task from "../models/task.js";
import beamsClient from "../config/pusherBeams.js";

export const createTaskAndNotify = async ({ title, interest, userId }) => {
  if (!title || !userId) {
    throw new Error("title and userId are required");
  }

  const task = await Task.create({ title, userId });

  const payload = {
    fcm: { notification: { title: "New Task!", body: title } },
    apns: { aps: { alert: { title: "New Task!", body: title } } },
    web: { notification: { title: "New Task!", body: title } },
  };

  if (interest) {
    await beamsClient.publishToInterests([interest], payload);
  } else {
    await beamsClient.publishToUsers([String(userId)], payload);
  }

  return task;
};

