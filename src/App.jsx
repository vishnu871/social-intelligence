import { useMemo, useState } from "react";
import {
  ArrowUpRight,
  CheckCircle2,
  ChevronRight,
  Database,
  FileCheck2,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from "lucide-react";

import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import MetricCard from "./components/MetricCard";
import RecommendationCard from "./components/RecommendationCard";
import CalendarView from "./components/CalendarView";
import PostDetail from "./components/PostDetail";
import IntelligenceChat from "./components/IntelligenceChat";
import { createRemainingRecommendations } from "./data/demoData";

const INITIAL_DATA = createRemainingRecommendations();

function normalize(value) {
  return String(value ?? "").trim().toLowerCase();
}

function toNumber(value, fallback = 0) {
  const number = Number(value);

  return Number.isFinite(number) ? number : fallback;
}

function parseCSVLine(line) {
  const values = [];
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
      values.push(current);
      current = "";
      continue;
    }

    current += character;
  }

  values.push(current);

  return values;
}

function parseCSV(text) {
  const lines = text
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .split("\n")
    .filter((line) => line.trim() !== "");

  if (!lines.length) {
    return [];
  }

  const headers = parseCSVLine(lines[0]).map((header) =>
    header
      .replace(/^\uFEFF/, "")
      .trim()
  );

  return lines.slice(1).map((line) => {
    const values = parseCSVLine(line);
    const row = {};

    headers.forEach((header, index) => {
      row[header] = values[index] ?? "";
    });

    return row;
  });
}

function getField(row, names, fallback = "") {
  for (const name of names) {
    if (
      row[name] !== undefined &&
      row[name] !== null &&
      row[name] !== ""
    ) {
      return row[name];
    }
  }

  return fallback;
}

function normalizeRecommendation(row, index) {
  return {
    ...row,

    recommendation_rank_v1: toNumber(
      getField(row, [
        "recommendation_rank_v1",
        "recommendation_rank",
        "rank",
      ], index + 1)
    ),

    production_id_v1: getField(row, [
      "production_id_v1",
      "production_id",
    ], `ZL-PROD-${String(index + 1).padStart(3, "0")}`),

    content_brief_id_v1: getField(row, [
      "content_brief_id_v1",
      "content_brief_id",
    ]),

    approval_id_v1: getField(row, [
      "approval_id_v1",
      "approval_id",
    ]),

    date: getField(row, ["date"]),

    day: getField(row, ["day"]),

    hour: getField(row, [
      "hour",
      "posting_hour",
    ]),

    platform: getField(row, [
      "platform",
    ], "Unknown"),

    content_type: getField(row, [
      "content_type",
      "format",
    ], "Content"),

    theme: getField(row, [
      "theme",
    ], "Unclassified"),

    final_opportunity_score_v3: toNumber(
      getField(row, [
        "final_opportunity_score_v3",
        "final_opportunity_score",
      ])
    ),

    historical_opportunity_v3: toNumber(
      getField(row, [
        "historical_opportunity_v3",
        "historical_opportunity",
      ])
    ),

    historical_evidence_strength_v3: toNumber(
      getField(row, [
        "historical_evidence_strength_v3",
        "historical_evidence_strength",
      ])
    ),

    historical_evidence_coverage_v3: toNumber(
      getField(row, [
        "historical_evidence_coverage_v3",
        "historical_evidence_coverage",
      ])
    ),

    current_signal_class_v1: getField(row, [
      "current_signal_class_v1",
      "current_signal_class",
      "current_signal",
    ], "NO SIGNAL"),

    current_world_relevance_v3: toNumber(
      getField(row, [
        "current_world_relevance_v3",
        "current_world_relevance",
      ])
    ),

    current_world_reason_v3: getField(row, [
      "current_world_reason_v3",
      "current_world_reason",
    ]),

    decision_v3: getField(row, [
      "decision_v3",
      "decision",
    ]),

    qa_status: getField(row, [
      "qa_status",
    ], "—"),

    manual_review_required_v1: getField(row, [
      "manual_review_required_v1",
      "manual_review_required",
    ], "—"),

    production_readiness_v1: getField(row, [
      "production_readiness_v1",
      "production_readiness",
    ], "—"),

    hook_v1: getField(row, [
      "hook_v1",
      "hook",
    ]),

    caption_v1: getField(row, [
      "caption_v1",
      "caption",
    ]),

    cta_v1: getField(row, [
      "cta_v1",
      "cta",
    ]),

    creative_direction_v1: getField(row, [
      "creative_direction_v1",
      "creative_direction",
    ]),
  };
}

function getReviewRequired(item) {
  return (
    normalize(item.manual_review_required_v1) === "yes" ||
    normalize(item.manual_review_required_v1) === "true" ||
    normalize(item.qa_status) === "needs_review"
  );
}

function getPositiveSignal(item) {
  const signal = normalize(
    item.current_signal_class_v1
  );

  return (
    signal.includes("positive") ||
    signal.includes("opportunity") ||
    signal.includes("strong")
  );
}

function getDateRange(recommendations) {
  const dates = recommendations
    .map((item) => item.date)
    .filter(Boolean)
    .sort();

  if (!dates.length) {
    return "Current recommendation cycle";
  }

  if (dates.length === 1) {
    return dates[0];
  }

  return `${dates[0]} — ${dates[dates.length - 1]}`;
}

function Dashboard({
  recommendations,
  onOpen,
  setActivePage,
}) {
  const metrics = useMemo(() => {
    const scores = recommendations
      .map((item) =>
        toNumber(item.final_opportunity_score_v3)
      )
      .filter((value) => value > 0);

    const evidence = recommendations
      .map((item) =>
        toNumber(
          item.historical_evidence_strength_v3
        )
      )
      .filter((value) => value >= 0);

    const coverage = recommendations
      .map((item) =>
        toNumber(
          item.historical_evidence_coverage_v3
        )
      )
      .filter((value) => value >= 0);

    const themes = new Set(
      recommendations
        .map((item) => item.theme)
        .filter(Boolean)
    );

    const platforms = new Set(
      recommendations
        .map((item) => item.platform)
        .filter(Boolean)
    );

    const averageScore =
      scores.length > 0
        ? scores.reduce(
            (sum, value) => sum + value,
            0
          ) / scores.length
        : 0;

    const averageEvidence =
      evidence.length > 0
        ? evidence.reduce(
            (sum, value) => sum + value,
            0
          ) / evidence.length
        : 0;

    const averageCoverage =
      coverage.length > 0
        ? coverage.reduce(
            (sum, value) => sum + value,
            0
          ) / coverage.length
        : 0;

    const reviewCount =
      recommendations.filter(getReviewRequired)
        .length;

    const positiveCount =
      recommendations.filter(getPositiveSignal)
        .length;

    return {
      count: recommendations.length,
      averageScore,
      themes: themes.size,
      platforms: platforms.size,
      averageEvidence,
      averageCoverage,
      reviewCount,
      positiveCount,
    };
  }, [recommendations]);

  const topRecommendations = useMemo(
    () =>
      [...recommendations]
        .sort(
          (a, b) =>
            toNumber(
              b.final_opportunity_score_v3
            ) -
            toNumber(
              a.final_opportunity_score_v3
            )
        )
        .slice(0, 6),
    [recommendations]
  );

  const themeSummary = useMemo(() => {
    const groups = {};

    recommendations.forEach((item) => {
      const theme =
        item.theme || "Unclassified";

      if (!groups[theme]) {
        groups[theme] = {
          theme,
          count: 0,
          scores: [],
        };
      }

      groups[theme].count += 1;
      groups[theme].scores.push(
        toNumber(
          item.final_opportunity_score_v3
        )
      );
    });

    return Object.values(groups)
      .map((group) => ({
        ...group,
        average:
          group.scores.length > 0
            ? group.scores.reduce(
                (sum, value) =>
                  sum + value,
                0
              ) / group.scores.length
            : 0,
      }))
      .sort(
        (a, b) => b.average - a.average
      )
      .slice(0, 5);
  }, [recommendations]);

  const signalSummary = useMemo(() => {
    const groups = {};

    recommendations.forEach((item) => {
      const signal =
        item.current_signal_class_v1 ||
        "NO SIGNAL";

      groups[signal] =
        (groups[signal] || 0) + 1;
    });

    return Object.entries(groups)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4);
  }, [recommendations]);

  return (
    <div className="dashboard-page">
      <header className="page-header">
        <div>
          <div className="eyebrow">
            ZUVA SOCIAL INTELLIGENCE
          </div>

          <h1>
            Good morning, Zuva.
          </h1>

          <p>
            Your current social intelligence
            portfolio is ready for review.
          </p>

          <div className="dashboard-date">
            {getDateRange(recommendations)}
          </div>
        </div>

        <div className="dashboard-header-actions">
          <button
            type="button"
            className="secondary-button"
            onClick={() =>
              setActivePage("calendar")
            }
          >
            Weekly calendar
          </button>

          <button
            type="button"
            className="primary-button"
            onClick={() =>
              setActivePage("approval")
            }
          >
            Review portfolio
          </button>
        </div>
      </header>

      <section className="metric-grid">
        <MetricCard
          label="Recommended posts"
          value={metrics.count}
          detail="Current intelligence portfolio"
          accent="purple"
        />

        <MetricCard
          label="Average opportunity"
          value={metrics.averageScore.toFixed(2)}
          detail="Final opportunity score"
          accent="teal"
        />

        <MetricCard
          label="Themes"
          value={metrics.themes}
          detail="Strategic diversity"
          accent="gold"
        />

        <MetricCard
          label="Platforms"
          value={metrics.platforms}
          detail="Active publishing channels"
          accent="terracotta"
        />
      </section>

      <section className="dashboard-main-grid">
        <div className="dashboard-primary">
          <div className="panel recommendations-panel">
            <div className="panel-header">
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
                className="panel-action"
                onClick={() =>
                  setActivePage("calendar")
                }
              >
                View all
                <ArrowUpRight
                  size={13}
                />
              </button>
            </div>

            <div className="panel-body">
              <div className="recommendation-list">
                {topRecommendations.map(
                  (recommendation) => (
                    <RecommendationCard
                      key={
                        recommendation.production_id_v1 ||
                        recommendation.recommendation_rank_v1
                      }
                      recommendation={
                        recommendation
                      }
                      onOpen={onOpen}
                    />
                  )
                )}
              </div>
            </div>
          </div>
        </div>

        <aside className="dashboard-secondary">
          <div className="panel intelligence-panel">
            <div className="panel-header">
              <div className="panel-icon gold">
                <Sparkles
                  size={17}
                />
              </div>

              <div>
                <h2 className="section-title">
                  Intelligence
                </h2>

                <p className="section-subtitle">
                  Ask about this portfolio
                </p>
              </div>
            </div>

            <div className="panel-body intelligence-card-body">
              <p>
                Ask about posting times,
                recommendation reasoning,
                evidence, platforms or
                themes.
              </p>

              <button
                type="button"
                className="intelligence-cta"
                onClick={() =>
                  setActivePage(
                    "intelligence"
                  )
                }
              >
                <MessageCircle
                  size={15}
                />

                Ask Social Intelligence

                <ArrowUpRight
                  size={13}
                />
              </button>
            </div>
          </div>

          <div className="panel">
            <div className="panel-header">
              <div>
                <h2 className="section-title">
                  Intelligence health
                </h2>

                <p className="section-subtitle">
                  Evidence supporting the portfolio
                </p>
              </div>

              <ShieldCheck
                size={18}
              />
            </div>

            <div className="panel-body">
              <div className="health-list">
                <div className="health-item">
                  <div className="health-item-label">
                    <span>
                      Evidence strength
                    </span>

                    <strong className="health-item-value">
                      {(
                        metrics.averageEvidence *
                        100
                      ).toFixed(1)}
                      %
                    </strong>
                  </div>

                  <div className="health-bar">
                    <div
                      className="health-bar-fill"
                      style={{
                        width: `${Math.min(
                          100,
                          metrics.averageEvidence *
                            100
                        )}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="health-item">
                  <div className="health-item-label">
                    <span>
                      Evidence coverage
                    </span>

                    <strong className="health-item-value">
                      {(
                        metrics.averageCoverage *
                        100
                      ).toFixed(1)}
                      %
                    </strong>
                  </div>

                  <div className="health-bar">
                    <div
                      className="health-bar-fill"
                      style={{
                        width: `${Math.min(
                          100,
                          metrics.averageCoverage *
                            100
                        )}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="health-item">
                  <div className="health-item-label">
                    <span>
                      Human review
                    </span>

                    <strong className="health-item-value">
                      {metrics.reviewCount}
                    </strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </section>

      <section className="dashboard-bottom-grid">
        <div className="panel">
          <div className="panel-header">
            <div>
              <h2 className="section-title">
                Review queue
              </h2>

              <p className="section-subtitle">
                Human attention required
              </p>
            </div>

            <FileCheck2
              size={18}
            />
          </div>

          <div className="panel-body">
            <div className="queue-overview">
              <div>
                <div className="queue-count">
                  {metrics.reviewCount}
                </div>

                <div className="queue-label">
                  review required
                </div>
              </div>

              <div>
                <div className="queue-count teal-text">
                  {metrics.count -
                    metrics.reviewCount}
                </div>

                <div className="queue-label">
                  currently ready
                </div>
              </div>
            </div>

            <button
              type="button"
              className="text-action"
              onClick={() =>
                setActivePage("approval")
              }
            >
              Open approval queue
              <ChevronRight
                size={14}
              />
            </button>
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <div>
              <h2 className="section-title">
                Current-world signals
              </h2>

              <p className="section-subtitle">
                Signals in this portfolio
              </p>
            </div>

            <TrendingUp
              size={18}
            />
          </div>

          <div className="panel-body">
            <div className="signal-summary">
              {signalSummary.map(
                ([signal, count]) => (
                  <div
                    className="signal-summary-item"
                    key={signal}
                  >
                    <span className="signal-summary-label">
                      {signal}
                    </span>

                    <span className="signal-summary-value">
                      {count}
                    </span>
                  </div>
                )
              )}
            </div>
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <div>
              <h2 className="section-title">
                Theme distribution
              </h2>

              <p className="section-subtitle">
                Highest average opportunities
              </p>
            </div>

            <Database
              size={18}
            />
          </div>

          <div className="panel-body">
            <div className="theme-summary">
              {themeSummary.map(
                (item, index) => (
                  <div
                    className="theme-summary-row"
                    key={item.theme}
                  >
                    <div className="theme-rank">
                      0{index + 1}
                    </div>

                    <div className="theme-summary-main">
                      <strong>
                        {item.theme}
                      </strong>

                      <span>
                        {item.count} post
                        {item.count === 1
                          ? ""
                          : "s"}
                      </span>
                    </div>

                    <div className="theme-score">
                      {item.average.toFixed(
                        2
                      )}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="dashboard-footer-strip">
        <div>
          <CheckCircle2
            size={15}
          />

          <span>
            Intelligence engine connected
          </span>
        </div>

        <span>
          Cell 83 production data
        </span>
      </div>
    </div>
  );
}

function ApprovalPage({
  recommendations,
  onOpen,
}) {
  const reviewItems =
    recommendations.filter(
      getReviewRequired
    );

  const readyItems =
    recommendations.filter(
      (item) => !getReviewRequired(item)
    );

  return (
    <div className="approval-page">
      <header className="page-header">
        <div>
          <div className="eyebrow">
            GOVERNANCE
          </div>

          <h1>
            Approval queue
          </h1>

          <p>
            Human review remains the final
            publishing gate.
          </p>
        </div>
      </header>

      <div className="approval-summary">
        <div className="approval-summary-card">
          <div className="approval-summary-label">
            Total
          </div>

          <div className="approval-summary-value">
            {recommendations.length}
          </div>
        </div>

        <div className="approval-summary-card">
          <div className="approval-summary-label">
            Review required
          </div>

          <div className="approval-summary-value">
            {reviewItems.length}
          </div>
        </div>

        <div className="approval-summary-card">
          <div className="approval-summary-label">
            Ready
          </div>

          <div className="approval-summary-value">
            {readyItems.length}
          </div>
        </div>
      </div>

      <div className="panel">
        <div className="panel-body approval-table-wrapper">
          <table className="approval-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Theme</th>
                <th>Platform</th>
                <th>Score</th>
                <th>Signal</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>

            <tbody>
              {recommendations.map(
                (item) => {
                  const review =
                    getReviewRequired(
                      item
                    );

                  return (
                    <tr
                      key={
                        item.production_id_v1 ||
                        item.recommendation_rank_v1
                      }
                    >
                      <td>
                        #
                        {
                          item.recommendation_rank_v1
                        }
                      </td>

                      <td>
                        {item.theme}
                      </td>

                      <td>
                        {item.platform}
                      </td>

                      <td>
                        {toNumber(
                          item.final_opportunity_score_v3
                        ).toFixed(2)}
                      </td>

                      <td>
                        {item.current_signal_class_v1 ||
                          "NO SIGNAL"}
                      </td>

                      <td>
                        <span
                          className={`approval-status ${
                            review
                              ? "review"
                              : "ready"
                          }`}
                        >
                          {review
                            ? "Review"
                            : "Ready"}
                        </span>
                      </td>

                      <td>
                        <button
                          type="button"
                          className="table-action"
                          onClick={() =>
                            onOpen(item)
                          }
                        >
                          Open
                        </button>
                      </td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [
    activePage,
    setActivePage,
  ] = useState("dashboard");

  const [
    recommendations,
    setRecommendations,
  ] = useState(INITIAL_DATA);

  const [
    selectedRecommendation,
    setSelectedRecommendation,
  ] = useState(null);

  const [
    searchValue,
    setSearchValue,
  ] = useState("");

  function openRecommendation(
    recommendation
  ) {
    setSelectedRecommendation(
      recommendation
    );
  }

  function closeRecommendation() {
    setSelectedRecommendation(null);
  }

  function handleUpload(event) {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    const reader =
      new FileReader();

    reader.onload = () => {
      try {
        const rows = parseCSV(
          String(reader.result || "")
        );

        const normalizedRows =
          rows.map(
            normalizeRecommendation
          );

        if (
          normalizedRows.length > 0
        ) {
          setRecommendations(
            normalizedRows
          );

          setSelectedRecommendation(
            null
          );

          setActivePage(
            "dashboard"
          );
        }
      } catch (error) {
        console.error(
          "Unable to load CSV:",
          error
        );
      }
    };

    reader.readAsText(file);

    event.target.value = "";
  }

  const filteredRecommendations =
    useMemo(() => {
      const query =
        normalize(searchValue);

      if (!query) {
        return recommendations;
      }

      return recommendations.filter(
        (item) => {
          const searchable = [
            item.theme,
            item.platform,
            item.content_type,
            item.current_signal_class_v1,
            item.production_readiness_v1,
            item.day,
            item.date,
            item.hook_v1,
            item.caption_v1,
            item.recommendation_rank_v1,
          ]
            .map(normalize)
            .join(" ");

          return searchable.includes(
            query
          );
        }
      );
    }, [
      recommendations,
      searchValue,
    ]);

  let page;

  if (selectedRecommendation) {
    page = (
      <PostDetail
        recommendation={
          selectedRecommendation
        }
        onBack={
          closeRecommendation
        }
      />
    );
  } else if (
    activePage === "calendar"
  ) {
    page = (
      <div className="calendar-page">
        <header className="page-header">
          <div>
            <div className="eyebrow">
              PLANNING
            </div>

            <h1>
              Weekly calendar
            </h1>

            <p>
              Current Cell 83
              recommendations organised
              by publishing date.
            </p>
          </div>
        </header>

        <CalendarView
          recommendations={
            filteredRecommendations
          }
          onOpen={
            openRecommendation
          }
        />
      </div>
    );
  } else if (
    activePage === "intelligence"
  ) {
    page = (
      <IntelligenceChat
        recommendations={
          filteredRecommendations
        }
      />
    );
  } else if (
    activePage === "approval"
  ) {
    page = (
      <ApprovalPage
        recommendations={
          filteredRecommendations
        }
        onOpen={
          openRecommendation
        }
      />
    );
  } else {
    page = (
      <Dashboard
        recommendations={
          filteredRecommendations
        }
        onOpen={
          openRecommendation
        }
        setActivePage={
          setActivePage
        }
      />
    );
  }

  return (
    <div className="app-shell">
      <Sidebar
        activePage={activePage}
        setActivePage={
          setActivePage
        }
      />

      <div className="main-shell">
        <Topbar
          onUpload={handleUpload}
          searchValue={searchValue}
          setSearchValue={
            setSearchValue
          }
        />

        <main className="page-content">
          {page}
        </main>
      </div>
    </div>
  );
}