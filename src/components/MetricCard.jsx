import React from "react";

export default function MetricCard({
  label,
  value,
  description,
  accent = "plum",
}) {
  return (
    <div className={`metric-card metric-${accent}`}>
      <div className="metric-label">{label}</div>

      <div className="metric-value">{value}</div>

      {description && (
        <div className="metric-description">
          {description}
        </div>
      )}
    </div>
  );
}