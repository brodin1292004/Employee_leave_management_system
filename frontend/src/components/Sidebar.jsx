import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const menus = {
  Admin: [
    ["/", "Dashboard"],
    ["/employees", "Employees"],
    ["/attendance", "Attendance"],
    ["/leave-requests", "Leave Requests"],
    ["/reports", "Reports"],
  ],
  "HR Manager": [
    ["/", "Dashboard"],
    ["/employees", "Employees"],
    ["/attendance", "Attendance"],
    ["/leave-requests", "Leave Requests"],
    ["/reports", "Reports"],
  ],
  Employee: [
    ["/", "Dashboard"],
    ["/attendance", "My Attendance"],
    ["/apply-leave", "Apply Leave"],
    ["/profile", "My Profile"],
  ],
};

export default function Sidebar() {
  const { user } = useAuth();
  const links = menus[user?.role] || [];

  return (
    <div className="sidebar no-print">
      <ul className="nav flex-md-column">
        {links.map(([path, label]) => (
          <li className="nav-item" key={path}>
            <NavLink to={path} end className="nav-link">
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
}
