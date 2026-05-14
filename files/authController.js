/**
 * Auth Controller
 * signup — creates new user + returns JWT
 * login  — validates credentials + returns JWT
 * getMe  — returns current authenticated user
 */
const { validationResult } = require("express-validator");
const User          = require("../models/User");
const generateToken = require("../utils/generateToken");

/* ─────────────── SIGNUP ─────────────────────────── */
const signup = async (req, res, next) => {
  try {
    // 1. Validate request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
      });
    }

    const { name, email, password } = req.body;

    // 2. Check if email already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists",
      });
    }

    // 3. Create user (password is hashed by pre-save hook)
    const user = await User.create({ name, email, password });

    // 4. Generate JWT
    const token = generateToken(user._id);

    // 5. Update last login
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      token,
      user: user.toSafeObject(),
    });
  } catch (err) {
    next(err);
  }
};

/* ─────────────── LOGIN ──────────────────────────── */
const login = async (req, res, next) => {
  try {
    // 1. Validate
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
      });
    }

    const { email, password } = req.body;

    // 2. Find user — explicitly select password (select: false on schema)
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      // Use generic message to avoid email enumeration
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // 3. Check account status
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Your account has been deactivated. Contact support.",
      });
    }

    // 4. Compare passwords
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // 5. Generate JWT
    const token = generateToken(user._id);

    // 6. Update last login
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: user.toSafeObject(),
    });
  } catch (err) {
    next(err);
  }
};

/* ─────────────── GET CURRENT USER ──────────────── */
const getMe = async (req, res, next) => {
  try {
    // req.user is set by protect middleware
    res.status(200).json({
      success: true,
      user: req.user.toSafeObject(),
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { signup, login, getMe };
