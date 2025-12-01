import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";

const EmployeeEdit = () => {
  const { id } = useParams();
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

  const [profilePicFile, setProfilePicFile] = useState(null);
  const [currentProfilePic, setCurrentProfilePic] = useState(null);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Load existing employee
  const fetchEmployee = async () => {
    try {
      const res = await api.get(`/emp/employees/${id}`);
      const emp = res.data;

      setForm({
        first_name: emp.first_name || "",
        last_name: emp.last_name || "",
        email: emp.email || "",
        position: emp.position || "",
        salary: emp.salary !== undefined ? emp.salary : "",
        date_of_joining: emp.date_of_joining
          ? new Date(emp.date_of_joining).toISOString().slice(0, 10)
          : "",
        department: emp.department || "",
      });

      // Load existing profile picture
      setCurrentProfilePic(emp.profile_picture || null);

      setError("");
    } catch (err) {
      const msg =
        err.response?.data?.errors?.[0]?.message ||
        err.response?.data?.message ||
        "Failed to load employee for editing";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployee();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: name === "salary" ? value.replace(/[^\d.]/g, "") : value,
    }));
  };

  // Handle selecting file
  const handleProfilePicChange = (e) => {
    setProfilePicFile(e.target.files[0] || null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      // Build formdata
      const formData = new FormData();

      formData.append("first_name", form.first_name);
      formData.append("last_name", form.last_name);
      formData.append("email", form.email);
      formData.append("position", form.position);
      formData.append("department", form.department);

      if (form.salary !== "") {
        formData.append("salary", String(Number(form.salary)));
      }

      formData.append("date_of_joining", form.date_of_joining);

      if (profilePicFile) {
        formData.append("profile_picture", profilePicFile);
      }

      // Send update request
      await api.put(`/emp/employees/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      navigate("/employees");
    } catch (err) {
      const msg =
        err.response?.data?.errors?.[0]?.message ||
        err.response?.data?.message ||
        "Failed to update employee";
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate("/employees");
  };

  if (loading) {
    return (
      <div className="container mt-4 text-light">
        <p>Loading employee...</p>
      </div>
    );
  }

  return (
    <div className="container mt-4 text-light">
      <div className="mb-3 d-flex justify-content-between align-items-center">
        <h2>Edit Employee</h2>
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

          {currentProfilePic && (
            <div className="text-center mb-4">
              <img
                src={`http://localhost:3000${currentProfilePic}`}
                alt="Profile"
                className="img-thumbnail"
                style={{ maxWidth: "180px", borderRadius: "10px" }}
              />
            </div>
          )}

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

                <div className="mb-3">
                <label className="form-label">Profile Picture (Optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  className="form-control"
                  onChange={handleProfilePicChange}
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
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>

          </form>

        </div>
      </div>
    </div>
  );
};

export default EmployeeEdit;
