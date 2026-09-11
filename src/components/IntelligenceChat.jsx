import React, { useMemo, useState } from "react";
import {
  ArrowUp,
  Sparkles,
} from "lucide-react";

function extractTopic(question) {
  const cleaned = question
    .replace(/[?!.,]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const patterns = [
    /about\s+(.+)$/i,
    /on\s+(.+)$/i,
    /for\s+(.+)$/i,
    /around\s+(.+)$/i,
  ];

  for (const pattern of patterns) {
    const match = cleaned.match(pattern);

    if (match?.[1]) {
      return match[1]
        .replace(
          /\b(create|give me|write|make|a|an|the|post|carousel)\b/gi,
          ""
        )
        .trim();
    }
  }

  return "midlife";
}

function detectFormat(question) {
  const q = question.toLowerCase();

  if (q.includes("carousel")) {
    return "Carousel";
  }

  if (q.includes("reel") || q.includes("video")) {
    return "Reel";
  }

  if (q.includes("linkedin")) {
    return "LinkedIn Post";
  }

  if (q.includes("facebook")) {
    return "Facebook Post";
  }

  if (q.includes("instagram")) {
    return "Instagram Post";
  }

  return "Social Post";
}

function createCarousel(topic) {
  const readableTopic =
    topic.charAt(0).toUpperCase() + topic.slice(1);

  return {
    format: "Carousel",
    slides: [
      {
        slide_number: 1,
        title: `What does ${readableTopic} mean in midlife?`,
        body: `Midlife can change the questions we ask about ${topic}. What once felt certain may deserve a second look.`,
        visual_direction:
          "Strong editorial opening with minimal typography.",
      },
      {
        slide_number: 2,
        title: "The old answer may no longer fit.",
        body: `Our circumstances, priorities and understanding of ourselves evolve. That can change how we think about ${topic}.`,
        visual_direction:
          "Human-centered image with generous negative space.",
      },
      {
        slide_number: 3,
        title: "There is room to rethink.",
        body: `Instead of asking what you should do next, begin by asking what matters to you now.`,
        visual_direction:
          "Reflective lifestyle image.",
      },
      {
        slide_number: 4,
        title: "Your next chapter can be intentional.",
        body: `Experience gives you something powerful: perspective. Use it to make more conscious choices about ${topic}.`,
        visual_direction:
          "Warm, optimistic image showing possibility.",
      },
      {
        slide_number: 5,
        title: "Start with one better question.",
        body: `What would you change about your relationship with ${topic} if you gave yourself permission to rethink it?`,
        visual_direction:
          "Minimal closing frame with Zuva Life editorial feel.",
      },
    ],
  };
}

function createContent(question) {
  const topic = extractTopic(question);
  const format = detectFormat(question);

  if (format === "Carousel") {
    return createCarousel(topic);
  }

  if (format === "Reel") {
    return {
      format: "Reel",
      hook: `What if ${topic} looked different in your next chapter?`,
      scenes: [
        "Opening: introduce the question with a calm editorial visual.",
        "Scene 2: show the tension between an old expectation and a changing life.",
        "Scene 3: introduce a new perspective.",
        "Scene 4: offer one practical reflection question.",
        "Closing: invite the audience to consider their own next chapter.",
      ],
    };
  }

  return {
    format,
    hook: `What if ${topic} could become part of a more intentional next chapter?`,
    body: `Midlife can be an opportunity to rethink the assumptions we have carried for years. Our priorities change. Our experience grows. And the questions we ask can become more important than the answers we once accepted.\n\nPerhaps the next chapter does not need to follow the old template.\n\nPerhaps it can be designed around what matters now.`,
    caption: `What if ${topic} could be approached differently in midlife?\n\nThere is no single formula for a meaningful next chapter. Sometimes the first step is simply giving yourself permission to ask a better question.`,
    cta: "What would you rethink if you gave yourself more room to choose?",
  };
}

function findRelatedRecords(question, recommendations) {
  const q = question.toLowerCase();

  const keywords = q
    .split(/\s+/)
    .filter((word) => word.length > 3)
    .slice(0, 12);

  return recommendations
    .map((item) => {
      const searchable = [
        item.theme,
        item.platform,
        item.content_type,
        item.hook_v1,
        item.caption_v1,
        item.cta_v1,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matches = keywords.filter((keyword) =>
        searchable.includes(keyword)
      ).length;

      return {
        item,
        matches,
      };
    })
    .filter((entry) => entry.matches > 0)
    .sort((a, b) => b.matches - a.matches)
    .slice(0, 3)
    .map((entry) => entry.item);
}

function ContentResult({ content }) {
  return (
    <div className="generated-content">
      <div className="generated-format">
        {content.format}
      </div>

      {content.slides && (
        <div className="generated-slides">
          {content.slides.map((slide) => (
            <article
              className="generated-slide"
              key={slide.slide_number}
            >
              <div className="slide-number">
                SLIDE {slide.slide_number}
              </div>

              <h3>{slide.title}</h3>

              <p>{slide.body}</p>

              <div className="slide-visual">
                {slide.visual_direction}
              </div>
            </article>
          ))}
        </div>
      )}

      {content.hook && (
        <section className="generated-section">
          <div className="detail-label">Hook</div>
          <p>{content.hook}</p>
        </section>
      )}

      {content.scenes && (
        <section className="generated-section">
          <div className="detail-label">
            Reel Structure
          </div>

          {content.scenes.map((scene, index) => (
            <p key={index}>
              <strong>Scene {index + 1}:</strong>{" "}
              {scene}
            </p>
          ))}
        </section>
      )}

      {content.body && (
        <section className="generated-section">
          <div className="detail-label">Post Copy</div>
          <p>{content.body}</p>
        </section>
      )}

      {content.caption && (
        <section className="generated-section">
          <div className="detail-label">Caption</div>
          <p>{content.caption}</p>
        </section>
      )}

      {content.cta && (
        <section className="generated-section">
          <div className="detail-label">CTA</div>
          <p>{content.cta}</p>
        </section>
      )}
    </div>
  );
}

export default function IntelligenceChat({
  recommendations = [],
}) {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);

  const examples = useMemo(
    () => [
      "Give me a 5-slide carousel about longevity",
      "Create a LinkedIn post about midlife purpose",
      "Give me an Instagram post about retirement",
      "Create a reel about life transitions",
      "What are the strongest themes in our historical data?",
      "Show me this week's recommendations",
    ],
    []
  );

  function answerQuestion(value) {
    const trimmed = value.trim();

    if (!trimmed) {
      return;
    }

    const q = trimmed.toLowerCase();

    const isWeekly =
      q.includes("this week") ||
      q.includes("weekly recommendations");

    const asksForContent =
      q.includes("give me") ||
      q.includes("create") ||
      q.includes("write") ||
      q.includes("make") ||
      q.includes("carousel") ||
      q.includes("post") ||
      q.includes("reel");

    let assistantMessage;

    if (isWeekly) {
      const sorted = [...recommendations].sort(
        (a, b) =>
          Number(b.final_opportunity_score_v3 || 0) -
          Number(a.final_opportunity_score_v3 || 0)
      );

      assistantMessage = {
        type: "weekly",
        text:
          "Here are the strongest recommendations in the current planning window.",
        records: sorted.slice(0, 5),
      };
    } else if (asksForContent) {
      const content = createContent(trimmed);

      const related = findRelatedRecords(
        trimmed,
        recommendations
      );

      assistantMessage = {
        type: "content",
        text:
          "This request is not restricted to the weekly calendar. I created the requested content structure and also found related Zuva intelligence records where available.",
        content,
        records: related,
      };
    } else {
      const related = findRelatedRecords(
        trimmed,
        recommendations
      );

      assistantMessage = {
        type: "analysis",
        text:
          related.length > 0
            ? "I found related records in the current intelligence dataset."
            : "This question will be handled by the broader intelligence layer once the persistent intelligence API is connected. It is not restricted to this week's content.",
        records: related,
      };
    }

    setMessages((current) => [
      ...current,
      {
        role: "user",
        text: trimmed,
      },
      {
        role: "assistant",
        ...assistantMessage,
      },
    ]);

    setQuestion("");
  }

  return (
    <div className="intelligence-page">
      <div className="intelligence-intro">
        <div className="intelligence-kicker">
          <Sparkles size={15} />
          ZUVA SOCIAL INTELLIGENCE
        </div>

        <h1>Ask anything.</h1>

        <p>
          Explore Zuva Life's social intelligence, ask
          questions, request content, analyse historical
          evidence, explore current signals, or work with
          weekly recommendations.
        </p>
      </div>

      {messages.length === 0 && (
        <div className="intelligence-start">
          <div className="intelligence-start-title">
            Try asking
          </div>

          <div className="intelligence-examples">
            {examples.map((example) => (
              <button
                type="button"
                className="example-chip"
                key={example}
                onClick={() => answerQuestion(example)}
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="chat-messages">
        {messages.map((message, index) => (
          <div
            className={`chat-message ${message.role}`}
            key={`${message.role}-${index}`}
          >
            <div className="chat-message-label">
              {message.role === "user"
                ? "YOU"
                : "SOCIAL INTELLIGENCE"}
            </div>

            <div className="chat-message-bubble">
              {message.text}
            </div>

            {message.role === "assistant" &&
              message.content && (
                <ContentResult
                  content={message.content}
                />
              )}

            {message.role === "assistant" &&
              message.records?.length > 0 && (
                <div className="intelligence-related">
                  <div className="detail-label">
                    Related Intelligence
                  </div>

                  {message.records.map((record) => (
                    <div
                      className="intelligence-record"
                      key={
                        record.production_id_v1 ||
                        record.recommendation_rank_v1
                      }
                    >
                      <strong>
                        {record.hook_v1}
                      </strong>

                      <span>
                        {record.theme} ·{" "}
                        {record.platform}
                      </span>
                    </div>
                  ))}
                </div>
              )}
          </div>
        ))}
      </div>

      <div className="chat-composer">
        <textarea
          value={question}
          onChange={(event) =>
            setQuestion(event.target.value)
          }
          onKeyDown={(event) => {
            if (
              event.key === "Enter" &&
              !event.shiftKey
            ) {
              event.preventDefault();
              answerQuestion(question);
            }
          }}
          placeholder="Ask anything about Zuva social intelligence..."
          aria-label="Ask Social Intelligence"
        />

        <button
          type="button"
          className="chat-send"
          onClick={() => answerQuestion(question)}
        >
          <ArrowUp size={17} />
          Ask
        </button>
      </div>
    </div>
  );
}