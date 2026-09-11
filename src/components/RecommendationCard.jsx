import React from "react";
import {
  Clock3,
  ArrowUpRight,
} from "lucide-react";

function formatTime(hour) {
  const numericHour = Number(hour);

  if (
    !Number.isFinite(numericHour)
  ) {
    return "Time not set";
  }

  const period =
    numericHour >= 12
      ? "PM"
      : "AM";

  const displayHour =
    numericHour % 12 === 0
      ? 12
      : numericHour % 12;

  return `${displayHour}:00 ${period}`;
}

export default function RecommendationCard({
  recommendation,
  onOpen,
}) {
  if (!recommendation) {
    return null;
  }

  const rank =
    recommendation
      .recommendation_rank_v1 ??
    "—";

  const score =
    Number(
      recommendation
        .final_opportunity_score_v3
    );

  return (
    <button
      type="button"
      className="recommendation-card"
      onClick={() =>
        onOpen?.(recommendation)
      }
    >
      <div className="recommendation-top">
        <span className="recommendation-rank">
          #{rank}
        </span>

        <span className="recommendation-score">
          {Number.isFinite(score)
            ? score.toFixed(2)
            : "—"}
        </span>
      </div>

      <div className="recommendation-theme">
        {recommendation.theme ||
          "Unspecified theme"}
      </div>

      <h3>
        {recommendation.hook_v1 ||
          "Untitled recommendation"}
      </h3>

      <div className="recommendation-meta">
        <span>
          {recommendation.platform ||
            "Platform"}
        </span>

        <span>•</span>

        <span>
          {recommendation.content_type ||
            "Content"}
        </span>
      </div>

      <div className="recommendation-time">
        <Clock3
          size={14}
          strokeWidth={1.8}
        />

        <span>
          {formatTime(
            recommendation.hour
          )}
        </span>
      </div>

      <div className="recommendation-action">
        <span>
          View recommendation
        </span>

        <ArrowUpRight
          size={16}
          strokeWidth={1.8}
        />
      </div>
    </button>
  );
}