import 'dotenv/config';

import mongoose from "mongoose";
import app from "./app.js";

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(console.error);

app.listen(5000, () =>
  console.log("Server running on port 5000")
);
