import React from "react";

export default function MetricCard({
  label,
  value,
  description,
}) {
  return (
    <article className="metric-card">
      <div className="metric-label">
        {label}
      </div>

      <div className="metric-value">
        {value}
      </div>

      <div className="metric-description">
        {description}
      </div>
    </article>
  );
}