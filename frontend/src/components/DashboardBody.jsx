import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api, { errorText } from "../services/api";
import StatCard from "./StatCard";

// "pending_leaves" -> "Pending leaves"
const nice = (key) => {
  const text = key.replace(/_/g, " ");
  return text.charAt(0).toUpperCase() + text.slice(1);
};

export default function DashboardBody({ title, links }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/api/dashboard/")
      .then((res) => setData(res.data))
      .catch((err) => setError(errorText(err)));
  }, []);

  // show every number / short text the backend sends as a card
  const cards = data
    ? Object.entries(data).filter(([, v]) => typeof v === "number" || typeof v === "string")
    : [];

  return (
    <div>
      <h4 className="mb-3">{title}</h4>
      {error && <div className="alert alert-danger">{error}</div>}
      {!data && !error && <p>Loading...</p>}

      <div className="row g-3 mb-4">
        {cards.map(([key, value]) => (
          <div className="col-6 col-md-3" key={key}>
            <StatCard label={nice(key)} value={value} />
          </div>
        ))}
      </div>

      <div className="page-box">
        <h6>Quick links</h6>
        {links.map(([path, label]) => (
          <Link key={path} to={path} className="btn btn-outline-primary btn-sm me-2">
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}
