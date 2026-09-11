import React from "react";
import {
  ArrowUpRight,
  CalendarDays,
  Clock3,
  Image as ImageIcon,
} from "lucide-react";

function getPlatformShortName(platform) {
  return platform || "Platform";
}

export default function RecommendationCard({
  recommendation,
  onOpen,
}) {
  if (!recommendation) {
    return null;
  }

  const score = Number(
    recommendation.final_opportunity_score_v3 || 0
  );

  return (
    <article
      className="recommendation-card"
      onClick={() => onOpen(recommendation)}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onOpen(recommendation);
        }
      }}
    >
      <div className="recommendation-rank">
        #{recommendation.recommendation_rank_v1}
      </div>

      <div className="recommendation-content">
        <div className="recommendation-theme">
          {recommendation.theme}
        </div>

        <h3 className="recommendation-title">
          {recommendation.hook_v1 || "Untitled recommendation"}
        </h3>

        <div className="recommendation-meta">
          <span>
            {getPlatformShortName(recommendation.platform)}
          </span>

          <span className="meta-separator">·</span>

          <span>
            <Clock3 size={13} />
            {Number(recommendation.hour) || 0}:00
          </span>

          <span className="meta-separator">·</span>

          <span>
            <ImageIcon size={13} />
            {recommendation.content_type || "Content"}
          </span>

          {recommendation.current_signal_class_v1 && (
            <>
              <span className="meta-separator">·</span>

              <span className="signal-text">
                {recommendation.current_signal_class_v1}
              </span>
            </>
          )}
        </div>
      </div>

      <div className="recommendation-action">
        <div className="score">{score.toFixed(2)}</div>

        <div className="open-link">
          Open
          <ArrowUpRight size={15} />
        </div>
      </div>
    </article>
  );
}