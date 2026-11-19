export default function StatCard({ label, value }) {
  return (
    <div className="border bg-white p-3 h-100">
      <div className="text-muted small">{label}</div>
      <div className="fs-3 fw-bold">{value}</div>
    </div>
  );
}
