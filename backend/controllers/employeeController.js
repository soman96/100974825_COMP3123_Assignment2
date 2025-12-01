const EmployeeModel = require("../models/employeeModel");

// Create a new employee
exports.createEmployee = async (req, res) => {
  const newEmployee = new EmployeeModel(req.body);

  // If pfp is uploaded, store its path in the db
  if (req.file) {
    newEmployee.profile_picture = `/uploads/${req.file.filename}`;
  }

  try {
    const savedEmployee = await newEmployee.save();
    res
      .status(201)
      .json({ message: "Employee created successfully", employee_id: savedEmployee._id });
  } catch (error) {
    res.status(500).json({
      status: "false",
      errors: [{ message: error.message }],
    });
  }
};

// Get all employees
exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await EmployeeModel.find();
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({
      status: "false",
      errors: [{ message: error.message }],
    });
  }
};

// Get a specific employee by ID
exports.getEmployeeById = async (req, res) => {
  const { eid } = req.params;

  try {
    const employee = await EmployeeModel.findById(eid);
    if (!employee) {
      return res.status(404).json({
        status: "false",
        errors: [{ message: "Employee not found" }],
      });
    }
    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({
      status: "false",
      errors: [{ message: error.message }],
    });
  }
};

// Update an existing employee by ID
exports.updateEmployee = async (req, res) => {
  const { eid } = req.params;

  try {
    const updateData = { ...req.body };

    // If a new profile picture was uploaded, update the path
    if (req.file) {
      updateData.profile_picture = `/uploads/${req.file.filename}`;
    }

    const updatedEmployee = await EmployeeModel.findByIdAndUpdate(
      eid,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedEmployee) {
      return res.status(404).json({
        status: "false",
        errors: [{ message: "Employee not found" }],
      });
    }
    res.status(200).json({ message: "Employee updated successfully" });
  } catch (error) {
    res.status(500).json({
      status: "false",
      errors: [{ message: error.message }],
    });
  }
};

// Delete an employee by ID
exports.deleteEmployee = async (req, res) => {
  const { eid } = req.query;

  try {
    const deletedEmployee = await EmployeeModel.findByIdAndDelete(eid);
    if (!deletedEmployee) {
      return res.status(404).json({
        status: "false",
        errors: [{ message: "Employee not found" }],
      });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({
      status: "false",
      errors: [{ message: error.message }],
    });
  }
};

// Search employees by department or position
exports.searchEmployees = async (req, res) => {
  const { department, position } = req.query;

  try {
    const query = {};
    if (department) {
      query.department = { $regex: department, $options: "i" };
    }

    if (position) {
      query.position = { $regex: position, $options: "i" };
    }

    const results = await EmployeeModel.find(query);

    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({
      status: "false",
      errors: [{ message: error.message }],
    });
  }
};