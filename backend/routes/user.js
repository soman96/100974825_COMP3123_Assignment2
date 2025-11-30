const express = require("express");
const { body } = require("express-validator");
const validate = require("../middleware/validate");
const controller = require("../controllers/userController");

const userRouter = express.Router();

// Validation rules for user signup
const signupValidationRules = [
  body("username").notEmpty().withMessage("Username is required").isLength({ max: 50 }).withMessage("Username cannot exceed 50 characters"),
  body("email").notEmpty().withMessage("Email is required").isEmail().withMessage("Please provide a valid email address"),
  body("password").notEmpty().withMessage("Password is required").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
];

// Validation rules for user login
const loginValidationRules = [body("email").notEmpty().withMessage("Please provide either an email or username"), body("password").notEmpty().withMessage("Password is required")];

// Signup Route
userRouter.post("/signup", signupValidationRules, validate, controller.signup);

// Login Route
userRouter.post("/login", loginValidationRules, validate, controller.login);

module.exports = userRouter;
