import React from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  Image as ImageIcon,
} from "lucide-react";

function formatHour(hour) {
  const numericHour = Number(hour);

  if (!Number.isFinite(numericHour)) {
    return "—";
  }

  const suffix = numericHour >= 12 ? "PM" : "AM";
  const displayHour = numericHour % 12 || 12;

  return `${displayHour}:00 ${suffix}`;
}

export default function PostDetail({
  recommendation,
  onBack,
}) {
  if (!recommendation) {
    return (
      <div className="empty-state">
        <h3>No recommendation selected</h3>
        <p>Select a recommendation to view its details.</p>
      </div>
    );
  }

  const structure =
    recommendation.content_structure || null;

  const slides =
    Array.isArray(structure?.slides)
      ? structure.slides
      : Array.isArray(recommendation.slides)
        ? recommendation.slides
        : [];

  const isCarousel =
    String(recommendation.content_type || "")
      .toLowerCase()
      .includes("carousel");

  return (
    <div className="detail-page">
      <button
        type="button"
        className="back-button"
        onClick={onBack}
      >
        <ArrowLeft size={16} />
        Back to recommendations
      </button>

      <div className="detail-layout">
        <main className="detail-main">
          <div className="detail-label">
            Recommendation #{recommendation.recommendation_rank_v1}
          </div>

          <h1 className="detail-title">
            {recommendation.hook_v1}
          </h1>

          <div className="detail-meta-row">
            <span>{recommendation.platform}</span>
            <span>·</span>
            <span>{recommendation.content_type}</span>
            <span>·</span>
            <span>{recommendation.theme}</span>
          </div>

          {isCarousel && slides.length > 0 ? (
            <section className="detail-section">
              <div className="detail-section-heading">
                <div>
                  <div className="detail-label">
                    Production Content
                  </div>

                  <h2>Carousel Slides</h2>
                </div>

                <div className="slide-count">
                  {slides.length} slides
                </div>
              </div>

              <div className="carousel-slides">
                {slides.map((slide, index) => (
                  <article
                    className="carousel-slide"
                    key={
                      slide.slide_number || index
                    }
                  >
                    <div className="slide-number">
                      SLIDE{" "}
                      {slide.slide_number || index + 1}
                    </div>

                    {slide.title && (
                      <h3 className="slide-title">
                        {slide.title}
                      </h3>
                    )}

                    {slide.body && (
                      <p className="slide-body">
                        {slide.body}
                      </p>
                    )}

                    {slide.visual_direction && (
                      <div className="slide-visual">
                        <ImageIcon size={14} />
                        {slide.visual_direction}
                      </div>
                    )}
                  </article>
                ))}
              </div>
            </section>
          ) : (
            <section className="detail-section">
              <div className="detail-label">
                Production Content
              </div>

              <h2>Post Copy</h2>

              <p className="large-copy">
                {recommendation.caption_v1 ||
                  recommendation.hook_v1}
              </p>
            </section>
          )}

          <section className="detail-section">
            <div className="detail-label">Caption</div>

            <h2>Social Caption</h2>

            <p className="large-copy">
              {recommendation.caption_v1 || "No caption available."}
            </p>
          </section>

          <section className="detail-section">
            <div className="detail-label">Call to Action</div>

            <h2>CTA</h2>

            <p className="large-copy">
              {recommendation.cta_v1 || "No CTA available."}
            </p>
          </section>

          <section className="detail-section">
            <div className="detail-label">
              Creative Direction
            </div>

            <h2>Creative Direction</h2>

            <p className="large-copy">
              {recommendation.creative_direction_v1 ||
                "No creative direction available."}
            </p>
          </section>
        </main>

        <aside className="detail-sidebar">
          <div className="detail-sidebar-heading">
            Recommendation Intelligence
          </div>

          <div className="detail-stat">
            <span className="detail-stat-label">
              Opportunity Score
            </span>

            <strong className="detail-score">
              {Number(
                recommendation.final_opportunity_score_v3 || 0
              ).toFixed(2)}
            </strong>
          </div>

          <div className="detail-stat">
            <span className="detail-stat-label">
              Platform
            </span>

            <strong>{recommendation.platform}</strong>
          </div>

          <div className="detail-stat">
            <span className="detail-stat-label">
              Publishing Time
            </span>

            <strong>
              <Clock3 size={14} />
              {formatHour(recommendation.hour)}
            </strong>
          </div>

          <div className="detail-stat">
            <span className="detail-stat-label">
              Evidence Strength
            </span>

            <strong>
              {(
                Number(
                  recommendation
                    .historical_evidence_strength_v3 || 0
                ) * 100
              ).toFixed(0)}
              %
            </strong>
          </div>

          <div className="detail-stat">
            <span className="detail-stat-label">
              Evidence Coverage
            </span>

            <strong>
              {(
                Number(
                  recommendation
                    .historical_evidence_coverage_v3 || 0
                ) * 100
              ).toFixed(0)}
              %
            </strong>
          </div>

          <div className="detail-stat">
            <span className="detail-stat-label">
              QA Status
            </span>

            <strong className="qa-value">
              <CheckCircle2 size={14} />
              {recommendation.qa_status || "UNKNOWN"}
            </strong>
          </div>
        </aside>
      </div>
    </div>
  );
}