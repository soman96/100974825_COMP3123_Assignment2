const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      maxlength: [30, "First name cannot exceed 30 characters"],
      lowercase: true,
    },
    last_name: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
      maxlength: [30, "Last name cannot exceed 30 characters"],
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+\@.+\..+/, "Please fill a valid email address"],
      lowercase: true,
      trim: true,
    },
    position: {
      type: String,
      required: [true, "Position is required"],
      trim: true,
      maxlength: [50, "Position cannot exceed 50 characters"],
    },
    salary: {
      type: Number,
      required: [true, "Salary is required"],
      min: [0, "Salary cannot be negative"],
    },
    date_of_joining: {
      type: Date,
      required: [true, "Date of hire is required"],
    },
    department: {
      type: String,
      required: [true, "Department is required"],
      trim: true,
      maxlength: [50, "Department cannot exceed 50 characters"],
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at", select: false },
  }
);

// Exclude created_at and updated_at from query results by default
employeeSchema.path("created_at").select(false);
employeeSchema.path("updated_at").select(false);
// Remove version from JSON output
employeeSchema.set("toJSON", { versionKey: false });
employeeSchema.set("toObject", { versionKey: false });

module.exports = mongoose.model("Employee", employeeSchema);
