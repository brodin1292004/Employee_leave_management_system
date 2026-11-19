import { useEffect, useState } from "react";
import api, { errorText } from "../services/api";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ phone: "" });
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    api
      .get("/api/employees/profile/")
      .then((res) => {
        setProfile(res.data);
        setForm({ phone: res.data.phone || "" });
      })
      .catch((err) => setMessage({ type: "danger", text: errorText(err) }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.phone && !/^\d{7,15}$/.test(form.phone))
      return setMessage({ type: "danger", text: "Phone number must contain only digits." });
    try {
      const res = await api.patch("/api/employees/profile/", form);
      setProfile(res.data);
      setMessage({ type: "success", text: "Profile updated." });
    } catch (err) {
      setMessage({ type: "danger", text: errorText(err) });
    }
  };

  return (
    <div>
      <h4 className="mb-3">My Profile</h4>
      {message.text && <div className={`alert alert-${message.type} py-2`}>{message.text}</div>}

      {profile && (
        <form className="page-box" style={{ maxWidth: 520 }} onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Name</label>
            <input className="form-control" value={profile.employee_name || ""} disabled />
          </div>
          <div className="mb-3">
            <label className="form-label">Department</label>
            <input
              className="form-control"
              value={profile.department_name || (typeof profile.department === "string" ? profile.department : "") || ""}
              disabled
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Joining date</label>
            <input className="form-control" value={profile.joining_date || ""} disabled />
          </div>
          <div className="mb-3">
            <label className="form-label">Phone</label>
            <input className="form-control" value={form.phone} onChange={(e) => setForm({ phone: e.target.value })} />
          </div>
          <button className="btn btn-primary">Save changes</button>
        </form>
      )}
    </div>
  );
}
