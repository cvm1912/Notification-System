import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },

    title: String,
    message: String,

    type: {
      type: String,
      enum: ["APPLICATION", "JOB", "TICKET", "REVIEW", "SYSTEM"],
    },

    action: {
      label: String,   // Button text
      screen: String,  // App screen name
      params: Object,  // Dynamic data (jobId, ticketId)
    },

    isRead: {
      type: Boolean,
      default: false,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Notification", notificationSchema);
