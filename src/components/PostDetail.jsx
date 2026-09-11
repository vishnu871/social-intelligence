import React from "react";
import {
  ArrowLeft,
  Clock3,
  Copy,
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

export default function PostDetail({
  recommendation,
  onBack,
}) {
  if (!recommendation) {
    return (
      <div className="page-header">
        <button
          type="button"
          className="back-button"
          onClick={onBack}
        >
          <ArrowLeft
            size={17}
          />
          Back
        </button>

        <h1>
          Recommendation
        </h1>

        <p>
          No recommendation is
          currently selected.
        </p>
      </div>
    );
  }

  const score = Number(
    recommendation
      .final_opportunity_score_v3
  );

  return (
    <section className="post-detail">
      <button
        type="button"
        className="back-button"
        onClick={onBack}
      >
        <ArrowLeft
          size={17}
          strokeWidth={1.8}
        />
        Back to portfolio
      </button>

      <div className="post-detail-header">
        <div>
          <div className="page-kicker">
            RECOMMENDATION #
            {
              recommendation
                .recommendation_rank_v1
            }
          </div>

          <h1>
            {recommendation.hook_v1 ||
              "Untitled recommendation"}
          </h1>

          <p>
            {recommendation.theme ||
              "Unspecified theme"}
          </p>
        </div>

        <div className="post-detail-score">
          <span>
            Opportunity
          </span>

          <strong>
            {Number.isFinite(score)
              ? score.toFixed(2)
              : "—"}
          </strong>
        </div>
      </div>

      <div className="post-detail-meta">
        <div>
          <span>Platform</span>
          <strong>
            {recommendation.platform ||
              "—"}
          </strong>
        </div>

        <div>
          <span>Content type</span>
          <strong>
            {recommendation.content_type ||
              "—"}
          </strong>
        </div>

        <div>
          <span>Date</span>
          <strong>
            {recommendation.date ||
              "—"}
          </strong>
        </div>

        <div>
          <span>Time</span>
          <strong>
            <Clock3
              size={14}
            />
            {formatTime(
              recommendation.hour
            )}
          </strong>
        </div>
      </div>

      <div className="post-detail-grid">
        <section className="detail-card">
          <div className="detail-card-label">
            HOOK
          </div>

          <h2>
            {recommendation.hook_v1 ||
              "No hook available."}
          </h2>
        </section>

        <section className="detail-card">
          <div className="detail-card-label">
            CAPTION
          </div>

          <p className="detail-copy">
            {recommendation.caption_v1 ||
              "No caption available."}
          </p>
        </section>

        <section className="detail-card">
          <div className="detail-card-label">
            CALL TO ACTION
          </div>

          <div className="cta-preview">
            {recommendation.cta_v1 ||
              "No CTA available."}
          </div>
        </section>

        <section className="detail-card">
          <div className="detail-card-label">
            CREATIVE DIRECTION
          </div>

          <p className="detail-copy">
            {recommendation.creative_direction_v1 ||
              "No creative direction available."}
          </p>
        </section>
      </div>
    </section>
  );
}