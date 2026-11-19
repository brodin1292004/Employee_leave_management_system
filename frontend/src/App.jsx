import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import HRDashboard from "./pages/HRDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import Employees from "./pages/Employees";
import Attendance from "./pages/Attendance";
import ApplyLeave from "./pages/ApplyLeave";
import LeaveRequests from "./pages/LeaveRequests";
import Reports from "./pages/Reports";
import Profile from "./pages/Profile";

// page frame: top bar + side menu + page content
function Layout() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return (
    <>
      <Navbar />
      <div className="d-md-flex">
        <Sidebar />
        <div className="flex-grow-1 p-3">
          <Outlet />
        </div>
      </div>
    </>
  );
}

// only lets the listed roles open a page
function RoleRoute({ roles, children }) {
  const { user } = useAuth();
  return roles.includes(user?.role) ? children : <Navigate to="/" replace />;
}

function Home() {
  const { user } = useAuth();
  if (user.role === "Admin") return <AdminDashboard />;
  if (user.role === "HR Manager") return <HRDashboard />;
  return <EmployeeDashboard />;
}

export default function App() {
  const staff = ["Admin", "HR Manager"];
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/employees" element={<RoleRoute roles={staff}><Employees /></RoleRoute>} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/apply-leave" element={<RoleRoute roles={["Employee"]}><ApplyLeave /></RoleRoute>} />
        <Route path="/leave-requests" element={<RoleRoute roles={staff}><LeaveRequests /></RoleRoute>} />
        <Route path="/reports" element={<RoleRoute roles={staff}><Reports /></RoleRoute>} />
        <Route path="/profile" element={<RoleRoute roles={["Employee"]}><Profile /></RoleRoute>} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
