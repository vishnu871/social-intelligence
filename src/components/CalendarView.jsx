import {
  CalendarDays,
  Clock3,
  Image,
  MessageSquare,
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

function groupByDate(recommendations) {
  const groups = {};

  recommendations.forEach((recommendation) => {
    const date =
      recommendation.date || "Unscheduled";

    if (!groups[date]) {
      groups[date] = [];
    }

    groups[date].push(recommendation);
  });

  Object.values(groups).forEach((items) => {
    items.sort(
      (a, b) =>
        Number(a.hour || 0) - Number(b.hour || 0)
    );
  });

  return groups;
}

function formatDate(dateValue) {
  if (!dateValue || dateValue === "Unscheduled") {
    return "Unscheduled";
  }

  const date = new Date(`${dateValue}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return dateValue;
  }

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function CalendarView({
  recommendations,
  onOpen,
}) {
  const grouped = groupByDate(recommendations);
  const dates = Object.keys(grouped);

  if (!dates.length) {
    return (
      <div className="empty-state">
        <strong>No recommendations found</strong>
        <p>
          Load a Cell 83 production CSV to populate
          the weekly calendar.
        </p>
      </div>
    );
  }

  return (
    <div className="calendar-grid">
      {dates.map((date) => {
        const posts = grouped[date];
        const firstPost = posts[0];

        return (
          <section
            className="calendar-day"
            key={date}
          >
            <div className="calendar-day-header">
              <div className="calendar-day-title">
                <div className="calendar-day-icon">
                  <CalendarDays
                    size={17}
                    strokeWidth={1.8}
                  />
                </div>

                <div>
                  <div className="calendar-day-name">
                    {firstPost?.day || formatDate(date)}
                  </div>

                  <div className="calendar-date-small">
                    {formatDate(date)}
                  </div>
                </div>
              </div>

              <div className="calendar-day-count">
                {posts.length} post
                {posts.length === 1 ? "" : "s"}
              </div>
            </div>

            <div className="calendar-posts">
              {posts.map((post) => {
                const FormatIcon =
                  getFormatIcon(post.content_type);

                return (
                  <article
                    className="calendar-post"
                    key={
                      post.production_id_v1 ||
                      post.recommendation_rank_v1
                    }
                  >
                    <div className="calendar-post-top">
                      <div className="calendar-rank">
                        #{post.recommendation_rank_v1}
                      </div>

                      <div className="calendar-score">
                        {Number(
                          post.final_opportunity_score_v3 ||
                            0
                        ).toFixed(2)}
                      </div>
                    </div>

                    <div>
                      <div className="calendar-post-theme">
                        {post.theme || "Unclassified"}
                      </div>

                      <div className="calendar-post-meta">
                        <span>
                          {post.platform || "—"}
                        </span>

                        <span>•</span>

                        <Clock3
                          size={11}
                          strokeWidth={1.8}
                        />

                        <span>
                          {formatHour(post.hour)}
                        </span>
                      </div>

                      <div className="calendar-post-format">
                        <FormatIcon
                          size={12}
                          strokeWidth={1.8}
                        />{" "}
                        {post.content_type ||
                          "Content"}
                      </div>
                    </div>

                    <div className="calendar-post-footer">
                      <div
                        className={`signal-badge ${getSignalClass(
                          post.current_signal_class_v1
                        )}`}
                      >
                        {post.current_signal_class_v1 ||
                          "NO SIGNAL"}
                      </div>

                      <button
                        type="button"
                        className="calendar-open"
                        onClick={() => onOpen(post)}
                      >
                        View
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}