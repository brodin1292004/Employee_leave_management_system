import { useEffect, useState } from "react";
import api, { toList, errorText } from "../services/api";
import { useAuth } from "../context/AuthContext";

const empty = {
  username: "",
  password: "",
  email: "",
  employee_name: "",
  phone: "",
  joining_date: "",
  department_id: "",
};

export default function Employees() {
  const { user } = useAuth();
  const isAdmin = user?.role === "Admin";

  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [search, setSearch] = useState("");

  const load = () => {
    api.get("/api/employees/").then((res) => setEmployees(toList(res.data))).catch((e) =>
      setMessage({ type: "danger", text: errorText(e) })
    );
  };

  useEffect(() => {
    load();
    api.get("/api/departments/").then((res) => setDepartments(toList(res.data))).catch(() => {});
  }, []);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const startAdd = () => {
    setForm(empty);
    setEditId(null);
    setShowForm(true);
    setMessage({ type: "", text: "" });
  };

  const startEdit = (emp) => {
    setForm({
      ...empty,
      employee_name: emp.employee_name || "",
      phone: emp.phone || "",
      joining_date: emp.joining_date || "",
      department_id: emp.department_id || (typeof emp.department === "number" ? emp.department : ""),
    });
    setEditId(emp.employee_id || emp.id);
    setShowForm(true);
    setMessage({ type: "", text: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.employee_name.trim()) return setMessage({ type: "danger", text: "Employee name is required." });
    if (form.phone && !/^\d{7,15}$/.test(form.phone))
      return setMessage({ type: "danger", text: "Phone number must contain only digits." });

    try {
      if (editId) {
        const { username, password, email, ...rest } = form;
        await api.patch(`/api/employees/${editId}/`, rest);
        setMessage({ type: "success", text: "Employee updated." });
      } else {
        await api.post("/api/employees/", form);
        setMessage({ type: "success", text: "Employee added." });
      }
      setShowForm(false);
      load();
    } catch (err) {
      setMessage({ type: "danger", text: errorText(err) });
    }
  };

  const shown = employees.filter((e) =>
    (e.employee_name || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="d-flex justify-content-between mb-3">
        <h4>Employees</h4>
        {isAdmin && (
          <button className="btn btn-primary btn-sm" onClick={startAdd}>
            Add Employee
          </button>
        )}
      </div>

      {message.text && <div className={`alert alert-${message.type} py-2`}>{message.text}</div>}

      {showForm && isAdmin && (
        <form className="page-box mb-3" onSubmit={handleSubmit}>
          <h6>{editId ? "Edit Employee" : "New Employee"}</h6>
          <div className="row g-2">
            {!editId && (
              <>
                <div className="col-md-4">
                  <input className="form-control" name="username" placeholder="Username" value={form.username} onChange={change} required />
                </div>
                <div className="col-md-4">
                  <input type="password" className="form-control" name="password" placeholder="Password" value={form.password} onChange={change} required />
                </div>
                <div className="col-md-4">
                  <input type="email" className="form-control" name="email" placeholder="Email" value={form.email} onChange={change} required />
                </div>
              </>
            )}
            <div className="col-md-4">
              <input className="form-control" name="employee_name" placeholder="Full name" value={form.employee_name} onChange={change} />
            </div>
            <div className="col-md-3">
              <input className="form-control" name="phone" placeholder="Phone" value={form.phone} onChange={change} />
            </div>
            <div className="col-md-3">
              <input type="date" className="form-control" name="joining_date" value={form.joining_date} onChange={change} />
            </div>
            <div className="col-md-2">
              <select className="form-select" name="department_id" value={form.department_id} onChange={change} required>
                <option value="">Department</option>
                {departments.map((d) => (
                  <option key={d.department_id || d.id} value={d.department_id || d.id}>
                    {d.department_name || d.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-3">
            <button className="btn btn-success btn-sm me-2">Save</button>
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowForm(false)}>
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="page-box">
        <input
          className="form-control mb-3"
          style={{ maxWidth: 300 }}
          placeholder="Search by name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="table-responsive">
          <table className="table table-bordered table-sm">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Department</th>
                <th>Phone</th>
                <th>Joining Date</th>
                {isAdmin && <th>Action</th>}
              </tr>
            </thead>
            <tbody>
              {shown.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center">No employees found.</td>
                </tr>
              )}
              {shown.map((emp) => (
                <tr key={emp.employee_id || emp.id}>
                  <td>{emp.employee_id || emp.id}</td>
                  <td>{emp.employee_name}</td>
                  <td>{emp.department_name || (typeof emp.department === "object" ? emp.department?.department_name : emp.department)}</td>
                  <td>{emp.phone}</td>
                  <td>{emp.joining_date}</td>
                  {isAdmin && (
                    <td>
                      <button className="btn btn-sm btn-outline-primary" onClick={() => startEdit(emp)}>
                        Edit
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
