import React from "react";
import {
  CalendarDays,
  Clock3,
  Image as ImageIcon,
  MessageSquare,
  ChevronRight,
} from "lucide-react";

const DAY_ORDER = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

function formatTime(hour) {
  if (hour === null || hour === undefined || hour === "") {
    return "Time not set";
  }

  const numericHour = Number(hour);

  if (Number.isNaN(numericHour)) {
    return String(hour);
  }

  const period = numericHour >= 12 ? "PM" : "AM";
  const displayHour =
    numericHour % 12 === 0 ? 12 : numericHour % 12;

  return `${displayHour}:00 ${period}`;
}

function formatDate(dateValue) {
  if (!dateValue) {
    return "";
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return String(dateValue);
  }

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function getDayNumber(dateValue) {
  if (!dateValue) {
    return "";
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.getDate();
}

function getMonthYear(dateValue) {
  if (!dateValue) {
    return "";
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });
}

function getContentTypeIcon(contentType) {
  const value = String(contentType || "").toLowerCase();

  if (
    value.includes("image") ||
    value.includes("carousel")
  ) {
    return <ImageIcon size={15} strokeWidth={1.8} />;
  }

  return <MessageSquare size={15} strokeWidth={1.8} />;
}

function normalizeDay(day) {
  if (!day) {
    return "";
  }

  const value = String(day).trim().toLowerCase();

  return (
    DAY_ORDER.find(
      (item) => item.toLowerCase() === value
    ) || day
  );
}

function CalendarPost({ post, onSelect }) {
  return (
    <button
      type="button"
      className="weekly-calendar-post"
      onClick={() => onSelect?.(post)}
    >
      <div className="weekly-calendar-post-top">
        <span className="weekly-calendar-rank">
          #{post.recommendation_rank_v1 ?? post.recommendation_rank ?? "—"}
        </span>

        <span className="weekly-calendar-score">
          {post.final_opportunity_score_v3 !== undefined &&
          post.final_opportunity_score_v3 !== null
            ? Number(post.final_opportunity_score_v3).toFixed(2)
            : "—"}
        </span>
      </div>

      <div className="weekly-calendar-theme">
        {post.theme || "Unspecified theme"}
      </div>

      <div className="weekly-calendar-detail">
        <Clock3 size={15} strokeWidth={1.8} />
        <span>{formatTime(post.hour)}</span>
      </div>

      <div className="weekly-calendar-detail">
        {getContentTypeIcon(post.content_type)}
        <span>{post.content_type || "Content"}</span>
      </div>

      <div className="weekly-calendar-platform">
        {post.platform || "Platform"}
      </div>

      <div className="weekly-calendar-card-action">
        View recommendation
        <ChevronRight size={15} strokeWidth={1.8} />
      </div>
    </button>
  );
}

export default function CalendarView({
  recommendations = [],
  onSelectPost,
}) {
  const groupedDays = DAY_ORDER.map((day) => {
    const posts = recommendations
      .filter(
        (post) =>
          normalizeDay(post.day) === day
      )
      .sort((a, b) => {
        const rankA = Number(
          a.recommendation_rank_v1 ??
            a.recommendation_rank ??
            999
        );

        const rankB = Number(
          b.recommendation_rank_v1 ??
            b.recommendation_rank ??
            999
        );

        return rankA - rankB;
      });

    return {
      day,
      posts,
    };
  });

  const firstPost = recommendations[0];

  const startDate =
    recommendations.length > 0
      ? recommendations.reduce((earliest, post) => {
          if (!post.date) {
            return earliest;
          }

          if (!earliest) {
            return post.date;
          }

          return new Date(post.date) <
            new Date(earliest)
            ? post.date
            : earliest;
        }, null)
      : null;

  const endDate =
    recommendations.length > 0
      ? recommendations.reduce((latest, post) => {
          if (!post.date) {
            return latest;
          }

          if (!latest) {
            return post.date;
          }

          return new Date(post.date) >
            new Date(latest)
            ? post.date
            : latest;
        }, null)
      : null;

  return (
    <section className="weekly-calendar-page">
      <div className="weekly-calendar-header">
        <div>
          <div className="section-eyebrow">
            PLANNING WINDOW
          </div>

          <h1>Weekly calendar</h1>

          <p>
            Current recommendations arranged across
            the publishing week.
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
                {recommendations.length}
              </strong>

              <span>recommendations</span>
            </div>
          </div>

          <div className="weekly-calendar-summary-divider" />

          <div className="weekly-calendar-summary-item">
            <div>
              <strong>
                {startDate
                  ? getDayNumber(startDate)
                  : "—"}
                {startDate && endDate
                  ? `–${getDayNumber(endDate)}`
                  : ""}
              </strong>

              <span>
                {startDate
                  ? getMonthYear(startDate)
                  : "Planning window"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {firstPost && (
        <div className="weekly-calendar-date-range">
          {startDate && endDate
            ? `${formatDate(startDate)} — ${formatDate(
                endDate
              )}`
            : "Current recommendation window"}
        </div>
      )}

      <div className="weekly-calendar-grid">
        {groupedDays.map(({ day, posts }) => (
          <article
            key={day}
            className="weekly-calendar-day"
          >
            <div className="weekly-calendar-day-header">
              <div className="weekly-calendar-day-icon">
                <CalendarDays
                  size={17}
                  strokeWidth={1.8}
                />
              </div>

              <div>
                <h2>{day}</h2>

                <span>
                  {posts.length}{" "}
                  {posts.length === 1
                    ? "post"
                    : "posts"}
                </span>
              </div>
            </div>

            <div className="weekly-calendar-posts">
              {posts.length > 0 ? (
                posts.map((post, index) => (
                  <CalendarPost
                    key={
                      post.production_id_v1 ||
                      post.production_id ||
                      `${day}-${index}`
                    }
                    post={post}
                    onSelect={onSelectPost}
                  />
                ))
              ) : (
                <div className="weekly-calendar-empty">
                  No recommendation
                </div>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}