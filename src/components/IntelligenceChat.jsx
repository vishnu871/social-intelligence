import React, { useMemo, useState } from "react";
import { ArrowUp, Sparkles } from "lucide-react";

function formatRecommendationContent(item) {
  if (!item) return "";

  const parts = [];

  if (item.hook_v1) {
    parts.push(`HOOK\n${item.hook_v1}`);
  }

  if (item.caption_v1) {
    parts.push(`CAPTION\n${item.caption_v1}`);
  }

  if (item.cta_v1) {
    parts.push(`CTA\n${item.cta_v1}`);
  }

  if (item.creative_direction_v1) {
    parts.push(`CREATIVE DIRECTION\n${item.creative_direction_v1}`);
  }

  return parts.join("\n\n");
}

function detectIntent(question) {
  const q = question.toLowerCase();

  if (
    q.includes("this week") ||
    q.includes("this week's") ||
    q.includes("weekly") ||
    q.includes("recommendation")
  ) {
    return "weekly";
  }

  if (
    q.includes("carousel") ||
    q.includes("post") ||
    q.includes("caption") ||
    q.includes("reel") ||
    q.includes("linkedin") ||
    q.includes("instagram") ||
    q.includes("facebook") ||
    q.includes("content") ||
    q.includes("write") ||
    q.includes("create") ||
    q.includes("give me")
  ) {
    return "content";
  }

  if (
    q.includes("trend") ||
    q.includes("trending") ||
    q.includes("current") ||
    q.includes("right now") ||
    q.includes("today")
  ) {
    return "current";
  }

  if (
    q.includes("historical") ||
    q.includes("history") ||
    q.includes("past") ||
    q.includes("best performing")
  ) {
    return "historical";
  }

  return "general";
}

function findRelevantRecommendations(question, recommendations) {
  const q = question.toLowerCase();

  const terms = q
    .replace(/[?!.,]/g, " ")
    .split(/\s+/)
    .filter((term) => term.length > 3);

  return recommendations
    .map((item) => {
      const haystack = [
        item.theme,
        item.platform,
        item.content_type,
        item.hook_v1,
        item.caption_v1,
        item.cta_v1,
        item.creative_direction_v1,
        item.day,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matches = terms.filter((term) => haystack.includes(term)).length;

      return {
        item,
        matches,
      };
    })
    .filter((entry) => entry.matches > 0)
    .sort((a, b) => {
      if (b.matches !== a.matches) {
        return b.matches - a.matches;
      }

      return (
        Number(b.item.final_opportunity_score_v3 || 0) -
        Number(a.item.final_opportunity_score_v3 || 0)
      );
    })
    .slice(0, 5)
    .map((entry) => entry.item);
}

function buildLocalResponse(question, recommendations) {
  const intent = detectIntent(question);

  if (intent === "weekly") {
    const top = [...recommendations]
      .sort(
        (a, b) =>
          Number(b.final_opportunity_score_v3 || 0) -
          Number(a.final_opportunity_score_v3 || 0)
      )
      .slice(0, 5);

    if (!top.length) {
      return {
        text: "I don't have weekly recommendations loaded yet.",
        items: [],
      };
    }

    return {
      text: `Here are the strongest recommendations currently loaded for the planning window, ranked by opportunity score.`,
      items: top,
    };
  }

  const relevant = findRelevantRecommendations(question, recommendations);

  if (intent === "content") {
    if (!relevant.length) {
      return {
        text:
          "I can handle content requests beyond the current weekly recommendations. The current frontend dataset does not contain a matching recommendation for this request yet. Once the intelligence API is connected, this request will be routed to the broader content-generation layer rather than being restricted to the weekly calendar.",
        items: [],
      };
    }

    return {
      text:
        "I found the closest intelligence records currently available. Below is the production content attached to those records. For carousel recommendations, the backend should provide the slide-by-slide structure rather than only the title, caption and CTA.",
      items: relevant,
    };
  }

  if (intent === "current") {
    const relevantCurrent = recommendations.filter((item) => {
      const signal = String(item.current_signal_class_v1 || "").toLowerCase();
      const relevance = Number(item.current_world_relevance_v3 || 0);

      return (
        signal.includes("positive") ||
        signal.includes("watch") ||
        relevance > 0
      );
    });

    return {
      text:
        "Current-world intelligence should be used for this type of question. The records currently loaded into the frontend are recommendation records; the persistent backend will expose the complete current-world signal dataset separately.",
      items: relevantCurrent.slice(0, 5),
    };
  }

  if (intent === "historical") {
    const historical = [...recommendations]
      .sort(
        (a, b) =>
          Number(b.historical_evidence_strength_v3 || 0) -
          Number(a.historical_evidence_strength_v3 || 0)
      )
      .slice(0, 5);

    return {
      text:
        "Historical questions should be answered from the historical evidence layer, not limited to this week's calendar. These are the strongest matching records currently loaded.",
      items: historical,
    };
  }

  if (relevant.length) {
    return {
      text:
        "I found relevant records in the current intelligence dataset. The broader intelligence API will combine recommendations, historical evidence, current-world signals and content-generation capabilities when connected.",
      items: relevant,
    };
  }

  return {
    text:
      "I can answer questions beyond this week's recommendations. The current frontend is still using the local Cell 83 dataset, so broader questions will become fully dynamic when the Intelligence API and persistent data layer are connected.",
    items: [],
  };
}

function RecommendationResult({ item }) {
  const format = String(item.content_type || "").toLowerCase();

  const slides = item.content_structure?.slides || item.slides || [];

  return (
    <div className="chat-result">
      <div className="recommendation-top">
        <span className="recommendation-theme">
          {item.theme || "Social Intelligence"}
        </span>

        <span className="content-format">
          {item.content_type || "Content"}
        </span>
      </div>

      <h3 className="recommendation-title">
        {item.hook_v1 || item.title || "Untitled recommendation"}
      </h3>

      {slides.length > 0 && format.includes("carousel") ? (
        <div className="carousel-slides">
          {slides.map((slide, index) => (
            <div className="carousel-slide" key={slide.slide_number || index}>
              <div className="slide-number">
                SLIDE {slide.slide_number || index + 1}
              </div>

              {slide.title && (
                <div className="slide-title">{slide.title}</div>
              )}

              {slide.body && (
                <div className="slide-body">{slide.body}</div>
              )}

              {slide.visual_direction && (
                <div className="slide-visual">
                  Visual direction: {slide.visual_direction}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : null}

      {!slides.length && item.caption_v1 && (
        <div className="detail-section">
          <h3>Caption</h3>
          <p>{item.caption_v1}</p>
        </div>
      )}

      {item.cta_v1 && (
        <div className="detail-section">
          <h3>CTA</h3>
          <p>{item.cta_v1}</p>
        </div>
      )}

      {item.creative_direction_v1 && (
        <div className="detail-section">
          <h3>Creative Direction</h3>
          <p>{item.creative_direction_v1}</p>
        </div>
      )}
    </div>
  );
}

export default function IntelligenceChat({ recommendations = [] }) {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);

  const examples = useMemo(
    () => [
      "Give me a carousel about longevity",
      "Create a LinkedIn post about midlife purpose",
      "What are the strongest historical themes?",
      "What is trending around retirement?",
      "Show me this week's recommendations",
      "Why was the strongest post recommended?",
    ],
    []
  );

  function submitQuestion(value = question) {
    const trimmed = value.trim();

    if (!trimmed) return;

    const response = buildLocalResponse(trimmed, recommendations);

    setMessages((current) => [
      ...current,
      {
        role: "user",
        text: trimmed,
      },
      {
        role: "assistant",
        text: response.text,
        items: response.items,
      },
    ]);

    setQuestion("");
  }

  return (
    <div className="intelligence-page">
      <div className="intelligence-intro">
        <h1>Ask Social Intelligence</h1>

        <p>
          Ask anything about Zuva Life's social intelligence, content,
          historical evidence, current-world signals, recommendations,
          trends, or strategy. Your question is not restricted to this
          week's content calendar.
        </p>
      </div>

      {!messages.length && (
        <>
          <div className="intelligence-examples">
            {examples.map((example) => (
              <button
                key={example}
                type="button"
                className="example-chip"
                onClick={() => submitQuestion(example)}
              >
                {example}
              </button>
            ))}
          </div>

          <div className="empty-state">
            <Sparkles size={28} color="var(--teal)" />

            <h3>What do you want to know or create?</h3>

            <p>
              Ask for content, trends, analysis, historical evidence,
              recommendations, or strategy.
            </p>
          </div>
        </>
      )}

      <div className="chat-messages">
        {messages.map((message, index) => (
          <div
            className={`chat-message ${message.role}`}
            key={`${message.role}-${index}`}
          >
            <div className="chat-message-label">
              {message.role === "user" ? "You" : "Social Intelligence"}
            </div>

            <div className="chat-message-bubble">{message.text}</div>

            {message.role === "assistant" &&
              message.items &&
              message.items.length > 0 && (
                <div className="chat-results">
                  {message.items.map((item, itemIndex) => (
                    <RecommendationResult
                      key={
                        item.production_id_v1 ||
                        item.approval_id_v1 ||
                        itemIndex
                      }
                      item={item}
                    />
                  ))}
                </div>
              )}
          </div>
        ))}
      </div>

      <div className="chat-composer">
        <textarea
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              submitQuestion();
            }
          }}
          placeholder="Ask anything about Zuva Life social intelligence..."
        />

        <button
          type="button"
          className="chat-send"
          onClick={() => submitQuestion()}
        >
          <ArrowUp size={17} />
          Ask
        </button>
      </div>
    </div>
  );
}