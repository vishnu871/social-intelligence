import React from "react";
import {
  CalendarDays,
  Clock3,
  Image as ImageIcon,
  MessageSquare,
  ChevronRight,
} from "lucide-react";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

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

function getDay(post) {
  if (post.day) {
    const value =
      String(post.day)
        .trim()
        .toLowerCase();

    const match = DAYS.find(
      (day) =>
        day.toLowerCase() ===
        value
    );

    if (match) {
      return match;
    }
  }

  if (post.date) {
    const date = new Date(
      `${post.date}T12:00:00`
    );

    if (
      !Number.isNaN(
        date.getTime()
      )
    ) {
      return date.toLocaleDateString(
        "en-US",
        {
          weekday: "long",
        }
      );
    }
  }

  return "";
}

function getContentIcon(
  contentType
) {
  const value = String(
    contentType || ""
  ).toLowerCase();

  if (
    value.includes("image") ||
    value.includes("carousel")
  ) {
    return (
      <ImageIcon
        size={14}
        strokeWidth={1.8}
      />
    );
  }

  return (
    <MessageSquare
      size={14}
      strokeWidth={1.8}
    />
  );
}

function getDateRange(
  recommendations
) {
  const dates =
    recommendations
      .map((item) => item.date)
      .filter(Boolean)
      .sort();

  if (!dates.length) {
    return null;
  }

  return {
    start: dates[0],
    end: dates[dates.length - 1],
  };
}

function formatFullDate(dateValue) {
  const date = new Date(
    `${dateValue}T12:00:00`
  );

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return dateValue;
  }

  return date.toLocaleDateString(
    "en-IN",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );
}

function CalendarPost({
  post,
  onSelect,
}) {
  const score = Number(
    post.final_opportunity_score_v3
  );

  return (
    <button
      type="button"
      className="weekly-calendar-post"
      onClick={() =>
        onSelect?.(post)
      }
    >
      <div className="weekly-calendar-post-top">
        <span className="weekly-calendar-rank">
          #
          {
            post.recommendation_rank_v1 ??
              "—"
          }
        </span>

        <span className="weekly-calendar-score">
          {Number.isFinite(score)
            ? score.toFixed(2)
            : "—"}
        </span>
      </div>

      <div className="weekly-calendar-theme">
        {post.theme ||
          "Unspecified theme"}
      </div>

      <div className="weekly-calendar-detail">
        <Clock3
          size={14}
          strokeWidth={1.8}
        />

        <span>
          {formatTime(post.hour)}
        </span>
      </div>

      <div className="weekly-calendar-detail">
        {getContentIcon(
          post.content_type
        )}

        <span>
          {post.content_type ||
            "Content"}
        </span>
      </div>

      <div className="weekly-calendar-platform">
        {post.platform ||
          "Platform"}
      </div>

      <div className="weekly-calendar-card-action">
        <span>
          View recommendation
        </span>

        <ChevronRight
          size={15}
          strokeWidth={1.8}
        />
      </div>
    </button>
  );
}

export default function CalendarView({
  recommendations = [],
  onSelectPost,
}) {
  const dateRange =
    getDateRange(
      recommendations
    );

  return (
    <section className="weekly-calendar-page">
      <div className="weekly-calendar-header">
        <div>
          <div className="section-eyebrow">
            PLANNING WINDOW
          </div>

          <h1>
            Weekly calendar
          </h1>

          <p>
            Current recommendations
            arranged across the
            publishing week.
          </p>
        </div>

        <div className="weekly-calendar-summary">
          <div className="weekly-calendar-summary-item">
            <CalendarDays
              size={18}
              strokeWidth={1.8}
            />

            <div>
              <strong>
                {
                  recommendations.length
                }
              </strong>

              <span>
                recommendations
              </span>
            </div>
          </div>

          <div className="weekly-calendar-summary-divider" />

          <div className="weekly-calendar-summary-item">
            <div>
              <strong>
                {dateRange
                  ? `${new Date(
                      `${dateRange.start}T12:00:00`
                    ).getDate()}–${new Date(
                      `${dateRange.end}T12:00:00`
                    ).getDate()}`
                  : "—"}
              </strong>

              <span>
                {dateRange
                  ? new Date(
                      `${dateRange.start}T12:00:00`
                    ).toLocaleDateString(
                      "en-IN",
                      {
                        month: "long",
                        year: "numeric",
                      }
                    )
                  : "Planning window"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {dateRange && (
        <div className="weekly-calendar-date-range">
          {formatFullDate(
            dateRange.start
          )}
          {" — "}
          {formatFullDate(
            dateRange.end
          )}
        </div>
      )}

      <div className="weekly-calendar-grid">
        {DAYS.map((day) => {
          const posts =
            recommendations
              .filter(
                (post) =>
                  getDay(post) === day
              )
              .sort(
                (a, b) =>
                  Number(
                    a.recommendation_rank_v1 ??
                      999
                  ) -
                  Number(
                    b.recommendation_rank_v1 ??
                      999
                  )
              );

          return (
            <article
              key={day}
              className="weekly-calendar-day"
            >
              <div className="weekly-calendar-day-header">
                <CalendarDays
                  size={17}
                  strokeWidth={1.8}
                />

                <div>
                  <h2>
                    {day}
                  </h2>

                  <span>
                    {posts.length}{" "}
                    {posts.length ===
                    1
                      ? "post"
                      : "posts"}
                  </span>
                </div>
              </div>

              <div className="weekly-calendar-posts">
                {posts.length ? (
                  posts.map(
                    (post, index) => (
                      <CalendarPost
                        key={
                          post.production_id_v1 ||
                          `${day}-${index}`
                        }
                        post={post}
                        onSelect={
                          onSelectPost
                        }
                      />
                    )
                  )
                ) : (
                  <div className="weekly-calendar-empty">
                    No recommendation
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}