import DashboardBody from "../components/DashboardBody";

export default function HRDashboard() {
  return (
    <DashboardBody
      title="HR Dashboard"
      links={[
        ["/employees", "View Employees"],
        ["/attendance", "View Attendance"],
        ["/leave-requests", "Leave Requests"],
        ["/reports", "Reports"],
      ]}
    />
  );
}
