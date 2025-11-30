const UserModel = require("../models/userModel");

// Signup Controller
exports.signup = async (req, res) => {
  const newUser = new UserModel(req.body);

  try {
    const savedUser = await newUser.save();
    res.status(201).json({ message: "User created successfully", user_id: savedUser._id });
  } catch (error) {
    res.status(500).json({
      status: "false",
      errors: [{ message: error.message }],
    });
  }
};

// Login Controller
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.findOne({ $or: [{ email: email.toLowerCase() }, { username: email.toLowerCase() }] }).select("+password");

    if (!user) {
      return res.status(401).json({
        status: "false",
        errors: [{ message: "User not found" }],
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        status: "false",
        errors: [{ message: "Invalid credentials" }],
      });
    }

    res.status(200).json({ message: "Login successful", user_id: user._id });
  } catch (error) {
    res.status(500).json({
      status: "false",
      errors: [{ message: error.message }],
    });
  }
};
