import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-dark bg-dark px-3 no-print" style={{ height: 56 }}>
      <span className="navbar-brand mb-0 h6">Employee Attendance & Leave Management</span>
      <div className="text-white">
        <span className="me-3">
          {user?.username} ({user?.role})
        </span>
        <button className="btn btn-sm btn-outline-light" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}
