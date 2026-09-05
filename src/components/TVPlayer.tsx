"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import styles from "./Player.module.css";

interface TVPlayerProps {
  tvId: number;
  title: string;
  season: number;
  episode: number;
  totalEpisodesInSeason?: number;
  allSeasons?: Array<{
    season_number: number;
    episode_count?: number;
  }>;
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
  allSeasons,
  onEpisodeChange,
}: TVPlayerProps) {
  const router = useRouter();
  const [activeServer, setActiveServer] = useState(0);
  const [cinemaMode, setCinemaMode] = useState(false);

  // Maintain local state for instant response when switching episodes
  const [currentSeason, setCurrentSeason] = useState(season);
  const [currentEpisode, setCurrentEpisode] = useState(episode);
  const navigatingRef = useRef<{ season: number; episode: number } | null>(null);

  // Sync props from server component when navigation completes
  useEffect(() => {
    if (navigatingRef.current) {
      if (navigatingRef.current.season === season && navigatingRef.current.episode === episode) {
        navigatingRef.current = null;
      } else {
        return; // Ignore stale props during active transition
      }
    }
    setCurrentSeason(season);
    setCurrentEpisode(episode);
  }, [season, episode]);

  // Save to "Continue Watching" history in localStorage
  useEffect(() => {
    try {
      const historyItem = {
        id: tvId,
        title,
        season: currentSeason,
        episode: currentEpisode,
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
  }, [tvId, title, currentSeason, currentEpisode]);

  // Determine current season index
  const currentSeasonIndex = allSeasons?.findIndex((s) => s.season_number === currentSeason) ?? -1;

  // Next episode / season logic
  let nextSeason = currentSeason;
  let nextEp = currentEpisode + 1;
  let isNextSeason = false;

  if (nextEp > totalEpisodesInSeason) {
    if (allSeasons && currentSeasonIndex >= 0 && currentSeasonIndex < allSeasons.length - 1) {
      nextSeason = allSeasons[currentSeasonIndex + 1].season_number;
      nextEp = 1;
      isNextSeason = true;
    }
  }

  const hasNext =
    currentEpisode < totalEpisodesInSeason ||
    (allSeasons && currentSeasonIndex >= 0 && currentSeasonIndex < allSeasons.length - 1);

  // Previous episode / season logic
  let prevSeason = currentSeason;
  let prevEp = currentEpisode - 1;
  let isPrevSeason = false;

  if (prevEp < 1) {
    if (allSeasons && currentSeasonIndex > 0) {
      const prevSeasonObj = allSeasons[currentSeasonIndex - 1];
      prevSeason = prevSeasonObj.season_number;
      prevEp = prevSeasonObj.episode_count || 1;
      isPrevSeason = true;
    }
  }

  const hasPrev = currentEpisode > 1 || (allSeasons && currentSeasonIndex > 0);

  const handlePrev = () => {
    if (!hasPrev) return;

    navigatingRef.current = { season: prevSeason, episode: prevEp };
    setCurrentSeason(prevSeason);
    setCurrentEpisode(prevEp);

    // Update URL smoothly without scrolling away
    router.push(`/tv/${tvId}?s=${prevSeason}&e=${prevEp}`, { scroll: false });
    if (onEpisodeChange) {
      onEpisodeChange(prevSeason, prevEp);
    }
  };

  const handleNext = () => {
    if (!hasNext) return;

    navigatingRef.current = { season: nextSeason, episode: nextEp };
    setCurrentSeason(nextSeason);
    setCurrentEpisode(nextEp);

    // Update URL smoothly without scrolling away
    router.push(`/tv/${tvId}?s=${nextSeason}&e=${nextEp}`, { scroll: false });
    if (onEpisodeChange) {
      onEpisodeChange(nextSeason, nextEp);
    }
  };

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
          {/* Server Switcher */}
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

          {/* Cinema Mode Button (Hidden on mobile via styles.theaterBtn) */}
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
            key={`${activeServer}-${currentSeason}-${currentEpisode}`}
            src={servers[activeServer].url(tvId, currentSeason, currentEpisode)}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              border: 0,
            }}
            allowFullScreen
            title={`Playing Season ${currentSeason} Episode ${currentEpisode}`}
          />
        </div>

        {/* Episode Navigation Bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "0.75rem",
            background: "rgba(255, 255, 255, 0.05)",
            padding: "0.85rem 1.15rem",
            borderRadius: "var(--radius-sm)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>
            <span
              style={{
                fontWeight: 700,
                color: "#fff",
                background: "linear-gradient(135deg, #6366f1, #a855f7)",
                padding: "3px 10px",
                borderRadius: "4px",
                fontSize: "0.82rem",
                letterSpacing: "0.3px",
              }}
            >
              PLAYING
            </span>
            <span style={{ fontWeight: 600, color: "var(--text-primary)", fontSize: "0.95rem" }}>
              Season {currentSeason}, Episode {currentEpisode}
            </span>
            <span style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>
              (Total {totalEpisodesInSeason} in Season)
            </span>
          </div>

          <div style={{ display: "flex", gap: "0.6rem", alignItems: "center" }}>
            <button
              onClick={handlePrev}
              disabled={!hasPrev}
              className="btn btn-secondary"
              title={
                hasPrev
                  ? isPrevSeason
                    ? `Go to Season ${prevSeason}, Episode ${prevEp}`
                    : `Previous Episode (${prevEp})`
                  : "No previous episode"
              }
              style={{
                padding: "0.45rem 0.9rem",
                fontSize: "0.85rem",
                opacity: !hasPrev ? 0.4 : 1,
                cursor: !hasPrev ? "not-allowed" : "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                transition: "all 0.2s ease",
              }}
            >
              <svg width="14" height="14" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>{isPrevSeason ? `Prev Season (S${prevSeason})` : "Previous Ep"}</span>
            </button>

            <button
              onClick={handleNext}
              disabled={!hasNext}
              className="btn btn-primary"
              title={
                hasNext
                  ? isNextSeason
                    ? `Go to Season ${nextSeason}, Episode 1`
                    : `Next Episode (${nextEp})`
                  : "No more episodes"
              }
              style={{
                padding: "0.45rem 1rem",
                fontSize: "0.85rem",
                opacity: !hasNext ? 0.4 : 1,
                cursor: !hasNext ? "not-allowed" : "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                background: hasNext ? "linear-gradient(135deg, #6366f1, #8b5cf6)" : undefined,
                borderColor: hasNext ? "#8b5cf6" : undefined,
                boxShadow: hasNext ? "0 0 15px rgba(99, 102, 241, 0.4)" : undefined,
                transition: "all 0.2s ease",
              }}
            >
              <span>{isNextSeason ? `Next Season (S${nextSeason})` : "Next Ep"}</span>
              <svg width="14" height="14" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>

        <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", textAlign: "center" }}>
          If an episode is buffering or shows an error, switch to another Server above.
        </p>
      </div>
    </>
  );
}
