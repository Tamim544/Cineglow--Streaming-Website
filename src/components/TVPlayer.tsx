"use client";

import { useState, useEffect } from "react";

interface TVPlayerProps {
  tvId: number;
  title: string;
  season: number;
  episode: number;
  totalEpisodesInSeason?: number;
  onEpisodeChange?: (season: number, episode: number) => void;
}

const servers = [
  {
    name: "Server 1 (AutoEmbed)",
    url: (id: number, s: number, e: number) => `https://autoembed.co/tv/tmdb/${id}-${s}-${e}`,
  },
  {
    name: "Server 2 (VidSrc.pm)",
    url: (id: number, s: number, e: number) => `https://vidsrc.pm/embed/tv?tmdb=${id}&season=${s}&episode=${e}`,
  },
  {
    name: "Server 3 (2Embed)",
    url: (id: number, s: number, e: number) => `https://2embed.skin/embedtv/${id}&s=${s}&e=${e}`,
  },
  {
    name: "Server 4 (VidSrc.me)",
    url: (id: number, s: number, e: number) => `https://vidsrc.me/embed/tv?tmdb=${id}&season=${s}&episode=${e}`,
  },
  {
    name: "Server 5 (VidSrc.to)",
    url: (id: number, s: number, e: number) => `https://vidsrc.to/embed/tv/${id}/${s}/${e}`,
  },
];

export default function TVPlayer({
  tvId,
  title,
  season,
  episode,
  totalEpisodesInSeason = 1,
  onEpisodeChange,
}: TVPlayerProps) {
  const [activeServer, setActiveServer] = useState(0);
  const [cinemaMode, setCinemaMode] = useState(false);

  // Save to "Continue Watching" history in localStorage
  useEffect(() => {
    try {
      const historyItem = {
        id: tvId,
        title,
        season,
        episode,
        updatedAt: Date.now(),
      };
      const stored = localStorage.getItem("cineglow_continue_watching");
      let list = stored ? JSON.parse(stored) : [];
      list = list.filter((item: any) => item.id !== tvId);
      list.unshift(historyItem);
      localStorage.setItem("cineglow_continue_watching", JSON.stringify(list.slice(0, 20)));
    } catch (e) {
      console.error("Failed to save continue watching history", e);
    }
  }, [tvId, title, season, episode]);

  const handlePrev = () => {
    if (episode > 1 && onEpisodeChange) {
      onEpisodeChange(season, episode - 1);
    }
  };

  const handleNext = () => {
    if (episode < totalEpisodesInSeason && onEpisodeChange) {
      onEpisodeChange(season, episode + 1);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        transition: "all 0.3s ease",
        maxWidth: cinemaMode ? "1400px" : "100%",
        margin: "0 auto",
        width: "100%",
      }}
    >
      {/* Top Bar: Server Controls & Cinema Mode */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "0.75rem",
        }}
      >
        {/* Server Switcher */}
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          {servers.map((server, index) => (
            <button
              key={index}
              onClick={() => setActiveServer(index)}
              className={`btn ${activeServer === index ? "btn-primary" : "btn-secondary"}`}
              style={{
                padding: "0.4rem 0.8rem",
                fontSize: "0.85rem",
                background: activeServer === index ? "var(--accent)" : "rgba(255,255,255,0.08)",
                borderColor: activeServer === index ? "var(--accent)" : "transparent",
                color: "#fff",
                borderRadius: "var(--radius-sm)",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              {server.name}
            </button>
          ))}
        </div>

        {/* Cinema Mode */}
        <button
          onClick={() => setCinemaMode(!cinemaMode)}
          className="btn btn-secondary"
          style={{
            padding: "0.4rem 0.8rem",
            fontSize: "0.85rem",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
            background: cinemaMode ? "var(--accent)" : "rgba(255,255,255,0.08)",
            color: "#fff",
          }}
          title="Toggle Cinema Theater Mode"
        >
          <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm2 2v8h10V6H5z" clipRule="evenodd" />
          </svg>
          {cinemaMode ? "Exit Theater" : "Theater Mode"}
        </button>
      </div>

      {/* Video Frame */}
      <div
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "16/9",
          background: "#000",
          borderRadius: "var(--radius-md)",
          overflow: "hidden",
          boxShadow: cinemaMode ? "0 0 50px rgba(0,0,0,0.9)" : "var(--card-shadow)",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <iframe
          key={`${activeServer}-${season}-${episode}`}
          src={servers[activeServer].url(tvId, season, episode)}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            border: 0,
          }}
          allowFullScreen
          title={`Playing Season ${season} Episode ${episode}`}
        />
      </div>



      {/* Episode Navigation Bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "rgba(255, 255, 255, 0.05)",
          padding: "0.75rem 1rem",
          borderRadius: "var(--radius-sm)",
          backdropFilter: "blur(10px)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ fontWeight: 600, color: "var(--accent)" }}>
            Season {season}, Episode {episode}
          </span>
          <span style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>
            (Total {totalEpisodesInSeason} episodes)
          </span>
        </div>

        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button
            onClick={handlePrev}
            disabled={episode <= 1}
            className="btn btn-secondary"
            style={{
              padding: "0.4rem 0.8rem",
              fontSize: "0.85rem",
              opacity: episode <= 1 ? 0.5 : 1,
              cursor: episode <= 1 ? "not-allowed" : "pointer",
            }}
          >
            ← Previous Ep
          </button>
          <button
            onClick={handleNext}
            disabled={episode >= totalEpisodesInSeason}
            className="btn btn-primary"
            style={{
              padding: "0.4rem 0.8rem",
              fontSize: "0.85rem",
              opacity: episode >= totalEpisodesInSeason ? 0.5 : 1,
              cursor: episode >= totalEpisodesInSeason ? "not-allowed" : "pointer",
            }}
          >
            Next Ep →
          </button>
        </div>
      </div>

      <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", textAlign: "center" }}>
        If an episode is buffering or shows an error, switch to another Server above.
      </p>
    </div>
  );
}
