import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

const EmployeeAdd = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    position: "",
    salary: "",
    date_of_joining: "",
    department: "",
  });

  // New state for profile picture file
  const [profilePicture, setProfilePicture] = useState(null);

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      // Keep salary numeric-only string
      [name]: name === "salary" ? value.replace(/[^\d.]/g, "") : value,
    }));
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    setProfilePicture(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      // Build FormData instead of JSON
      const formData = new FormData();

      formData.append("first_name", form.first_name);
      formData.append("last_name", form.last_name);
      formData.append("email", form.email);
      formData.append("position", form.position);
      formData.append("department", form.department);

      // Convert salary to number if provided
      if (form.salary !== "") {
        formData.append("salary", String(Number(form.salary)));
      }

      // Date of joining as string (YYYY-MM-DD)
      formData.append("date_of_joining", form.date_of_joining);

      // Append profile picture file if user selected one
      if (profilePicture) {
        formData.append("profile_picture", profilePicture);
      }

      // Axios will automatically set Content-Type: multipart/form-data
      await api.post("/emp/employees", formData);

      // Go back to employee list after making new employee
      navigate("/employees");
    } catch (err) {
      const msg =
        err.response?.data?.errors?.[0]?.message ||
        err.response?.data?.message ||
        "Failed to create employee";
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate("/employees");
  };

  return (
    <div className="container mt-4 text-light">
      <div className="mb-3 d-flex justify-content-between align-items-center">
        <h2>Add Employee</h2>
        <button className="btn btn-secondary" onClick={handleCancel}>
          Back to Employees
        </button>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <div className="card bg-dark text-light border-secondary">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row mb-3">
              <div className="col-md-6 mb-3">
                <label className="form-label">First Name</label>
                <input
                  type="text"
                  name="first_name"
                  className="form-control"
                  value={form.first_name}
                  onChange={handleChange}
                  required
                  maxLength={30}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Last Name</label>
                <input
                  type="text"
                  name="last_name"
                  className="form-control"
                  value={form.last_name}
                  onChange={handleChange}
                  required
                  maxLength={30}
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                className="form-control"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="row mb-3">
              <div className="col-md-6 mb-3">
                <label className="form-label">Position</label>
                <input
                  type="text"
                  name="position"
                  className="form-control"
                  value={form.position}
                  onChange={handleChange}
                  required
                  maxLength={50}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Department</label>
                <input
                  type="text"
                  name="department"
                  className="form-control"
                  value={form.department}
                  onChange={handleChange}
                  required
                  maxLength={50}
                />
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6 mb-3">
                <label className="form-label">Salary</label>
                <input
                  type="number"
                  name="salary"
                  className="form-control"
                  value={form.salary}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Date of Joining</label>
                <input
                  type="date"
                  name="date_of_joining"
                  className="form-control"
                  value={form.date_of_joining}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">Profile Picture (Optional)</label>
              <input
                type="file"
                name="profile_picture"
                className="form-control"
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>

            <div className="d-flex justify-content-end">
              <button
                type="button"
                className="btn btn-secondary me-2"
                onClick={handleCancel}
                disabled={saving}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? "Saving..." : "Add Employee"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EmployeeAdd;