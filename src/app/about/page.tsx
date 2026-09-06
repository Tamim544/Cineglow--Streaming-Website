"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./About.module.css";

const categories = [
  { id: "general", label: "💬 General Feedback", title: "General Feedback" },
  { id: "server", label: "⚠️ Broken Stream / Server Issue", title: "Streaming / Server Issue" },
  { id: "request", label: "🎬 Movie / Series Request", title: "Content Request" },
  { id: "feature", label: "💡 Feature Suggestion", title: "Feature Suggestion" },
];

export default function AboutPage() {
  const [activeCategory, setActiveCategory] = useState("general");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      return;
    }

    setSubmitting(true);
    // Simulate interactive submission
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 600);
  };

  const handleReset = () => {
    setSubmitted(false);
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className={styles.aboutWrapper}>
      {/* Background ambient lighting */}
      <div className={styles.bgGlowPurple} />
      <div className={styles.bgGlowIndigo} />

      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.badge}>
          <span className={styles.badgeDot} />
          About CineGlow
        </div>
        <h1 className={styles.heroTitle}>
          Crafted for <span className={styles.heroGradient}>True Cinephiles</span>
        </h1>
        <p className={styles.heroSubtitle}>
          CineGlow is an ultra-fast, modern streaming portal built to deliver seamless,
          ad-free access to the world’s greatest movies, trending series, anime, and Korean dramas.
        </p>
      </section>

      {/* Creator Spotlight */}
      <section className={styles.creatorSection}>
        <div className={styles.creatorCard}>
          <div className={styles.creatorAvatarWrap}>
            <div className={styles.avatarRing}>
              <div className={styles.avatarInner}>TC</div>
            </div>
            <span className={styles.creatorRoleBadge}>Creator & Lead Dev</span>
          </div>

          <div className={styles.creatorContent}>
            <h2 className={styles.creatorName}>Tamim Chowdhury</h2>
            <p className={styles.creatorBio}>
              Full-Stack Developer passionate about designing fast, sleek, and intuitive digital
              experiences. Created CineGlow from the ground up to solve the clutter of traditional streaming
              sites—combining high-performance architecture, edge-to-edge theater immersion, and real-time catalog indexing.
            </p>

            <div className={styles.stackList}>
              <span className={styles.stackTag}>Next.js 15+</span>
              <span className={styles.stackTag}>React 19</span>
              <span className={styles.stackTag}>TypeScript</span>
              <span className={styles.stackTag}>REST APIs</span>
              <span className={styles.stackTag}>Modern CSS Modules</span>
              <span className={styles.stackTag}>Turbopack</span>
              <span className={styles.stackTag}>Vercel</span>
            </div>

            <div className={styles.creatorActions}>
              <a
                href="https://github.com/Tamim544"
                target="_blank"
                rel="noreferrer"
                className={`${styles.actionBtn} ${styles.actionBtnPrimary}`}
              >
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>GitHub @Tamim544</span>
              </a>

              <a
                href="mailto:cloudcipher.io@gmail.com"
                className={`${styles.actionBtn} ${styles.actionBtnSecondary}`}
              >
                <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <span>Email Developer</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Features Grid */}
      <section className={styles.featuresSection}>
        <h2 className={styles.sectionHeading}>Why CineGlow?</h2>
        <p className={styles.sectionSub}>Engineered for pure cinematic enjoyment.</p>

        <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🎬</div>
            <h3 className={styles.featureTitle}>Vast Entertainment Library</h3>
            <p className={styles.featureDesc}>
              Instant search and discovery across thousands of movies, TV shows, anime, and Korean dramas
              continuously updated with global releases.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>⚡</div>
            <h3 className={styles.featureTitle}>Multi-Server Redundancy</h3>
            <p className={styles.featureDesc}>
              5 dynamic streaming engines (AutoEmbed, VidSrc, 2Embed) ensure uninterrupted playback with instant one-click switching.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🌌</div>
            <h3 className={styles.featureTitle}>True Theater Mode</h3>
            <p className={styles.featureDesc}>
              Desktop edge-to-edge cinema expansion with ambient purple lighting and lights-off background dimming.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🔖</div>
            <h3 className={styles.featureTitle}>Privacy-First Watchlist</h3>
            <p className={styles.featureDesc}>
              Save favorite movies and series directly on your browser without required logins or tracking.
            </p>
          </div>
        </div>
      </section>

      {/* Contact & Feedback Section */}
      <section id="contact" className={styles.contactSection}>
        {/* Contact Info Card */}
        <div className={styles.contactInfoCard}>
          <div>
            <h2 className={styles.sectionHeading} style={{ fontSize: "1.45rem", marginBottom: "0.5rem" }}>
              Get In Touch
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: 1.6 }}>
              Have feedback, a feature idea, or discovered a broken streaming link?
              Reach out directly or send a message using the form.
            </p>
          </div>

          <div className={styles.infoItem}>
            <div className={styles.infoIconWrap}>
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div>
              <div className={styles.infoLabel}>Direct Email</div>
              <div className={styles.infoValue}>
                <a href="mailto:cloudcipher.io@gmail.com">cloudcipher.io@gmail.com</a>
              </div>
            </div>
          </div>

          <div className={styles.infoItem}>
            <div className={styles.infoIconWrap}>
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <path
                  fillRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div>
              <div className={styles.infoLabel}>Developer GitHub</div>
              <div className={styles.infoValue}>
                <a href="https://github.com/Tamim544" target="_blank" rel="noreferrer">
                  github.com/Tamim544
                </a>
              </div>
            </div>
          </div>

          <div className={styles.infoItem}>
            <div className={styles.infoIconWrap}>
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <div className={styles.infoLabel}>Response Time</div>
              <div className={styles.infoValue}>Within 24 Hours</div>
            </div>
          </div>
        </div>

        {/* Contact / Feedback Form */}
        <div className={styles.formCard}>
          <h2 className={styles.sectionHeading} style={{ fontSize: "1.45rem", marginBottom: "0.5rem" }}>
            Send a Message
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginBottom: "1.25rem" }}>
            Select a topic and let us know your thoughts or requests.
          </p>

          {submitted ? (
            <div className={styles.successAlert}>
              <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🎉</div>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "0.5rem", color: "#ffffff" }}>
                Thank You, {formData.name}!
              </h3>
              <p style={{ fontSize: "0.95rem", color: "#dcfce7", lineHeight: 1.6, marginBottom: "1.25rem" }}>
                Your message regarding <strong>{categories.find((c) => c.id === activeCategory)?.title}</strong> has
                been received. We will follow up at <strong>{formData.email}</strong> if needed.
              </p>
              <button onClick={handleReset} className={styles.actionBtnSecondary} style={{ padding: "0.5rem 1rem", fontSize: "0.85rem", borderRadius: "6px" }}>
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* Category Pills */}
              <div className={styles.categoryPills}>
                {categories.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setActiveCategory(c.id)}
                    className={`${styles.categoryPill} ${activeCategory === c.id ? styles.categoryPillActive : ""}`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Your Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Smith"
                  className={styles.formInput}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. alex@example.com"
                  className={styles.formInput}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Message or Details</label>
                <textarea
                  required
                  placeholder="Describe your suggestion, the movie or drama you'd like to request, or report a broken server..."
                  className={styles.formTextarea}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
              </div>

              <button type="submit" disabled={submitting} className={styles.submitBtn}>
                {submitting ? (
                  <span>Sending Message...</span>
                ) : (
                  <>
                    <span>Send Message</span>
                    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Disclaimer Box */}
      <section className={styles.disclaimerBox}>
        <div className={styles.disclaimerTitle}>Legal & Content Disclaimer</div>
        <p>
          CineGlow does not host, store, or upload any video files on its servers. All media streams are provided by
          unaffiliated third-party servers. All trademarks, images, and media information belong to their respective owners and
          are displayed for informational and entertainment purposes only.
        </p>
      </section>
    </div>
  );
}
