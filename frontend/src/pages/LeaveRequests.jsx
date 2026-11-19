import { useEffect, useState } from "react";
import api, { toList, errorText } from "../services/api";
import { statusColor } from "./ApplyLeave";

export default function LeaveRequests() {
  const [leaves, setLeaves] = useState([]);
  const [filter, setFilter] = useState("Pending");
  const [message, setMessage] = useState({ type: "", text: "" });

  const load = () => {
    api
      .get("/api/leaves/")
      .then((res) => setLeaves(toList(res.data)))
      .catch((err) => setMessage({ type: "danger", text: errorText(err) }));
  };
  useEffect(load, []);

  const review = async (id, status) => {
    try {
      await api.patch(`/api/leaves/${id}/review/`, { status });
      setMessage({ type: "success", text: `Leave ${status.toLowerCase()}.` });
      load();
    } catch (err) {
      setMessage({ type: "danger", text: errorText(err) });
    }
  };

  const shown = leaves.filter((l) => filter === "All" || l.status === filter);

  return (
    <div>
      <h4 className="mb-3">Leave Requests</h4>

      {message.text && <div className={`alert alert-${message.type} py-2`}>{message.text}</div>}

      <div className="page-box">
        <div className="mb-3">
          {["Pending", "Approved", "Rejected", "All"].map((s) => (
            <button
              key={s}
              className={`btn btn-sm me-2 ${filter === s ? "btn-primary" : "btn-outline-primary"}`}
              onClick={() => setFilter(s)}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="table-responsive">
          <table className="table table-bordered table-sm">
            <thead className="table-light">
              <tr>
                <th>Employee</th>
                <th>Type</th>
                <th>From</th>
                <th>To</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {shown.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center">No leave requests.</td>
                </tr>
              )}
              {shown.map((l) => {
                const id = l.leave_id || l.id;
                return (
                  <tr key={id}>
                    <td>{l.employee_name || l.employee}</td>
                    <td>{l.leave_type}</td>
                    <td>{l.start_date}</td>
                    <td>{l.end_date}</td>
                    <td>{l.reason}</td>
                    <td>
                      <span className={`badge bg-${statusColor[l.status] || "secondary"}`}>{l.status}</span>
                    </td>
                    <td>
                      {l.status === "Pending" ? (
                        <>
                          <button className="btn btn-sm btn-success me-1" onClick={() => review(id, "Approved")}>
                            Approve
                          </button>
                          <button className="btn btn-sm btn-danger" onClick={() => review(id, "Rejected")}>
                            Reject
                          </button>
                        </>
                      ) : (
                        "-"
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
