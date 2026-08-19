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

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        {servers.map((server, index) => (
          <button
            key={index}
            onClick={() => setActiveServer(index)}
            className={`btn ${activeServer === index ? "btn-primary" : "btn-secondary"}`}
            style={{
              padding: "0.5rem 1rem",
              fontSize: "0.9rem",
              background: activeServer === index ? "var(--accent)" : "rgba(255,255,255,0.1)",
              borderColor: activeServer === index ? "var(--accent)" : "transparent",
              color: "#fff",
              borderRadius: "var(--radius-sm)",
              cursor: "pointer",
              transition: "all 0.2s"
            }}
          >
            {server.name}
          </button>
        ))}
      </div>
      
      <div style={{ position: "relative", width: "100%", paddingBottom: "56.25%", background: "#000", borderRadius: "var(--radius-md)", overflow: "hidden", boxShadow: "var(--card-shadow)" }}>
        <iframe 
          src={servers[activeServer].url(movieId)}
          style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: 0 }}
          allowFullScreen
          title="Movie Player"
        />
      </div>
      
      <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", textAlign: "center" }}>
        If a server is loading infinitely or shows an error, please try selecting a different server from the buttons above.
      </p>
    </div>
  );
}
