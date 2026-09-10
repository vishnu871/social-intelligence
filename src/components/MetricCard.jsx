export default function MetricCard({
  label,
  value,
  detail,
  accent = "purple",
}) {
  return (
    <article
      className={`metric-card accent-${accent}`}
    >
      <div className="metric-label">
        {label}
      </div>

      <div className="metric-value">
        {value}
      </div>

      {detail && (
        <div className="metric-detail">
          {detail}
        </div>
      )}
    </article>
  );
}