import DashboardBody from "../components/DashboardBody";

export default function EmployeeDashboard() {
  return (
    <DashboardBody
      title="My Dashboard"
      links={[
        ["/attendance", "Check In / Check Out"],
        ["/apply-leave", "Apply for Leave"],
        ["/profile", "My Profile"],
      ]}
    />
  );
}
