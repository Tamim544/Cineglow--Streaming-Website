"use client";

import { useState } from "react";
import styles from "./Player.module.css";

interface MoviePlayerProps {
  movieId: number;
}

const servers = [
  {
    name: "Server 1 (AutoEmbed)",
    url: (id: number) => `https://autoembed.co/movie/tmdb/${id}`,
  },
  {
    name: "Server 2 (VidSrc.pm)",
    url: (id: number) => `https://vidsrc.pm/embed/movie?tmdb=${id}`,
  },
  {
    name: "Server 3 (2Embed)",
    url: (id: number) => `https://2embed.skin/embed/${id}`,
  },
  {
    name: "Server 4 (VidSrc.me)",
    url: (id: number) => `https://vidsrc.me/embed/movie?tmdb=${id}`,
  },
  {
    name: "Server 5 (VidSrc.to)",
    url: (id: number) => `https://vidsrc.to/embed/movie/${id}`,
  },
];

export default function MoviePlayer({ movieId }: MoviePlayerProps) {
  const [activeServer, setActiveServer] = useState(0);
  const [cinemaMode, setCinemaMode] = useState(false);

  return (
    <>
      {cinemaMode && (
        <div
          className={styles.cinemaBackdrop}
          onClick={() => setCinemaMode(false)}
          title="Click to exit theater mode"
        />
      )}
      <div className={`${styles.playerWrapper} ${cinemaMode ? styles.playerWrapperTheater : ""}`}>
        {/* Top Bar: Server Controls & Cinema Mode */}
        <div className={styles.controlsBar}>
          <div className={styles.serversList}>
            {servers.map((server, index) => (
              <button
                key={index}
                onClick={() => setActiveServer(index)}
                className={`${styles.serverBtn} ${activeServer === index ? styles.serverBtnActive : ""}`}
              >
                {server.name}
              </button>
            ))}
          </div>

          {/* Theater Mode (Hidden on mobile via styles.theaterBtn) */}
          <button
            onClick={() => setCinemaMode(!cinemaMode)}
            className={`${styles.theaterBtn} ${cinemaMode ? styles.theaterBtnActive : ""}`}
            title={cinemaMode ? "Exit Theater Mode" : "Expand to Cinema Theater Mode"}
          >
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm2 2v8h10V6H5z" clipRule="evenodd" />
            </svg>
            <span>{cinemaMode ? "Exit Theater" : "Theater Mode"}</span>
          </button>
        </div>
        
        {/* Video Frame */}
        <div className={`${styles.videoFrame} ${cinemaMode ? styles.videoFrameTheater : ""}`}>
          <iframe 
            key={`${activeServer}-${movieId}`}
            src={servers[activeServer].url(movieId)}
            style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: 0 }}
            allowFullScreen
            title="Movie Player"
          />
        </div>
        
        <p style={{ color: "var(--text-muted)", fontSize: "0.82rem", textAlign: "center" }}>
          If a server is buffering or shows an error, please try selecting a different server above.
        </p>
      </div>
    </>
  );
}
