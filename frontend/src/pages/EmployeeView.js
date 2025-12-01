import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";

const EmployeeView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchEmployee = async () => {
    try {
      const res = await api.get(`/emp/employees/${id}`);
      setEmployee(res.data);
      setError("");
    } catch (err) {
      const msg =
        err.response?.data?.errors?.[0]?.message ||
        err.response?.data?.message ||
        "Failed to fetch employee details";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployee();
  }, [id]);

  const handleBack = () => {
    navigate("/employees");
  };

  if (loading) {
    return (
      <div className="container mt-4 text-light">
        <p>Loading employee details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4 text-light">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
        <button className="btn btn-secondary" onClick={handleBack}>
          Back to Employees
        </button>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="container mt-4 text-light">
        <p>Employee not found.</p>
        <button className="btn btn-secondary" onClick={handleBack}>
          Back to Employees
        </button>
      </div>
    );
  }

  return (
    <div className="container mt-4 text-light">
      <div className="mb-3 d-flex justify-content-between align-items-center">
        <h2>Employee Details</h2>
        <button className="btn btn-secondary" onClick={handleBack}>
          Back to Employees
        </button>
      </div>

      <div className="card bg-dark text-light border-secondary">
        <div className="card-body">
          <h4 className="card-title">
            {employee.first_name} {employee.last_name}
          </h4>
          <h6 className="card-subtitle mb-3 text-muted">
            {employee.position} &middot; {employee.department}
          </h6>

          <div className="mb-2">
            <strong>Email:</strong> {employee.email}
          </div>

          {employee.salary !== undefined && (
            <div className="mb-2">
              <strong>Salary:</strong> {employee.salary}
            </div>
          )}

          {employee.date_of_joining && (
            <div className="mb-2">
              <strong>Date of Joining:</strong>{" "}
              {new Date(employee.date_of_joining).toLocaleDateString()}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default EmployeeView;
