import { useEffect, useState } from "react";
import api, { toList, errorText } from "../services/api";

export const statusColor = { Pending: "warning", Approved: "success", Rejected: "danger" };

const empty = { leave_type: "Sick Leave", start_date: "", end_date: "", reason: "" };

export default function ApplyLeave() {
  const [form, setForm] = useState(empty);
  const [leaves, setLeaves] = useState([]);
  const [message, setMessage] = useState({ type: "", text: "" });

  const load = () => {
    api.get("/api/leaves/my/").then((res) => setLeaves(toList(res.data))).catch(() => {});
  };
  useEffect(load, []);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.start_date || !form.end_date) return setMessage({ type: "danger", text: "Select both dates." });
    if (form.end_date < form.start_date)
      return setMessage({ type: "danger", text: "End date cannot be earlier than start date." });
    try {
      await api.post("/api/leaves/", form);
      setMessage({ type: "success", text: "Leave request sent. Status: Pending." });
      setForm(empty);
      load();
    } catch (err) {
      setMessage({ type: "danger", text: errorText(err) });
    }
  };

  return (
    <div>
      <h4 className="mb-3">Apply for Leave</h4>

      {message.text && <div className={`alert alert-${message.type} py-2`}>{message.text}</div>}

      <form className="page-box mb-4" onSubmit={handleSubmit}>
        <div className="row g-3">
          <div className="col-md-4">
            <label className="form-label">Leave type</label>
            <select className="form-select" name="leave_type" value={form.leave_type} onChange={change}>
              <option>Sick Leave</option>
              <option>Casual Leave</option>
              <option>Annual Leave</option>
              <option>Other</option>
            </select>
          </div>
          <div className="col-md-4">
            <label className="form-label">Start date</label>
            <input type="date" className="form-control" name="start_date" value={form.start_date} onChange={change} />
          </div>
          <div className="col-md-4">
            <label className="form-label">End date</label>
            <input type="date" className="form-control" name="end_date" value={form.end_date} onChange={change} />
          </div>
          <div className="col-12">
            <label className="form-label">Reason</label>
            <textarea className="form-control" rows="2" name="reason" value={form.reason} onChange={change} />
          </div>
        </div>
        <button className="btn btn-primary mt-3">Apply</button>
      </form>

      <div className="page-box">
        <h6>My Leave Applications</h6>
        <div className="table-responsive">
          <table className="table table-bordered table-sm">
            <thead className="table-light">
              <tr>
                <th>Type</th>
                <th>From</th>
                <th>To</th>
                <th>Reason</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {leaves.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center">No leave applications yet.</td>
                </tr>
              )}
              {leaves.map((l) => (
                <tr key={l.leave_id || l.id}>
                  <td>{l.leave_type}</td>
                  <td>{l.start_date}</td>
                  <td>{l.end_date}</td>
                  <td>{l.reason}</td>
                  <td>
                    <span className={`badge bg-${statusColor[l.status] || "secondary"}`}>{l.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
