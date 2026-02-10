import User from "../models/user.js";
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "name, email, password are required fields",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        message: "User already exists with this email",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "USER",
    });

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    res.status(500).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "email and password are required",
      });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // check user is active or block
    if (!user.isActive) {
      return res.status(403).json({
        message: "Account is deactivated",
      });
    }

    // compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // generate a token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const userId = req.params;
    const { name, notificationSettings } = req.body;

    const forbiddenField = ["password", "email", "role", "isActive"];
    forbiddenField.forEach((field) => delete req.body[field]);

    const user = await User.findByIdAndUpdate(
      userId,
      { name, notificationSettings },
      { new: true, runValidators: true },
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      message: "Profile updated successfully",
      user,
    });
  } catch (err) {
    res.status(500).json({ message: error.message });
  }
};

const addDeviceToken = async (req, res) => {
  const userId = req.params.id;
  const { deviceToken } = req.body;

  await User.findByIdAndUpdate(
    userId,
    { $addToSet: { deviceTokens: deviceToken } },
    { new: true },
  );

  return res.status(200).json({
    message: "Device token added successfully",
  });
};

const removeDeviceToken = async (req, res) => {
  try {
  const userId = req.params.id;
  const { token } = req.body;

  await User.findByIdAndUpdate(userId, {
    $pull: { deviceTokens: token }
  });

  return res.status(500).json({
    success: true,
    message: "Device token removed successfully",
  })
  } catch (err) {
    res.status(500).json({ message: error.message });
  }
};

export { registerUser, loginUser, updateProfile, addDeviceToken, removeDeviceToken};
