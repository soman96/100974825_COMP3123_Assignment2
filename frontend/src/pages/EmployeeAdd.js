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

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: name === "salary" ? value.replace(/[^\d.]/g, "") : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const payload = {
        ...form,
        salary: form.salary === "" ? undefined : Number(form.salary),
      };

      await api.post("/emp/employees", payload);

      // Go back to employee list after makign new employee
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