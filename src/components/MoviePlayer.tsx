"use client";

import { useState } from "react";

interface MoviePlayerProps {
  movieId: number;
}

const servers = [
  {
    name: "Server 1 (VidSrc.me)",
    url: (id: number) => `https://vidsrc.me/embed/movie?tmdb=${id}`,
  },
  {
    name: "Server 2 (VidSrc.to)",
    url: (id: number) => `https://vidsrc.to/embed/movie/${id}`,
  },
  {
    name: "Server 3 (VidSrc.cc)",
    url: (id: number) => `https://vidsrc.cc/v2/embed/movie/${id}`,
  },
  {
    name: "Server 4 (VidSrc.pro)",
    url: (id: number) => `https://vidsrc.pro/embed/movie/${id}`,
  },
  {
    name: "Server 5 (Embed.su)",
    url: (id: number) => `https://embed.su/embed/movie/${id}`,
  }
];

export default function MoviePlayer({ movieId }: MoviePlayerProps) {
  const [activeServer, setActiveServer] = useState(0);
  const [cinemaMode, setCinemaMode] = useState(false);

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
          key={`${activeServer}-${movieId}`}
          src={servers[activeServer].url(movieId)}
          style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: 0 }}
          allowFullScreen
          allow="autoplay; fullscreen; picture-in-picture"
          title="Movie Player"
        />
      </div>
      
      <p style={{ color: "var(--text-muted)", fontSize: "0.82rem", textAlign: "center" }}>
        If a server is buffering or shows an error, please try selecting a different server above.
      </p>
    </div>
  );
}


