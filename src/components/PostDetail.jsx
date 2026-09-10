import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Image,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Video,
} from "lucide-react";

function formatHour(hour) {
  if (hour === null || hour === undefined || hour === "") {
    return "—";
  }

  const numericHour = Number(hour);

  if (Number.isNaN(numericHour)) {
    return String(hour);
  }

  const normalized = ((numericHour % 24) + 24) % 24;
  const suffix = normalized >= 12 ? "PM" : "AM";
  const displayHour = normalized % 12 || 12;

  return `${displayHour}:00 ${suffix}`;
}

function getPlatformIcon(platform) {
  const value = String(platform || "").toLowerCase();

  if (value.includes("instagram")) {
    return Image;
  }

  if (value.includes("linkedin")) {
    return MessageSquare;
  }

  return CalendarDays;
}

function getFormatIcon(contentType) {
  const value = String(contentType || "").toLowerCase();

  if (
    value.includes("reel") ||
    value.includes("video")
  ) {
    return Video;
  }

  if (
    value.includes("image") ||
    value.includes("carousel")
  ) {
    return Image;
  }

  return MessageSquare;
}

function getSignalClass(signal) {
  const value = String(signal || "").toLowerCase();

  if (
    value.includes("positive") ||
    value.includes("strong") ||
    value.includes("opportunity")
  ) {
    return "signal-positive";
  }

  if (
    value.includes("watch") ||
    value.includes("moderate")
  ) {
    return "signal-watch";
  }

  return "signal-neutral";
}

function formatPercentage(value) {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return "—";
  }

  return `${(numericValue * 100).toFixed(1)}%`;
}

function formatScore(value) {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return "—";
  }

  return numericValue.toFixed(2);
}

export default function PostDetail({
  recommendation,
  onBack,
}) {
  if (!recommendation) {
    return (
      <div className="empty-state">
        <strong>No recommendation selected</strong>
        <p>
          Select a recommendation from the dashboard
          or weekly calendar.
        </p>
      </div>
    );
  }

  const PlatformIcon = getPlatformIcon(
    recommendation.platform
  );

  const FormatIcon = getFormatIcon(
    recommendation.content_type
  );

  const qaStatus =
    recommendation.qa_status || "—";

  const readiness =
    recommendation.production_readiness_v1 ||
    "—";

  const isReady =
    String(readiness).toLowerCase() === "ready";

  return (
    <section className="detail-page">
      <button
        type="button"
        className="detail-back"
        onClick={onBack}
      >
        <ArrowLeft
          size={15}
          strokeWidth={1.9}
        />
        Back to recommendations
      </button>

      <div className="detail-header">
        <div className="detail-header-top">
          <div>
            <div className="detail-rank">
              Recommendation #{recommendation.recommendation_rank_v1}
            </div>

            <h1 className="detail-title">
              {recommendation.theme ||
                "Unclassified recommendation"}
            </h1>

            <div className="detail-subtitle">
              {recommendation.date || "—"} ·{" "}
              {recommendation.day || "—"} ·{" "}
              {recommendation.platform || "—"}
            </div>
          </div>

          <div className="detail-score">
            <div className="detail-score-label">
              Opportunity Score
            </div>

            <div className="detail-score-value">
              {formatScore(
                recommendation.final_opportunity_score_v3
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="detail-grid">
        <main>
          <section className="detail-section">
            <div className="detail-section-header">
              <h2>Content Recommendation</h2>
            </div>

            <div className="detail-section-body">
              <div className="content-block">
                <div className="content-label">
                  Hook
                </div>

                <p className="content-text">
                  {recommendation.hook_v1 ||
                    "No hook available."}
                </p>
              </div>

              <div className="content-block">
                <div className="content-label">
                  Caption
                </div>

                <p className="content-text">
                  {recommendation.caption_v1 ||
                    "No caption available."}
                </p>
              </div>

              <div className="content-block">
                <div className="content-label">
                  Call to Action
                </div>

                <p className="content-text">
                  {recommendation.cta_v1 ||
                    "No CTA available."}
                </p>
              </div>

              <div className="content-block">
                <div className="content-label">
                  Creative Direction
                </div>

                <div className="creative-direction">
                  {recommendation.creative_direction_v1 ||
                    "No creative direction available."}
                </div>
              </div>
            </div>
          </section>

          <section className="detail-section">
            <div className="detail-section-header">
              <h2>Intelligence Reasoning</h2>
            </div>

            <div className="detail-section-body">
              <div className="reasoning-grid">
                <div className="reasoning-item">
                  <div className="reasoning-item-label">
                    Final Opportunity
                  </div>

                  <div className="reasoning-item-value">
                    {formatScore(
                      recommendation.final_opportunity_score_v3
                    )}
                  </div>
                </div>

                <div className="reasoning-item">
                  <div className="reasoning-item-label">
                    Historical Opportunity
                  </div>

                  <div className="reasoning-item-value">
                    {formatScore(
                      recommendation.historical_opportunity_v3
                    )}
                  </div>
                </div>

                <div className="reasoning-item">
                  <div className="reasoning-item-label">
                    Evidence Strength
                  </div>

                  <div className="reasoning-item-value">
                    {formatPercentage(
                      recommendation.historical_evidence_strength_v3
                    )}
                  </div>
                </div>

                <div className="reasoning-item">
                  <div className="reasoning-item-label">
                    Evidence Coverage
                  </div>

                  <div className="reasoning-item-value">
                    {formatPercentage(
                      recommendation.historical_evidence_coverage_v3
                    )}
                  </div>
                </div>

                <div className="reasoning-item">
                  <div className="reasoning-item-label">
                    Current-World Relevance
                  </div>

                  <div className="reasoning-item-value">
                    {formatScore(
                      recommendation.current_world_relevance_v3
                    )}
                  </div>
                </div>

                <div className="reasoning-item">
                  <div className="reasoning-item-label">
                    Current Signal
                  </div>

                  <div className="reasoning-item-value">
                    {recommendation.current_signal_class_v1 ||
                      "NO SIGNAL"}
                  </div>
                </div>
              </div>

              <div className="reasoning-note">
                <strong>Decision:</strong>{" "}
                {recommendation.decision_v3 ||
                  "—"}
                <br />
                <strong>Reason:</strong>{" "}
                {recommendation.current_world_reason_v3 ||
                  "The recommendation is supported by the current production scoring and evidence fields."}
              </div>
            </div>
          </section>
        </main>

        <aside>
          <section className="detail-section">
            <div className="detail-section-header">
              <h2>Posting Recommendation</h2>
            </div>

            <div className="detail-section-body">
              <div
                className="platform-large"
                title={recommendation.platform}
              >
                <PlatformIcon
                  size={22}
                  strokeWidth={1.8}
                />
              </div>

              <div
                className="posting-list"
                style={{ marginTop: "16px" }}
              >
                <div className="posting-row">
                  <span className="posting-label">
                    Platform
                  </span>

                  <span className="posting-value">
                    {recommendation.platform || "—"}
                  </span>
                </div>

                <div className="posting-row">
                  <span className="posting-label">
                    Date
                  </span>

                  <span className="posting-value">
                    {recommendation.date || "—"}
                  </span>
                </div>

                <div className="posting-row">
                  <span className="posting-label">
                    Day
                  </span>

                  <span className="posting-value">
                    {recommendation.day || "—"}
                  </span>
                </div>

                <div className="posting-row">
                  <span className="posting-label">
                    Time
                  </span>

                  <span className="posting-value">
                    {formatHour(
                      recommendation.hour
                    )}
                  </span>
                </div>

                <div className="posting-row">
                  <span className="posting-label">
                    Format
                  </span>

                  <span className="posting-value">
                    <FormatIcon
                      size={13}
                      strokeWidth={1.8}
                    />{" "}
                    {recommendation.content_type ||
                      "—"}
                  </span>
                </div>
              </div>
            </div>
          </section>

          <section className="detail-section">
            <div className="detail-section-header">
              <h2>Evidence</h2>
            </div>

            <div className="detail-section-body">
              <div className="posting-list">
                <div className="posting-row">
                  <span className="posting-label">
                    Evidence strength
                  </span>

                  <span className="posting-value">
                    {formatPercentage(
                      recommendation.historical_evidence_strength_v3
                    )}
                  </span>
                </div>

                <div className="posting-row">
                  <span className="posting-label">
                    Evidence coverage
                  </span>

                  <span className="posting-value">
                    {formatPercentage(
                      recommendation.historical_evidence_coverage_v3
                    )}
                  </span>
                </div>

                <div className="posting-row">
                  <span className="posting-label">
                    Current relevance
                  </span>

                  <span className="posting-value">
                    {formatScore(
                      recommendation.current_world_relevance_v3
                    )}
                  </span>
                </div>

                <div className="posting-row">
                  <span className="posting-label">
                    Signal
                  </span>

                  <span
                    className={`detail-signal ${getSignalClass(
                      recommendation.current_signal_class_v1
                    )}`}
                  >
                    {recommendation.current_signal_class_v1 ||
                      "NO SIGNAL"}
                  </span>
                </div>
              </div>
            </div>
          </section>

          <section className="detail-section">
            <div className="detail-section-header">
              <h2>Production State</h2>
            </div>

            <div className="detail-section-body">
              <div className="posting-list">
                <div className="posting-row">
                  <span className="posting-label">
                    Production readiness
                  </span>

                  <span className="posting-value">
                    {isReady ? (
                      <CheckCircle2
                        size={15}
                        strokeWidth={1.8}
                      />
                    ) : (
                      <ShieldCheck
                        size={15}
                        strokeWidth={1.8}
                      />
                    )}{" "}
                    {readiness}
                  </span>
                </div>

                <div className="posting-row">
                  <span className="posting-label">
                    QA status
                  </span>

                  <span className="posting-value">
                    {qaStatus}
                  </span>
                </div>

                <div className="posting-row">
                  <span className="posting-label">
                    Manual review
                  </span>

                  <span className="posting-value">
                    {recommendation.manual_review_required_v1 ||
                      "—"}
                  </span>
                </div>

                <div className="posting-row">
                  <span className="posting-label">
                    Approval ID
                  </span>

                  <span className="posting-value">
                    {recommendation.approval_id_v1 ||
                      "—"}
                  </span>
                </div>
              </div>
            </div>
          </section>

          <section className="detail-section">
            <div className="detail-section-body">
              <div
                className="posting-row"
                style={{
                  borderBottom: "0",
                  paddingBottom: "0",
                }}
              >
                <Sparkles
                  size={18}
                  strokeWidth={1.8}
                />

                <span className="posting-value">
                  Production ID:{" "}
                  {recommendation.production_id_v1 ||
                    "—"}
                </span>
              </div>

              <div
                style={{
                  marginTop: "10px",
                  display: "flex",
                  alignItems: "center",
                  gap: "7px",
                  color: "var(--teal)",
                  fontSize: "10px",
                }}
              >
                <TrendingUp
                  size={13}
                  strokeWidth={1.8}
                />

                Cell 83 production recommendation
              </div>
            </div>
          </section>
        </aside>
      </div>
    </section>
  );
}