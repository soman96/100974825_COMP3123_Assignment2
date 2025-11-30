const UserModel = require("../models/userModel");

// JWT tokens
const jwt = require("jsonwebtoken");

// Function for creating JWT tokens
const generateToken = (user) => {
  return jwt.sign(
    { userId: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
};

// Signup Controller
exports.signup = async (req, res) => {
  const newUser = new UserModel(req.body);

  try {
    const savedUser = await newUser.save();

    // Generate the token upon successful signup
    const token = generateToken(savedUser);

    res.status(201).json({
      message: "User created successfully",
      user_id: savedUser._id,
      token
    });
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
    const user = await UserModel.findOne({
      $or: [
        { email: email.toLowerCase() },
        { username: email.toLowerCase() }
      ],
    }).select("+password");

    if (!user) {
      return res.status(401).json({
        status: "false",
        errors: [{ message: "User not found" }],
      });
    }

    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        status: "false",
        errors: [{ message: "Invalid credentials" }],
      });
    }

    // Generate JWT token upon successful login
    const token = generateToken(user);

    res.status(200).json({
      message: "Login successful",
      user_id: user._id,
      token
    });

  } catch (error) {
    res.status(500).json({
      status: "false",
      errors: [{ message: error.message }],
    });
  }
};