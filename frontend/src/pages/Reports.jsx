import { useState } from "react";
import api, { toList, errorText } from "../services/api";

export default function Reports() {
  const [what, setWhat] = useState("attendance");
  const [period, setPeriod] = useState("daily");
  const [day, setDay] = useState(new Date().toISOString().slice(0, 10));
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [rows, setRows] = useState(null);
  const [error, setError] = useState("");

  const generate = async () => {
    setError("");
    setRows(null);
    const params = period === "daily" ? { type: "daily", date: day } : { type: "monthly", month };
    try {
      const res = await api.get(`/api/reports/${what}/`, { params });
      setRows(toList(res.data));
    } catch (err) {
      setError(errorText(err));
    }
  };

  const columns = rows && rows.length > 0 ? Object.keys(rows[0]) : [];
  const nice = (k) => k.replace(/_/g, " ");

  return (
    <div>
      <h4 className="mb-3">Reports</h4>

      <div className="page-box mb-3 no-print">
        <div className="row g-2 align-items-end">
          <div className="col-auto">
            <label className="form-label mb-0 small">Report</label>
            <select className="form-select" value={what} onChange={(e) => setWhat(e.target.value)}>
              <option value="attendance">Attendance</option>
              <option value="leaves">Leaves</option>
            </select>
          </div>
          <div className="col-auto">
            <label className="form-label mb-0 small">Type</label>
            <select className="form-select" value={period} onChange={(e) => setPeriod(e.target.value)}>
              <option value="daily">Daily</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
          <div className="col-auto">
            <label className="form-label mb-0 small">{period === "daily" ? "Date" : "Month"}</label>
            {period === "daily" ? (
              <input type="date" className="form-control" value={day} onChange={(e) => setDay(e.target.value)} />
            ) : (
              <input type="month" className="form-control" value={month} onChange={(e) => setMonth(e.target.value)} />
            )}
          </div>
          <div className="col-auto">
            <button className="btn btn-primary" onClick={generate}>Generate</button>
            {rows && rows.length > 0 && (
              <button className="btn btn-outline-secondary ms-2" onClick={() => window.print()}>
                Print
              </button>
            )}
          </div>
        </div>
      </div>

      {error && <div className="alert alert-danger py-2">{error}</div>}

      {rows && (
        <div className="page-box">
          <h6 className="text-capitalize">
            {period} {what} report - {period === "daily" ? day : month}
          </h6>
          {rows.length === 0 ? (
            <p className="mb-0">No data for this period.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-bordered table-sm">
                <thead className="table-light">
                  <tr>
                    {columns.map((c) => (
                      <th key={c} className="text-capitalize">{nice(c)}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r, i) => (
                    <tr key={i}>
                      {columns.map((c) => (
                        <td key={c}>{r[c] === null ? "-" : String(r[c])}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
