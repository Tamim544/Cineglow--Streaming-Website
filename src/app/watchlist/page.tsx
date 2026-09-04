"use client";

import { useState, useEffect } from "react";
import MovieCard from "@/components/MovieCard";
import Link from "next/link";
import { WatchlistItem } from "@/components/WatchlistButton";

interface ContinueWatchingItem {
  id: number;
  title: string;
  season: number;
  episode: number;
  updatedAt: number;
}

export default function WatchlistPage() {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [continueWatching, setContinueWatching] = useState<ContinueWatchingItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  const loadData = () => {
    try {
      const storedList = localStorage.getItem("cineglow_watchlist");
      if (storedList) {
        setWatchlist(JSON.parse(storedList));
      } else {
        setWatchlist([]);
      }

      const storedHistory = localStorage.getItem("cineglow_continue_watching");
      if (storedHistory) {
        setContinueWatching(JSON.parse(storedHistory));
      } else {
        setContinueWatching([]);
      }
    } catch (e) {
      console.error("Failed to parse watchlist", e);
    } finally {
      setLoaded(true);
    }
  };

  useEffect(() => {
    loadData();
    window.addEventListener("watchlistUpdated", loadData);
    return () => window.removeEventListener("watchlistUpdated", loadData);
  }, []);

  const clearWatchlist = () => {
    if (confirm("Are you sure you want to clear your entire watchlist?")) {
      localStorage.removeItem("cineglow_watchlist");
      setWatchlist([]);
      window.dispatchEvent(new Event("watchlistUpdated"));
    }
  };

  const clearHistory = () => {
    localStorage.removeItem("cineglow_continue_watching");
    setContinueWatching([]);
  };

  if (!loaded) {
    return (
      <div style={{ paddingTop: "120px", textAlign: "center", minHeight: "80vh" }}>
        <p style={{ color: "var(--text-secondary)" }}>Loading your library...</p>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: "80px", minHeight: "80vh" }}>
      <div className="container" style={{ marginTop: "3rem", marginBottom: "5rem" }}>
        
        {/* Continue Watching Section (if any) */}
        {continueWatching.length > 0 && (
          <div style={{ marginBottom: "4rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <div>
                <h2 className="heading-md" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span>⏳</span> Continue Watching
                </h2>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
                  Pick up right where you left off
                </p>
              </div>
              <button
                onClick={clearHistory}
                className="btn btn-secondary"
                style={{ padding: "0.4rem 0.8rem", fontSize: "0.8rem" }}
              >
                Clear History
              </button>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                gap: "1.25rem",
              }}
            >
              {continueWatching.map((item) => (
                <Link
                  key={item.id}
                  href={`/tv/${item.id}?s=${item.season}&e=${item.episode}#player`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <div
                    className="glass-card"
                    style={{
                      padding: "1.25rem",
                      borderRadius: "var(--radius-md)",
                      border: "1px solid rgba(99, 102, 241, 0.3)",
                      background: "rgba(99, 102, 241, 0.08)",
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.5rem",
                      cursor: "pointer",
                      transition: "transform 0.2s ease, border-color 0.2s ease",
                    }}
                  >
                    <div style={{ fontWeight: 600, fontSize: "1rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {item.title}
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ color: "var(--accent)", fontSize: "0.85rem", fontWeight: 700 }}>
                        Season {item.season} • Episode {item.episode}
                      </span>
                      <span className="btn btn-primary" style={{ padding: "0.25rem 0.75rem", fontSize: "0.75rem" }}>
                        Resume ▶
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Watchlist Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: "2.5rem",
            flexWrap: "wrap",
            gap: "1rem",
            borderBottom: "1px solid rgba(255,255,255,0.1)",
            paddingBottom: "1.5rem",
          }}
        >
          <div>
            <h1 className="heading-xl" style={{ marginBottom: "0.5rem" }}>
              My <span className="text-gradient">Watchlist</span>
            </h1>
            <p style={{ color: "var(--text-secondary)" }}>
              {watchlist.length} {watchlist.length === 1 ? "title" : "titles"} saved to your personal library
            </p>
          </div>

          {watchlist.length > 0 && (
            <button
              onClick={clearWatchlist}
              className="btn btn-secondary"
              style={{ padding: "0.5rem 1rem", fontSize: "0.85rem", color: "#f87171" }}
            >
              Clear Watchlist
            </button>
          )}
        </div>

        {/* Watchlist Content */}
        {watchlist.length > 0 ? (
          <div className="media-grid">
            {watchlist.map((item) => (
              <MovieCard
                key={`${item.mediaType}-${item.id}`}
                id={item.id}
                title={item.title}
                posterPath={item.posterPath}
                rating={item.rating}
                year={item.year}
                mediaType={item.mediaType}
                badge={item.mediaType === "tv" ? "SERIES" : "MOVIE"}
              />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "5rem 0", color: "var(--text-secondary)" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🎬</div>
            <h2 className="heading-md" style={{ marginBottom: "0.75rem" }}>Your watchlist is empty</h2>
            <p style={{ maxWidth: "400px", margin: "0 auto 2rem", fontSize: "0.95rem" }}>
              Explore movies and Korean dramas, then click the bookmark icon or "Add to Watchlist" to save them here.
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
              <Link href="/browse" className="btn btn-primary">
                Browse Movies
              </Link>
              <Link href="/kdramas" className="btn btn-secondary">
                Browse K-Dramas
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
