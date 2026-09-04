"use client";

import { useState, useEffect } from "react";

export interface WatchlistItem {
  id: number;
  title: string;
  posterPath: string | null;
  rating: number;
  year: string;
  mediaType: "movie" | "tv";
}

interface WatchlistButtonProps {
  item: WatchlistItem;
  compact?: boolean;
}

export default function WatchlistButton({ item, compact = false }: WatchlistButtonProps) {
  const [inWatchlist, setInWatchlist] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("cineglow_watchlist");
      if (stored) {
        const list: WatchlistItem[] = JSON.parse(stored);
        setInWatchlist(list.some((i) => i.id === item.id && i.mediaType === item.mediaType));
      }
    } catch (e) {
      console.error("Failed to read watchlist from localStorage", e);
    }
  }, [item.id, item.mediaType]);

  const toggleWatchlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const stored = localStorage.getItem("cineglow_watchlist");
      let list: WatchlistItem[] = stored ? JSON.parse(stored) : [];

      if (inWatchlist) {
        list = list.filter((i) => !(i.id === item.id && i.mediaType === item.mediaType));
        setInWatchlist(false);
      } else {
        list.unshift(item);
        setInWatchlist(true);
      }

      localStorage.setItem("cineglow_watchlist", JSON.stringify(list));
      window.dispatchEvent(new Event("watchlistUpdated"));
    } catch (e) {
      console.error("Failed to update watchlist in localStorage", e);
    }
  };

  if (compact) {
    return (
      <button
        onClick={toggleWatchlist}
        title={inWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
        style={{
          background: inWatchlist ? "var(--accent)" : "rgba(0,0,0,0.6)",
          color: "#fff",
          border: inWatchlist ? "none" : "1px solid rgba(255,255,255,0.2)",
          borderRadius: "50%",
          width: "36px",
          height: "36px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          backdropFilter: "blur(8px)",
          transition: "all 0.2s ease",
          boxShadow: inWatchlist ? "0 0 12px var(--accent)" : "none",
        }}
      >
        <svg width="18" height="18" fill={inWatchlist ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
        </svg>
      </button>
    );
  }

  return (
    <button
      onClick={toggleWatchlist}
      className={`btn ${inWatchlist ? "btn-primary" : "btn-secondary"}`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.5rem",
        background: inWatchlist ? "var(--accent)" : undefined,
        borderColor: inWatchlist ? "var(--accent)" : undefined,
        boxShadow: inWatchlist ? "0 0 15px rgba(99, 102, 241, 0.4)" : undefined,
      }}
    >
      <svg width="20" height="20" fill={inWatchlist ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
      </svg>
      {inWatchlist ? "In Watchlist" : "Add to Watchlist"}
    </button>
  );
}
