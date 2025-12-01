import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

const EmployeeList = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState("");
  const [search, setSearch] = useState({ department: "", position: "" });

  const fetchEmployees = async () => {
    try {
      const res = await api.get("/emp/employees");
      setEmployees(res.data || []);
      setError("");
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.errors?.[0]?.message ||
        "Failed to fetch employees";
      setError(msg);
    }
  };

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearch((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();

    // Get all employees if no search specified
    if (!search.department && !search.position) {
      fetchEmployees();
      return;
    }

    try {
      const params = {};
      if (search.department) params.department = search.department;
      if (search.position) params.position = search.position;

      const res = await api.get("/emp/employees/search", { params });
      setEmployees(res.data || []);
      setError("");
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.errors?.[0]?.message ||
        "Search failed";
      setError(msg);
    }
  };

  const handleReset = () => {
    setSearch({ department: "", position: "" });
    fetchEmployees();
  };

  const handleEdit = (id) => {
    navigate(`/employees/${id}/edit`);
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this employee?"
    );
    if (!confirmed) return;

    try {
      await api.delete("/emp/employees", { params: { eid: id } });
      setEmployees((prev) => prev.filter((emp) => emp._id !== id));
      setError("");
    } catch (err) {
      const msg =
        err.response?.data?.errors?.[0]?.message ||
        err.response?.data?.message ||
        "Failed to delete employee";
      setError(msg);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  return (
    <div className="container mt-4 text-light">

      {/* Header row */}
      <div className="mb-3 d-flex justify-content-between align-items-center">
        <h2>Employees</h2>
        <button
          className="btn btn-primary"
          onClick={() => navigate("/employees/add")}
        >
          Add Employee
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {/* Search Bar */}
      <form
        className="row mb-4 align-items-stretch justify-content-center"
        onSubmit={handleSearchSubmit}
      >
        {/* Department Input */}
        <div className="col-md-4 mb-2">
          <input
            type="text"
            name="department"
            className="form-control h-100"
            placeholder="Search by Department"
            value={search.department}
            onChange={handleSearchChange}
          />
        </div>

        {/* Position Input */}
        <div className="col-md-4 mb-2">
          <input
            type="text"
            name="position"
            className="form-control h-100"
            placeholder="Search by Position"
            value={search.position}
            onChange={handleSearchChange}
          />
        </div>

        {/* Buttons */}
        <div className="col-md-4 mb-2 d-flex align-items-stretch">
          <button
            type="submit"
            className="btn btn-primary w-50 me-2 h-100"
          >
            Search
          </button>

          <button
            type="button"
            className="btn btn-secondary w-50 h-100"
            onClick={handleReset}
          >
            Reset
          </button>
        </div>
      </form>

      {/* Table */}
      <div className="table-responsive">
        <table className="table table-dark table-striped table-bordered align-middle">
          <thead className="table-secondary text-dark">
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Position</th>
              <th>Department</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {employees.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center">
                  No employees found.
                </td>
              </tr>
            ) : (
              employees.map((emp) => (
                <tr key={emp._id}>
                  <td>{emp.first_name}</td>
                  <td>{emp.last_name}</td>
                  <td>{emp.email}</td>
                  <td>{emp.position}</td>
                  <td>{emp.department}</td>

                  <td className="text-center">
                    <button
                      className="btn btn-sm btn-success me-2"
                      onClick={() => navigate(`/employees/${emp._id}/view`)}
                    >
                      View
                    </button>

                    <button
                      className="btn btn-sm btn-warning me-2"
                      onClick={() => handleEdit(emp._id)}
                    >
                      Edit
                    </button>

                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(emp._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>

        </table>
      </div>
    </div>
  );
};

export default EmployeeList;