import React, { useMemo, useState } from "react";
import {
  ArrowUp,
  CalendarDays,
  Clock3,
  Sparkles,
} from "lucide-react";

function getDateRange(recommendations) {
  const dates = recommendations
    .map((item) => item.date)
    .filter(Boolean)
    .sort();

  if (!dates.length) {
    return {
      start: null,
      end: null,
    };
  }

  return {
    start: dates[0],
    end: dates[dates.length - 1],
  };
}

function formatDate(dateString) {
  if (!dateString) {
    return "";
  }

  const date = new Date(`${dateString}T12:00:00`);

  if (Number.isNaN(date.getTime())) {
    return dateString;
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatHour(hour) {
  const numericHour = Number(hour);

  if (!Number.isFinite(numericHour)) {
    return "";
  }

  const suffix = numericHour >= 12 ? "PM" : "AM";
  const displayHour = numericHour % 12 || 12;

  return `${displayHour}:00 ${suffix}`;
}

function extractTopic(question) {
  const q = question.toLowerCase();

  const topicPatterns = [
    /about\s+(.+)$/i,
    /on\s+(.+)$/i,
    /around\s+(.+)$/i,
    /regarding\s+(.+)$/i,
    /for\s+(.+)$/i,
  ];

  for (const pattern of topicPatterns) {
    const match = question.match(pattern);

    if (match?.[1]) {
      const value = match[1]
        .replace(/[?.!,]+$/g, "")
        .trim();

      if (
        value &&
        ![
          "next week",
          "this week",
          "the week",
          "next month",
        ].includes(value.toLowerCase())
      ) {
        return value;
      }
    }
  }

  const knownTopics = [
    "retirement",
    "longevity",
    "midlife",
    "purpose",
    "identity",
    "reinvention",
    "career",
    "wealth",
    "money",
    "community",
    "aging",
    "longer lives",
    "life transition",
    "life transitions",
  ];

  for (const topic of knownTopics) {
    if (q.includes(topic)) {
      return topic;
    }
  }

  return "midlife";
}

function detectFormat(question) {
  const q = question.toLowerCase();

  if (q.includes("carousel")) {
    return "Carousel";
  }

  if (
    q.includes("reel") ||
    q.includes("video")
  ) {
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

function isWeeklyPlanningRequest(question) {
  const q = question.toLowerCase();

  return (
    q.includes("next week") ||
    q.includes("this week") ||
    q.includes("weekly content") ||
    q.includes("content for the week") ||
    q.includes("plan for next week") ||
    q.includes("content plan")
  );
}

function isContentRequest(question) {
  const q = question.toLowerCase();

  return (
    q.includes("give me content") ||
    q.includes("create content") ||
    q.includes("write content") ||
    q.includes("create a post") ||
    q.includes("give me a post") ||
    q.includes("write a post") ||
    q.includes("create a carousel") ||
    q.includes("give me a carousel") ||
    q.includes("write a carousel") ||
    q.includes("create a reel") ||
    q.includes("give me a reel") ||
    q.includes("write a reel") ||
    q.includes("create content")
  );
}

function createCarousel(topic, sourceRecord = null) {
  const readableTopic =
    topic.charAt(0).toUpperCase() +
    topic.slice(1);

  const sourceHook =
    sourceRecord?.hook_v1 ||
    `What does ${readableTopic} mean in midlife?`;

  return {
    format: "Carousel",

    hook: sourceHook,

    slides: [
      {
        slide_number: 1,
        title: sourceHook,
        body: `Our relationship with ${topic} can change as life changes. Midlife often gives us a chance to reconsider assumptions we once took for granted.`,
        visual_direction:
          "Strong editorial opening with generous whitespace and minimal typography.",
      },
      {
        slide_number: 2,
        title: "The old answer may no longer fit.",
        body: `What worked in one chapter of life may not necessarily work in another. That does not mean something is wrong.`,
        visual_direction:
          "Human-centered image showing reflection or transition.",
      },
      {
        slide_number: 3,
        title: "Experience changes the question.",
        body: `With experience comes perspective. We can begin asking not only what we should do, but what actually matters to us now.`,
        visual_direction:
          "Quiet lifestyle image with strong negative space.",
      },
      {
        slide_number: 4,
        title: "There is room to rethink.",
        body: `A longer life can create more than additional years. It can create additional chapters, choices and possibilities.`,
        visual_direction:
          "Warm image suggesting movement into a new chapter.",
      },
      {
        slide_number: 5,
        title: "Start with one better question.",
        body: `What would you change about your relationship with ${topic} if you gave yourself permission to rethink it?`,
        visual_direction:
          "Minimal closing frame with a reflective Zuva Life tone.",
      },
    ],

    caption:
      sourceRecord?.caption_v1 ||
      `What if we approached ${topic} differently in midlife?\n\nThere is no single formula for a meaningful next chapter. Sometimes the first step is simply giving yourself permission to ask a better question.`,

    cta:
      sourceRecord?.cta_v1 ||
      `What would you rethink about ${topic} if you gave yourself more room to choose?`,

    creative_direction:
      sourceRecord?.creative_direction_v1 ||
      "Editorial carousel with warm human imagery, generous whitespace and restrained typography.",
  };
}

function createSocialPost(topic, sourceRecord = null) {
  return {
    format: "Social Post",

    hook:
      sourceRecord?.hook_v1 ||
      `What if ${topic} could become part of a more intentional next chapter?`,

    body:
      sourceRecord?.caption_v1 ||
      `Midlife can be an opportunity to rethink the assumptions we have carried for years.\n\nOur priorities change. Our experience grows. And the questions we ask can become more important than the answers we once accepted.\n\nPerhaps the next chapter does not need to follow the old template.\n\nPerhaps it can be designed around what matters now.`,

    caption:
      sourceRecord?.caption_v1 ||
      `What if ${topic} could be approached differently in midlife?\n\nThere is no single formula for a meaningful next chapter. Sometimes the first step is simply giving yourself permission to ask a better question.`,

    cta:
      sourceRecord?.cta_v1 ||
      "What would you rethink if you gave yourself more room to choose?",

    creative_direction:
      sourceRecord?.creative_direction_v1 ||
      "Clean editorial image with a strong typographic hook and warm human-centered visual.",
  };
}

function createReel(topic, sourceRecord = null) {
  return {
    format: "Reel",

    hook:
      sourceRecord?.hook_v1 ||
      `What if ${topic} looked different in your next chapter?`,

    scenes: [
      "Opening: introduce the question with a calm, human visual.",
      "Scene 2: show the tension between an old expectation and a changing life.",
      "Scene 3: introduce a new perspective based on experience.",
      "Scene 4: give one reflective question for the audience.",
      "Closing: invite the audience to consider their own next chapter.",
    ],

    caption:
      sourceRecord?.caption_v1 ||
      `Sometimes the next chapter begins when we stop assuming that the old answer still applies.`,

    cta:
      sourceRecord?.cta_v1 ||
      "What would you rethink?",

    creative_direction:
      sourceRecord?.creative_direction_v1 ||
      "Slow-paced editorial reel with natural movement, intimate human moments and restrained text overlays.",
  };
}

function generateContent(question, sourceRecord = null) {
  const topic = extractTopic(question);
  const format = detectFormat(question);

  if (format === "Carousel") {
    return createCarousel(topic, sourceRecord);
  }

  if (format === "Reel") {
    return createReel(topic, sourceRecord);
  }

  return createSocialPost(topic, sourceRecord);
}

function findRelatedRecords(
  question,
  recommendations
) {
  const q = question.toLowerCase();

  const keywords = q
    .split(/\s+/)
    .map((word) =>
      word.replace(/[^a-z0-9-]/gi, "")
    )
    .filter((word) => word.length > 3)
    .filter(
      (word) =>
        ![
          "give",
          "create",
          "write",
          "content",
          "post",
          "this",
          "that",
          "next",
          "week",
          "about",
          "with",
          "from",
          "what",
        ].includes(word)
    )
    .slice(0, 15);

  if (!keywords.length) {
    return [];
  }

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
    .sort((a, b) => {
      if (b.matches !== a.matches) {
        return b.matches - a.matches;
      }

      return (
        Number(
          b.item.final_opportunity_score_v3 || 0
        ) -
        Number(
          a.item.final_opportunity_score_v3 || 0
        )
      );
    })
    .slice(0, 5)
    .map((entry) => entry.item);
}

function buildWeeklyPlan(recommendations) {
  const sorted = [...recommendations].sort(
    (a, b) => {
      const dateCompare = String(
        a.date || ""
      ).localeCompare(String(b.date || ""));

      if (dateCompare !== 0) {
        return dateCompare;
      }

      return (
        Number(a.hour || 0) -
        Number(b.hour || 0)
      );
    }
  );

  const dateRange = getDateRange(sorted);

  const days = {};

  sorted.forEach((item) => {
    if (!days[item.date]) {
      days[item.date] = [];
    }

    days[item.date].push(item);
  });

  const dayEntries = Object.entries(days);

  return {
    dateRange,
    days: dayEntries.map(
      ([date, posts]) => ({
        date,
        day:
          posts[0]?.day ||
          new Date(`${date}T12:00:00`).toLocaleDateString(
            "en-US",
            {
              weekday: "long",
            }
          ),
        posts: posts
          .sort(
            (a, b) =>
              Number(a.hour || 0) -
              Number(b.hour || 0)
          )
          .map((post) => ({
            ...post,
            generatedContent: generateContent(
              `${post.content_type} about ${post.theme}`,
              post
            ),
          })),
      })
    ),
  };
}

function WeeklyPlanResult({
  plan,
}) {
  return (
    <div className="weekly-plan">
      <div className="generated-format">
        Weekly Content Plan
      </div>

      <div className="weekly-plan-range">
        <CalendarDays size={15} />

        <span>
          {formatDate(plan.dateRange.start)}
          {" — "}
          {formatDate(plan.dateRange.end)}
        </span>
      </div>

      {plan.days.map((day) => (
        <section
          className="weekly-day"
          key={day.date}
        >
          <div className="weekly-day-header">
            <div>
              <div className="detail-label">
                {day.day}
              </div>

              <h3>
                {formatDate(day.date)}
              </h3>
            </div>

            <span className="weekly-post-count">
              {day.posts.length}{" "}
              {day.posts.length === 1
                ? "post"
                : "posts"}
            </span>
          </div>

          <div className="weekly-day-posts">
            {day.posts.map((post) => (
              <article
                className="weekly-content-card"
                key={
                  post.production_id_v1 ||
                  `${post.date}-${post.hour}-${post.platform}`
                }
              >
                <div className="weekly-content-meta">
                  <span>
                    <Clock3 size={13} />
                    {formatHour(post.hour)}
                  </span>

                  <span>
                    {post.platform}
                  </span>

                  <span>
                    {post.content_type}
                  </span>
                </div>

                <div className="weekly-content-theme">
                  {post.theme}
                </div>

                <h4>
                  {post.generatedContent.hook ||
                    post.hook_v1}
                </h4>

                {post.generatedContent.slides ? (
                  <div className="mini-slides">
                    {post.generatedContent.slides.map(
                      (slide) => (
                        <div
                          className="mini-slide"
                          key={slide.slide_number}
                        >
                          <span>
                            Slide{" "}
                            {slide.slide_number}
                          </span>

                          <strong>
                            {slide.title}
                          </strong>

                          <p>
                            {slide.body}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                ) : (
                  <p className="weekly-body">
                    {post.generatedContent.body}
                  </p>
                )}

                <div className="weekly-copy-block">
                  <div className="detail-label">
                    Caption
                  </div>

                  <p>
                    {post.generatedContent.caption}
                  </p>
                </div>

                <div className="weekly-copy-block">
                  <div className="detail-label">
                    CTA
                  </div>

                  <p>
                    {post.generatedContent.cta}
                  </p>
                </div>

                <div className="weekly-copy-block">
                  <div className="detail-label">
                    Creative Direction
                  </div>

                  <p>
                    {post.generatedContent.creative_direction}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function ContentResult({
  content,
  relatedRecords,
}) {
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
          <div className="detail-label">
            Hook
          </div>

          <p>{content.hook}</p>
        </section>
      )}

      {content.body && (
        <section className="generated-section">
          <div className="detail-label">
            Post Copy
          </div>

          <p>{content.body}</p>
        </section>
      )}

      {content.scenes && (
        <section className="generated-section">
          <div className="detail-label">
            Reel Structure
          </div>

          {content.scenes.map(
            (scene, index) => (
              <p key={index}>
                <strong>
                  Scene {index + 1}:
                </strong>{" "}
                {scene}
              </p>
            )
          )}
        </section>
      )}

      {content.caption && (
        <section className="generated-section">
          <div className="detail-label">
            Caption
          </div>

          <p>{content.caption}</p>
        </section>
      )}

      {content.cta && (
        <section className="generated-section">
          <div className="detail-label">
            CTA
          </div>

          <p>{content.cta}</p>
        </section>
      )}

      {content.creative_direction && (
        <section className="generated-section">
          <div className="detail-label">
            Creative Direction
          </div>

          <p>
            {content.creative_direction}
          </p>
        </section>
      )}

      {relatedRecords?.length > 0 && (
        <section className="intelligence-related">
          <div className="detail-label">
            Related Intelligence
          </div>

          {relatedRecords.map((record) => (
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
                {record.platform} ·{" "}
                {record.content_type}
              </span>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}

export default function IntelligenceChat({
  recommendations = [],
}) {
  const [question, setQuestion] =
    useState("");

  const [messages, setMessages] =
    useState([]);

  const examples = useMemo(
    () => [
      "Give me content for next week",
      "Give me a 5-slide carousel about longevity",
      "Create a LinkedIn post about midlife purpose",
      "Create an Instagram post about retirement",
      "Create a reel about life transitions",
      "What are the strongest themes in our data?",
    ],
    []
  );

  function answerQuestion(value) {
    const trimmed = value.trim();

    if (!trimmed) {
      return;
    }

    const weeklyRequest =
      isWeeklyPlanningRequest(trimmed);

    const contentRequest =
      isContentRequest(trimmed);

    let assistantMessage;

    if (weeklyRequest) {
      const plan =
        buildWeeklyPlan(recommendations);

      assistantMessage = {
        type: "weekly",
        text:
          "I interpreted this as a planning request, not as a request for one generic post. I used the current recommendation portfolio to build the content plan for the available planning window.",
        plan,
      };
    } else if (contentRequest) {
      const related =
        findRelatedRecords(
          trimmed,
          recommendations
        );

      const sourceRecord =
        related[0] || null;

      const content = generateContent(
        trimmed,
        sourceRecord
      );

      assistantMessage = {
        type: "content",
        text:
          "I created the requested content and used related Zuva intelligence where available. This request is not restricted to the weekly calendar.",
        content,
        records: related,
      };
    } else {
      const related =
        findRelatedRecords(
          trimmed,
          recommendations
        );

      assistantMessage = {
        type: "analysis",
        text:
          related.length > 0
            ? "I found related intelligence in the currently loaded dataset."
            : "This question is not restricted to the weekly calendar. The broader intelligence API will be connected here so questions can be answered from the full historical and current-world intelligence layer.",
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
          Explore Zuva Life's social intelligence,
          request content, analyse historical
          evidence, explore current signals, build
          weekly plans, or ask strategic questions.
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
                onClick={() =>
                  answerQuestion(example)
                }
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="chat-messages">
        {messages.map(
          (message, index) => (
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

              {message.role ===
                "assistant" &&
                message.type ===
                  "weekly" &&
                message.plan && (
                  <WeeklyPlanResult
                    plan={message.plan}
                  />
                )}

              {message.role ===
                "assistant" &&
                message.type ===
                  "content" &&
                message.content && (
                  <ContentResult
                    content={
                      message.content
                    }
                    relatedRecords={
                      message.records
                    }
                  />
                )}

              {message.role ===
                "assistant" &&
                message.type ===
                  "analysis" &&
                message.records?.length >
                  0 && (
                  <section className="intelligence-related">
                    <div className="detail-label">
                      Related Intelligence
                    </div>

                    {message.records.map(
                      (record) => (
                        <div
                          className="intelligence-record"
                          key={
                            record.production_id_v1 ||
                            record.recommendation_rank_v1
                          }
                        >
                          <strong>
                            {
                              record.hook_v1
                            }
                          </strong>

                          <span>
                            {
                              record.theme
                            }{" "}
                            ·{" "}
                            {
                              record.platform
                            }{" "}
                            ·{" "}
                            {
                              record.content_type
                            }
                          </span>
                        </div>
                      )
                    )}
                  </section>
                )}
            </div>
          )
        )}
      </div>

      <div className="chat-composer">
        <textarea
          value={question}
          onChange={(event) =>
            setQuestion(
              event.target.value
            )
          }
          onKeyDown={(event) => {
            if (
              event.key ===
                "Enter" &&
              !event.shiftKey
            ) {
              event.preventDefault();

              answerQuestion(
                question
              );
            }
          }}
          placeholder="Ask anything about Zuva social intelligence..."
          aria-label="Ask Social Intelligence"
        />

        <button
          type="button"
          className="chat-send"
          onClick={() =>
            answerQuestion(question)
          }
        >
          <ArrowUp size={17} />
          Ask
        </button>
      </div>
    </div>
  );
}