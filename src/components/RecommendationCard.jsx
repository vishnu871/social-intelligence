import {
  ArrowUpRight,
  CalendarDays,
  Clock3,
  Image,
  MessageSquare,
  Video,
} from "lucide-react";

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

export default function RecommendationCard({
  recommendation = null,
  onOpen = () => {},
}) {
  /*
   * Defensive guard:
   * The dashboard should never crash if a recommendation
   * is temporarily missing or undefined.
   */
  if (!recommendation) {
    return null;
  }

  const PlatformIcon = getPlatformIcon(
    recommendation.platform
  );

  const contentType = String(
    recommendation.content_type || "Content"
  );

  const contentTypeLower = contentType.toLowerCase();

  const FormatIcon =
    contentTypeLower.includes("reel") ||
    contentTypeLower.includes("video")
      ? Video
      : contentTypeLower.includes("image") ||
          contentTypeLower.includes("carousel")
        ? Image
        : MessageSquare;

  const score = Number(
    recommendation.final_opportunity_score_v3
  );

  return (
    <article className="recommendation-card">
      <div className="recommendation-card-header">
        <div className="rank-label">
          Rank #
          {recommendation.recommendation_rank_v1 ?? "—"}
        </div>

        <div className="score-pill">
          {Number.isFinite(score)
            ? score.toFixed(2)
            : "—"}
        </div>
      </div>

      <div className="recommendation-theme">
        {recommendation.theme || "Unclassified"}
      </div>

      <div className="recommendation-hook">
        {recommendation.hook_v1 ||
          "No hook available."}
      </div>

      <div className="recommendation-card-footer">
        <div className="recommendation-meta">
          <PlatformIcon
            size={14}
            strokeWidth={1.8}
          />

          <span>
            {recommendation.platform || "—"}
          </span>

          <span className="meta-divider">
            •
          </span>

          <Clock3
            size={13}
            strokeWidth={1.8}
          />

          <span>
            {formatHour(recommendation.hour)}
          </span>

          <span className="meta-divider">
            •
          </span>

          <FormatIcon
            size={13}
            strokeWidth={1.8}
          />

          <span>{contentType}</span>
        </div>

        <div
          className={`signal-badge ${getSignalClass(
            recommendation.current_signal_class_v1
          )}`}
        >
          {recommendation.current_signal_class_v1 ||
            "NO SIGNAL"}
        </div>

        <button
          type="button"
          className="open-link"
          onClick={() => onOpen(recommendation)}
        >
          Open
          <ArrowUpRight
            size={13}
            strokeWidth={2}
          />
        </button>
      </div>
    </article>
  );
}