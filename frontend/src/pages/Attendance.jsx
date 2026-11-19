import { useEffect, useState } from "react";
import api, { toList, errorText } from "../services/api";
import { useAuth } from "../context/AuthContext";

// working hours from "09:00:00" and "17:30:00"
const hours = (inTime, outTime) => {
  if (!inTime || !outTime) return "-";
  const toMin = (t) => {
    const [h, m] = t.split(":");
    return Number(h) * 60 + Number(m);
  };
  const diff = toMin(outTime) - toMin(inTime);
  if (diff < 0) return "-";
  return `${Math.floor(diff / 60)}h ${diff % 60}m`;
};

const statusColor = { Present: "success", Absent: "danger", Late: "warning" };

export default function Attendance() {
  const { user } = useAuth();
  const isEmployee = user?.role === "Employee";

  const [records, setRecords] = useState([]);
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [date, setDate] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });

  const load = () => {
    const url = isEmployee ? "/api/attendance/my/" : "/api/attendance/";
    const params = date ? { date } : { month };
    api
      .get(url, { params })
      .then((res) => setRecords(toList(res.data)))
      .catch((err) => setMessage({ type: "danger", text: errorText(err) }));
  };

  useEffect(load, [month, date]);

  const checkIn = async () => {
    try {
      await api.post("/api/attendance/check-in/");
      setMessage({ type: "success", text: "Check-in saved." });
      load();
    } catch (err) {
      setMessage({ type: "danger", text: errorText(err) });
    }
  };

  const checkOut = async () => {
    try {
      await api.patch("/api/attendance/check-out/");
      setMessage({ type: "success", text: "Check-out saved." });
      load();
    } catch (err) {
      setMessage({ type: "danger", text: errorText(err) });
    }
  };

  return (
    <div>
      <h4 className="mb-3">{isEmployee ? "My Attendance" : "Attendance Records"}</h4>

      {message.text && <div className={`alert alert-${message.type} py-2`}>{message.text}</div>}

      {isEmployee && (
        <div className="page-box mb-3">
          <p className="mb-2">Today: {new Date().toDateString()}</p>
          <button className="btn btn-success me-2" onClick={checkIn}>Check In</button>
          <button className="btn btn-danger" onClick={checkOut}>Check Out</button>
        </div>
      )}

      <div className="page-box">
        <div className="row g-2 mb-3">
          <div className="col-auto">
            <label className="form-label mb-0 small">Month</label>
            <input type="month" className="form-control" value={month} onChange={(e) => { setMonth(e.target.value); setDate(""); }} />
          </div>
          <div className="col-auto">
            <label className="form-label mb-0 small">Or a single day</label>
            <input type="date" className="form-control" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-bordered table-sm">
            <thead className="table-light">
              <tr>
                <th>Date</th>
                {!isEmployee && <th>Employee</th>}
                <th>Check In</th>
                <th>Check Out</th>
                <th>Working Hours</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {records.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center">No attendance records.</td>
                </tr>
              )}
              {records.map((r) => (
                <tr key={r.attendance_id || r.id}>
                  <td>{r.attendance_date}</td>
                  {!isEmployee && <td>{r.employee_name || r.employee}</td>}
                  <td>{r.check_in || "-"}</td>
                  <td>{r.check_out || "-"}</td>
                  <td>{hours(r.check_in, r.check_out)}</td>
                  <td>
                    <span className={`badge bg-${statusColor[r.status] || "secondary"}`}>{r.status || "-"}</span>
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
