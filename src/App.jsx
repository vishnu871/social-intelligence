import React, { useMemo, useState } from "react";

import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import MetricCard from "./components/MetricCard";
import RecommendationCard from "./components/RecommendationCard";
import CalendarView from "./components/CalendarView";
import PostDetail from "./components/PostDetail";
import IntelligenceChat from "./components/IntelligenceChat";

import { createRemainingRecommendations } from "./data/demoData";

function toNumber(value, fallback = 0) {
  const number = Number(value);

  return Number.isFinite(number) ? number : fallback;
}

function getField(row, names, fallback = "") {
  for (const name of names) {
    if (
      row[name] !== undefined &&
      row[name] !== null &&
      String(row[name]).trim() !== ""
    ) {
      return row[name];
    }
  }

  return fallback;
}

function parseCSVLine(line) {
  const result = [];
  let current = "";
  let insideQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];

    if (character === '"') {
      if (
        insideQuotes &&
        line[index + 1] === '"'
      ) {
        current += '"';
        index += 1;
      } else {
        insideQuotes = !insideQuotes;
      }

      continue;
    }

    if (character === "," && !insideQuotes) {
      result.push(current);
      current = "";
      continue;
    }

    current += character;
  }

  result.push(current);

  return result;
}

function parseCSV(text) {
  const lines = text
    .replace(/\r/g, "")
    .split("\n")
    .filter((line) => line.trim());

  if (lines.length < 2) {
    return [];
  }

  const headers = parseCSVLine(lines[0]).map(
    (header) => header.trim()
  );

  return lines.slice(1).map((line) => {
    const values = parseCSVLine(line);
    const row = {};

    headers.forEach((header, index) => {
      row[header] = values[index] || "";
    });

    return row;
  });
}

function normalizeRecommendation(row, index) {
  const platform = getField(
    row,
    ["platform", "Platform"],
    "Facebook"
  );

  const contentType = getField(
    row,
    ["content_type", "Content Type"],
    "Single Image"
  );

  const theme = getField(
    row,
    ["theme", "Theme"],
    "Social Intelligence"
  );

  const date = getField(
    row,
    ["date", "Date"],
    "2026-09-14"
  );

  const numericHour = toNumber(
    getField(row, ["hour", "Hour"], 13),
    13
  );

  const parsedDate = new Date(`${date}T12:00:00`);

  const day =
    parsedDate.toString() !== "Invalid Date"
      ? parsedDate.toLocaleDateString("en-US", {
          weekday: "long",
        })
      : getField(row, ["day", "Day"], "Monday");

  return {
    ...row,

    recommendation_rank_v1: toNumber(
      getField(
        row,
        [
          "recommendation_rank_v1",
          "recommendation_rank",
          "rank",
        ],
        index + 1
      ),
      index + 1
    ),

    production_id_v1: getField(
      row,
      ["production_id_v1", "production_id"],
      `CSV-${index + 1}`
    ),

    content_brief_id_v1: getField(
      row,
      ["content_brief_id_v1", "content_brief_id"],
      `CB-${index + 1}`
    ),

    approval_id_v1: getField(
      row,
      ["approval_id_v1", "approval_id"],
      `APR-${index + 1}`
    ),

    date,
    day,
    hour: numericHour,
    platform,
    content_type: contentType,
    theme,

    final_opportunity_score_v3: toNumber(
      getField(
        row,
        [
          "final_opportunity_score_v3",
          "final_score",
          "score",
        ],
        0
      )
    ),

    historical_opportunity_v3: toNumber(
      getField(
        row,
        ["historical_opportunity_v3"],
        0
      )
    ),

    historical_evidence_strength_v3: toNumber(
      getField(
        row,
        ["historical_evidence_strength_v3"],
        0
      )
    ),

    historical_evidence_coverage_v3: toNumber(
      getField(
        row,
        ["historical_evidence_coverage_v3"],
        0
      )
    ),

    current_signal_class_v1: getField(
      row,
      [
        "current_signal_class_v1",
        "current_signal_class_v3",
      ],
      "NO SIGNAL"
    ),

    current_world_relevance_v3: toNumber(
      getField(
        row,
        ["current_world_relevance_v3"],
        0
      )
    ),

    decision_v3: getField(
      row,
      ["decision_v3"],
      "SELECT"
    ),

    qa_status: getField(
      row,
      ["qa_status"],
      "UNKNOWN"
    ),

    manual_review_required_v1:
      String(
        getField(
          row,
          ["manual_review_required_v1"],
          "false"
        )
      ).toLowerCase() === "true",

    production_readiness_v1: getField(
      row,
      ["production_readiness_v1"],
      "REVIEW"
    ),

    hook_v1: getField(
      row,
      ["hook_v1", "hook", "title"],
      "Untitled recommendation"
    ),

    caption_v1: getField(
      row,
      ["caption_v1", "caption"],
      ""
    ),

    cta_v1: getField(
      row,
      ["cta_v1", "cta"],
      ""
    ),

    creative_direction_v1: getField(
      row,
      [
        "creative_direction_v1",
        "creative_direction",
      ],
      ""
    ),
  };
}

function Dashboard({
  recommendations,
  onOpen,
  onNavigate,
}) {
  const sorted = useMemo(
    () =>
      [...recommendations].sort(
        (a, b) =>
          Number(
            b.final_opportunity_score_v3 || 0
          ) -
          Number(
            a.final_opportunity_score_v3 || 0
          )
      ),
    [recommendations]
  );

  const themes = new Set(
    recommendations.map((item) => item.theme)
  );

  const platforms = new Set(
    recommendations.map((item) => item.platform)
  );

  const averageScore =
    recommendations.length > 0
      ? recommendations.reduce(
          (sum, item) =>
            sum +
            Number(
              item.final_opportunity_score_v3 || 0
            ),
          0
        ) / recommendations.length
      : 0;

  const dates = recommendations
    .map((item) => item.date)
    .filter(Boolean)
    .sort();

  const startDate = dates[0] || "—";
  const endDate =
    dates[dates.length - 1] || "—";

  return (
    <>
      <div className="dashboard-hero">
        <div>
          <div className="page-kicker">
            ZUVA SOCIAL INTELLIGENCE
          </div>

          <h1>Good morning, Zuva.</h1>

          <p>
            Your current social intelligence portfolio
            is ready for review.
          </p>

          <div className="date-range">
            {startDate} — {endDate}
          </div>
        </div>

        <div className="hero-actions">
          <button
            type="button"
            className="secondary-button"
            onClick={() => onNavigate("calendar")}
          >
            Weekly calendar
          </button>

          <button
            type="button"
            className="primary-button"
            onClick={() => onNavigate("approval")}
          >
            Review portfolio
          </button>
        </div>
      </div>

      <div className="metrics-grid">
        <MetricCard
          label="Recommended posts"
          value={recommendations.length}
          description="Current intelligence portfolio"
          accent="plum"
        />

        <MetricCard
          label="Average opportunity"
          value={averageScore.toFixed(2)}
          description="Final opportunity score"
          accent="teal"
        />

        <MetricCard
          label="Themes"
          value={themes.size}
          description="Strategic diversity"
          accent="yellow"
        />

        <MetricCard
          label="Platforms"
          value={platforms.size}
          description="Active publishing channels"
          accent="terracotta"
        />
      </div>

      <div className="dashboard-grid">
        <section className="section recommendations-section">
          <div className="section-header">
            <div>
              <h2 className="section-title">
                Top recommendations
              </h2>

              <p className="section-subtitle">
                Highest opportunity recommendations
              </p>
            </div>

            <button
              type="button"
              className="view-all"
              onClick={() => onNavigate("calendar")}
            >
              View all
            </button>
          </div>

          <div className="recommendations-grid">
            {sorted.slice(0, 6).map((item) => (
              <RecommendationCard
                key={
                  item.production_id_v1 ||
                  item.recommendation_rank_v1
                }
                recommendation={item}
                onOpen={onOpen}
              />
            ))}
          </div>
        </section>

        <aside className="dashboard-aside">
          <section className="intelligence-promo">
            <div className="promo-icon">
              ✦
            </div>

            <div className="promo-kicker">
              INTELLIGENCE
            </div>

            <h2>Ask anything.</h2>

            <p>
              Ask about content, trends, evidence,
              recommendations, platforms or strategy.
            </p>

            <button
              type="button"
              className="primary-button full-button"
              onClick={() =>
                onNavigate("intelligence")
              }
            >
              Ask Social Intelligence
            </button>
          </section>

          <section className="health-section">
            <div className="section-header compact">
              <div>
                <h2 className="section-title">
                  Intelligence health
                </h2>

                <p className="section-subtitle">
                  Evidence coverage
                </p>
              </div>
            </div>

            <div className="health-number">
              {recommendations.length
                ? Math.round(
                    (recommendations.reduce(
                      (sum, item) =>
                        sum +
                        Number(
                          item
                            .historical_evidence_coverage_v3 ||
                            0
                        ),
                      0
                    ) /
                      recommendations.length) *
                      100
                  )
                : 0}
              %
            </div>

            <p className="health-copy">
              Historical evidence coverage across the
              current portfolio.
            </p>
          </section>
        </aside>
      </div>
    </>
  );
}

function ApprovalPage({
  recommendations,
  onOpen,
}) {
  const reviewItems = recommendations.filter(
    (item) =>
      item.manual_review_required_v1 ||
      String(item.qa_status).toUpperCase() ===
        "NEEDS_REVIEW"
  );

  return (
    <div className="page-header">
      <div className="page-kicker">
        HUMAN APPROVAL
      </div>

      <h1>Review portfolio</h1>

      <p>
        Review recommendations that require human
        approval before publishing.
      </p>

      <div className="approval-summary">
        <strong>{reviewItems.length}</strong>
        <span>items requiring review</span>
      </div>

      <div className="approval-list">
        {reviewItems.map((item) => (
          <button
            type="button"
            className="approval-row"
            key={
              item.production_id_v1 ||
              item.recommendation_rank_v1
            }
            onClick={() => onOpen(item)}
          >
            <span className="approval-rank">
              #{item.recommendation_rank_v1}
            </span>

            <span className="approval-content">
              <strong>{item.hook_v1}</strong>

              <small>
                {item.theme} · {item.platform} ·{" "}
                {item.content_type}
              </small>
            </span>

            <span className="approval-status">
              {item.qa_status || "REVIEW"}
            </span>
          </button>
        ))}

        {reviewItems.length === 0 && (
          <div className="empty-state">
            <h3>Nothing needs review.</h3>
            <p>
              All currently loaded recommendations have
              passed the review gate.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function App() {
  const [recommendations, setRecommendations] =
    useState(() => createRemainingRecommendations());

  const [activePage, setActivePage] =
    useState("dashboard");

  const [selectedRecommendation, setSelectedRecommendation] =
    useState(null);

  const [search, setSearch] = useState("");

  const filteredRecommendations = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return recommendations;
    }

    return recommendations.filter((item) =>
      [
        item.theme,
        item.platform,
        item.content_type,
        item.day,
        item.date,
        item.hook_v1,
        item.caption_v1,
        item.current_signal_class_v1,
        item.production_readiness_v1,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(query)
    );
  }, [recommendations, search]);

  function openRecommendation(item) {
    setSelectedRecommendation(item);
    setActivePage("detail");
  }

  function handleNavigate(page) {
    setActivePage(page);

    if (page !== "detail") {
      setSelectedRecommendation(null);
    }
  }

  async function handleUpload(event) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      const text = await file.text();
      const rows = parseCSV(text);

      if (!rows.length) {
        window.alert(
          "The CSV file does not contain usable rows."
        );
        return;
      }

      const normalized = rows.map(
        normalizeRecommendation
      );

      setRecommendations(normalized);
      setSelectedRecommendation(null);
      setActivePage("dashboard");

      window.alert(
        `Loaded ${normalized.length} recommendations from the Cell 83 CSV.`
      );
    } catch (error) {
      console.error(error);

      window.alert(
        "Unable to read this CSV file."
      );
    }

    event.target.value = "";
  }

  let pageContent;

  if (activePage === "dashboard") {
    pageContent = (
      <Dashboard
        recommendations={filteredRecommendations}
        onOpen={openRecommendation}
        onNavigate={handleNavigate}
      />
    );
  } else if (activePage === "calendar") {
    pageContent = (
      <div className="page-header">
        <div className="page-kicker">
          PLANNING WINDOW
        </div>

        <h1>Weekly calendar</h1>

        <p>
          Current recommendations arranged across the
          publishing week.
        </p>

        <CalendarView
          recommendations={filteredRecommendations}
          onOpen={openRecommendation}
        />
      </div>
    );
  } else if (activePage === "intelligence") {
    pageContent = (
      <IntelligenceChat
        recommendations={recommendations}
      />
    );
  } else if (activePage === "approval") {
    pageContent = (
      <ApprovalPage
        recommendations={filteredRecommendations}
        onOpen={openRecommendation}
      />
    );
  } else if (activePage === "detail") {
    pageContent = (
      <PostDetail
        recommendation={selectedRecommendation}
        onBack={() => handleNavigate("dashboard")}
      />
    );
  }

  return (
    <div className="app-shell">
      <Sidebar
        activePage={activePage}
        onNavigate={handleNavigate}
      />

      <div className="main-area">
        <Topbar
          search={search}
          onSearchChange={setSearch}
          onUpload={handleUpload}
          title={
            activePage === "intelligence"
              ? "Ask Intelligence"
              : activePage === "calendar"
                ? "Weekly Calendar"
                : activePage === "approval"
                  ? "Approval"
                  : activePage === "detail"
                    ? "Recommendation"
                    : "Social Intelligence"
          }
        />

        <main className="page-content">
          {pageContent}
        </main>
      </div>
    </div>
  );
}