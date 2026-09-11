import React, {
  useState,
} from "react";
import {
  Send,
  Sparkles,
} from "lucide-react";

export default function IntelligenceChat({
  recommendations = [],
}) {
  const [message, setMessage] =
    useState("");

  const [messages, setMessages] =
    useState([
      {
        id: 1,
        role: "assistant",
        text:
          "I’m ready to help with your social intelligence. Ask about recommendations, content, themes, platforms, evidence, timing, or strategy.",
      },
    ]);

  function submitMessage(
    event
  ) {
    event.preventDefault();

    const value =
      message.trim();

    if (!value) {
      return;
    }

    const userMessage = {
      id:
        Date.now(),
      role: "user",
      text: value,
    };

    const assistantMessage = {
      id:
        Date.now() + 1,
      role: "assistant",
      text:
        `I’ve received your question. The current portfolio contains ${recommendations.length} recommendations. The production intelligence backend will provide the full model-backed answer here.`,
    };

    setMessages(
      (current) => [
        ...current,
        userMessage,
        assistantMessage,
      ]
    );

    setMessage("");
  }

  return (
    <section className="intelligence-page">
      <div className="intelligence-header">
        <div className="page-kicker">
          SOCIAL INTELLIGENCE
        </div>

        <h1>
          Ask anything.
        </h1>

        <p>
          Explore recommendations,
          evidence, content,
          trends, platforms and
          strategy.
        </p>
      </div>

      <div className="intelligence-chat">
        <div className="chat-messages">
          {messages.map(
            (item) => (
              <div
                key={item.id}
                className={`chat-message ${item.role}`}
              >
                {item.role ===
                  "assistant" && (
                  <div className="chat-message-icon">
                    <Sparkles
                      size={15}
                    />
                  </div>
                )}

                <div className="chat-message-content">
                  {item.text}
                </div>
              </div>
            )
          )}
        </div>

        <form
          className="chat-input-area"
          onSubmit={
            submitMessage
          }
        >
          <textarea
            className="chat-input"
            value={message}
            onChange={(event) =>
              setMessage(
                event.target.value
              )
            }
            placeholder="Ask Social Intelligence..."
            rows={1}
          />

          <button
            type="submit"
            className="primary-button chat-send"
          >
            <Send
              size={16}
              strokeWidth={1.9}
            />

            Send
          </button>
        </form>
      </div>
    </section>
  );
}