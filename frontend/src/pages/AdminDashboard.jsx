import DashboardBody from "../components/DashboardBody";

export default function AdminDashboard() {
  return (
    <DashboardBody
      title="Admin Dashboard"
      links={[
        ["/employees", "Manage Employees"],
        ["/attendance", "View Attendance"],
        ["/leave-requests", "Leave Requests"],
        ["/reports", "Reports"],
      ]}
    />
  );
}
