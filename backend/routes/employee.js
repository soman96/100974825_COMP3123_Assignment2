const express = require("express");
const { body, query, param } = require("express-validator");
const validate = require("../middleware/validate");
const controller = require("../controllers/employeeController");
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");

const employeeRouter = express.Router();

// Apply authentication middleware to all employee routes
employeeRouter.use(auth);

// Validation rules for employee creation
const createEmployeeValidationRules = [
  body("first_name").notEmpty().withMessage("First name is required").isLength({ max: 30 }).withMessage("First name cannot exceed 30 characters"),
  body("last_name").notEmpty().withMessage("Last name is required").isLength({ max: 30 }).withMessage("Last name cannot exceed 30 characters"),
  body("email").notEmpty().withMessage("Email is required").isEmail().withMessage("Please provide a valid email address"),
  body("position").notEmpty().withMessage("Position is required").isLength({ max: 50 }).withMessage("Position cannot exceed 50 characters"),
  body("salary").notEmpty().withMessage("Salary is required").isFloat({ min: 0 }).withMessage("Salary must be a positive number"),
  body("date_of_joining").notEmpty().withMessage("Date of joining is required").isISO8601().toDate().withMessage("Please provide a valid date"),
  body("department").notEmpty().withMessage("Department is required").isLength({ max: 50 }).withMessage("Department cannot exceed 50 characters"),
];

// Validation rules for employee update
const updateEmployeeValidationRules = [
  body("first_name").optional().isLength({ max: 30 }).withMessage("First name cannot exceed 30 characters"),
  body("last_name").optional().isLength({ max: 30 }).withMessage("Last name cannot exceed 30 characters"),
  body("email").optional().isEmail().withMessage("Please provide a valid email address"),
  body("position").optional().isLength({ max: 50 }).withMessage("Position cannot exceed 50 characters"),
  body("salary").optional().isFloat({ min: 0 }).withMessage("Salary must be a positive number"),
  body("date_of_joining").optional().isISO8601().toDate().withMessage("Please provide a valid date"),
  body("department").optional().isLength({ max: 50 }).withMessage("Department cannot exceed 50 characters"),
];

// Validation rules for employee ID parameter
const employeeIdValidationRule = [param("eid").isMongoId().withMessage("Invalid employee ID")];

// Search employees by department or position
employeeRouter.get(
  "/search",
  [
    query("department").optional().isLength({ max: 50 }).withMessage("Department cannot exceed 50 characters"),
    query("position").optional().isLength({ max: 50 }).withMessage("Position cannot exceed 50 characters"),
  ],
  validate,
  controller.searchEmployees
);

// Create a new employee
employeeRouter.post("/", upload.single("profile_picture"), createEmployeeValidationRules, validate, controller.createEmployee);

// Get all employees
employeeRouter.get("/", controller.getAllEmployees);

// Get a specific employee by ID
employeeRouter.get("/:eid", employeeIdValidationRule, validate, controller.getEmployeeById);

// Update an existing employee by ID
employeeRouter.put("/:eid", upload.single("profile_picture"), employeeIdValidationRule.concat(updateEmployeeValidationRules), validate, controller.updateEmployee);

// Delete an employee by ID using query parameter
employeeRouter.delete("/", query("eid").isMongoId().withMessage("Invalid employee ID"), validate, controller.deleteEmployee);

module.exports = employeeRouter;
