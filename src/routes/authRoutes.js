import express from "express";
import {registerUser, loginUser, updateProfile, addDeviceToken, removeDeviceToken} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.put("/profile/:id", updateProfile);
router.post("/device-token/:id", addDeviceToken);
router.delete("/device-token/:id", removeDeviceToken);

export default router;
