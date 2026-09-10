import { useMemo, useState } from "react";
import {
  ArrowUp,
  Bot,
  Clock3,
  Lightbulb,
  Sparkles,
  TrendingUp,
} from "lucide-react";

function formatHour(hour) {
  if (hour === null || hour === undefined || hour === "") return "—";

  const numericHour = Number(hour);
  if (Number.isNaN(numericHour)) return String(hour);

  const normalized = ((numericHour % 24) + 24) % 24;
  const suffix = normalized >= 12 ? "PM" : "AM";
  const displayHour = normalized % 12 || 12;

  return `${displayHour}:00 ${suffix}`;
}

function normalize(value) {
  return String(value ?? "").trim().toLowerCase();
}

function average(values) {
  const valid = values
    .map(Number)
    .filter((value) => Number.isFinite(value));

  if (!valid.length) return 0;

  return valid.reduce((sum, value) => sum + value, 0) / valid.length;
}

function findBestRecommendation(recommendations) {
  return [...recommendations].sort(
    (a, b) =>
      Number(b.final_opportunity_score_v3 || 0) -
      Number(a.final_opportunity_score_v3 || 0)
  )[0];
}

function getThemeSummary(recommendations) {
  const grouped = {};

  recommendations.forEach((item) => {
    const theme = item.theme || "Unclassified";

    if (!grouped[theme]) {
      grouped[theme] = {
        theme,
        count: 0,
        scores: [],
        evidence: [],
      };
    }

    grouped[theme].count += 1;
    grouped[theme].scores.push(
      Number(item.final_opportunity_score_v3 || 0)
    );
    grouped[theme].evidence.push(
      Number(item.historical_evidence_strength_v3 || 0)
    );
  });

  return Object.values(grouped)
    .map((item) => ({
      ...item,
      averageScore: average(item.scores),
      averageEvidence: average(item.evidence),
    }))
    .sort((a, b) => b.averageScore - a.averageScore);
}

function answerQuestion(question, recommendations) {
  const q = normalize(question);

  if (!recommendations.length) {
    return {
      title: "No recommendation data available",
      body: "Load the latest Cell 83 production CSV first. I can then answer questions from the current recommendation set.",
      items: [],
    };
  }

  const best = findBestRecommendation(recommendations);
  const themeSummary = getThemeSummary(recommendations);

  const reviewCount = recommendations.filter(
    (item) =>
      normalize(item.manual_review_required_v1) === "yes" ||
      normalize(item.qa_status) === "needs_review"
  ).length;

  const positiveSignals = recommendations.filter((item) => {
    const signal = normalize(item.current_signal_class_v1);
    return (
      signal.includes("positive") ||
      signal.includes("strong") ||
      signal.includes("opportunity")
    );
  }).length;

  const averageScore = average(
    recommendations.map((item) => item.final_opportunity_score_v3)
  );

  const averageEvidence = average(
    recommendations.map((item) => item.historical_evidence_strength_v3)
  );

  const asksBest =
    q.includes("best") ||
    q.includes("top") ||
    q.includes("highest") ||
    q.includes("strongest");

  const asksTime =
    q.includes("time") ||
    q.includes("when") ||
    q.includes("hour") ||
    q.includes("schedule");

  const asksWhy =
    q.includes("why") ||
    q.includes("reason") ||
    q.includes("because");

  const asksTheme =
    q.includes("theme") ||
    q.includes("topic") ||
    q.includes("content pillar");

  const asksReview =
    q.includes("review") ||
    q.includes("approval") ||
    q.includes("approve");

  const asksSignal =
    q.includes("signal") ||
    q.includes("current world") ||
    q.includes("trend");

  const asksPerformance =
    q.includes("performance") ||
    q.includes("score") ||
    q.includes("opportunity");

  if (asksBest || asksTime) {
    return {
      title: "Top recommendation",
      body: `The highest-scoring recommendation is Rank ${best.recommendation_rank_v1}, scheduled for ${best.day} at ${formatHour(
        best.hour
      )} on ${best.platform}.`,
      items: [
        `Theme: ${best.theme}`,
        `Opportunity score: ${Number(
          best.final_opportunity_score_v3 || 0
        ).toFixed(2)}`,
        `Content type: ${best.content_type}`,
        `Current-world signal: ${
          best.current_signal_class_v1 || "No signal"
        }`,
        `Evidence strength: ${(
          Number(best.historical_evidence_strength_v3 || 0) * 100
        ).toFixed(1)}%`,
      ],
    };
  }

  if (asksWhy) {
    return {
      title: `Why Rank ${best.recommendation_rank_v1} is strong`,
      body:
        best.hook_v1 ||
        "The recommendation is supported by the production scoring and evidence fields in the current dataset.",
      items: [
        `Opportunity score: ${Number(
          best.final_opportunity_score_v3 || 0
        ).toFixed(2)}`,
        `Historical opportunity: ${Number(
          best.historical_opportunity_v3 || 0
        ).toFixed(2)}`,
        `Evidence strength: ${(
          Number(best.historical_evidence_strength_v3 || 0) * 100
        ).toFixed(1)}%`,
        `Evidence coverage: ${(
          Number(best.historical_evidence_coverage_v3 || 0) * 100
        ).toFixed(1)}%`,
        `Current-world relevance: ${Number(
          best.current_world_relevance_v3 || 0
        ).toFixed(2)}`,
      ],
    };
  }

  if (asksTheme) {
    const topThemes = themeSummary.slice(0, 5);

    return {
      title: "Theme performance",
      body: `There are ${themeSummary.length} themes represented in the current recommendation set. They are ranked below by average opportunity score.`,
      items: topThemes.map(
        (item, index) =>
          `${index + 1}. ${item.theme} — ${item.count} post${
            item.count === 1 ? "" : "s"
          }, average score ${item.averageScore.toFixed(2)}`
      ),
    };
  }

  if (asksReview) {
    const reviewPercentage =
      recommendations.length > 0
        ? (reviewCount / recommendations.length) * 100
        : 0;

    return {
      title: "Approval queue",
      body: `${reviewCount} of ${
        recommendations.length
      } recommendations currently require review (${reviewPercentage.toFixed(
        1
      )}%).`,
      items: [
        `${recommendations.length - reviewCount} recommendations are not currently flagged for review.`,
        `${reviewCount} recommendations are in the review queue.`,
        "Manual approval should remain the final publishing gate.",
      ],
    };
  }

  if (asksSignal) {
    return {
      title: "Current-world signals",
      body: `${positiveSignals} recommendation${
        positiveSignals === 1 ? "" : "s"
      } currently carries a positive/current-world opportunity signal.`,
      items: [
        `Recommendations analysed: ${recommendations.length}`,
        `Positive/current-world opportunities: ${positiveSignals}`,
        `Average historical evidence strength: ${(
          averageEvidence * 100
        ).toFixed(1)}%`,
      ],
    };
  }

  if (asksPerformance) {
    return {
      title: "Recommendation performance",
      body: `The current recommendation set has an average opportunity score of ${averageScore.toFixed(
        2
      )}.`,
      items: [
        `Highest score: ${Number(
          best.final_opportunity_score_v3 || 0
        ).toFixed(2)}`,
        `Lowest score: ${Math.min(
          ...recommendations.map((item) =>
            Number(item.final_opportunity_score_v3 || 0)
          )
        ).toFixed(2)}`,
        `Average evidence strength: ${(averageEvidence * 100).toFixed(1)}%`,
        `Themes represented: ${themeSummary.length}`,
      ],
    };
  }

  return {
    title: "Social Intelligence overview",
    body: `I found ${recommendations.length} current recommendations. The strongest opportunity is Rank ${
      best.recommendation_rank_v1
    } in ${best.theme}, with a score of ${Number(
      best.final_opportunity_score_v3 || 0
    ).toFixed(2)}.`,
    items: [
      `Top platform: ${best.platform}`,
      `Recommended time: ${formatHour(best.hour)}`,
      `Current-world signal: ${
        best.current_signal_class_v1 || "No signal"
      }`,
      `Posts requiring review: ${reviewCount}`,
      `Average opportunity score: ${averageScore.toFixed(2)}`,
    ],
  };
}

export default function IntelligenceChat({ recommendations }) {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);

  const suggestions = useMemo(
    () => [
      "What is the best recommendation this week?",
      "Why is the top recommendation strong?",
      "Which themes are performing best?",
      "What needs approval?",
      "What current-world signals should I know about?",
    ],
    []
  );

  function submitQuestion(value = question) {
    const trimmed = String(value || "").trim();

    if (!trimmed) return;

    const answer = answerQuestion(trimmed, recommendations);

    setMessages((current) => [
      ...current,
      {
        type: "user",
        text: trimmed,
      },
      {
        type: "assistant",
        ...answer,
      },
    ]);

    setQuestion("");
  }

  function handleSubmit(event) {
    event.preventDefault();
    submitQuestion();
  }

  return (
    <section className="intelligence-page">
      <div className="intelligence-hero">
        <div className="intelligence-hero-icon">
          <Sparkles size={22} strokeWidth={1.8} />
        </div>

        <div>
          <div className="eyebrow">SOCIAL INTELLIGENCE</div>
          <h1>Ask your intelligence layer.</h1>
          <p>
            Ask questions about the current recommendation set, opportunity
            scores, themes, timing, evidence, signals, and approval queue.
          </p>
        </div>
      </div>

      <div className="intelligence-layout">
        <div className="intelligence-main">
          <div className="chat-card">
            {messages.length === 0 ? (
              <div className="chat-empty">
                <div className="chat-empty-icon">
                  <Bot size={26} strokeWidth={1.7} />
                </div>

                <h2>What would you like to know?</h2>

                <p>
                  I can answer using the recommendations currently loaded into
                  the workspace.
                </p>

                <div className="suggestion-grid">
                  {suggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      className="suggestion-button"
                      onClick={() => submitQuestion(suggestion)}
                    >
                      <Lightbulb size={15} strokeWidth={1.8} />
                      <span>{suggestion}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="chat-messages">
                {messages.map((message, index) => {
                  if (message.type === "user") {
                    return (
                      <div className="message-row user-message" key={index}>
                        <div className="message-bubble user-bubble">
                          {message.text}
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div className="message-row assistant-message" key={index}>
                      <div className="assistant-avatar">
                        <Bot size={17} strokeWidth={1.8} />
                      </div>

                      <div className="assistant-content">
                        <strong>{message.title}</strong>
                        <p>{message.body}</p>

                        {message.items?.length > 0 && (
                          <ul>
                            {message.items.map((item, itemIndex) => (
                              <li key={itemIndex}>{item}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <form className="chat-input-area" onSubmit={handleSubmit}>
              <input
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                placeholder="Ask about this week's recommendations..."
                aria-label="Ask Social Intelligence"
              />

              <button
                type="submit"
                className="chat-send-button"
                aria-label="Ask question"
              >
                <ArrowUp size={18} strokeWidth={2} />
              </button>
            </form>
          </div>
        </div>

        <aside className="intelligence-side">
          <div className="intelligence-side-card">
            <div className="side-card-icon">
              <TrendingUp size={18} strokeWidth={1.8} />
            </div>

            <div>
              <span>Recommendations</span>
              <strong>{recommendations.length}</strong>
            </div>
          </div>

          <div className="intelligence-side-card">
            <div className="side-card-icon">
              <Clock3 size={18} strokeWidth={1.8} />
            </div>

            <div>
              <span>Data source</span>
              <strong>Cell 83</strong>
            </div>
          </div>

          <div className="intelligence-note">
            <div className="note-title">Grounded answers</div>
            <p>
              Responses are based on the recommendation records currently
              loaded into the workspace. The future backend can replace this
              local query layer with persistent intelligence and an LLM.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}