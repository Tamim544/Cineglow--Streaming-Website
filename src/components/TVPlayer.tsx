"use client";

import { useState, useEffect, useRef, useCallback } from "react";
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
    url: (id: number, s: number, e: number) => `https://player.autoembed.co/embed/tv/${id}/${s}/${e}`,
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
    name: "Server 4 (VidSrc.su)",
    url: (id: number, s: number, e: number) => `https://vidsrc.su/embed/tv/${id}/${s}/${e}`,
  },
  {
    name: "Server 5 (VidSrc.me)",
    url: (id: number, s: number, e: number) => `https://vidsrc.me/embed/tv?tmdb=${id}&season=${s}&episode=${e}`,
  },
  {
    name: "Server 6 (Frembed)",
    url: (id: number, s: number, e: number) => `https://frembed.live/api/serie.php?id=${id}&sa=${s}&epi=${e}`,
  },
  {
    name: "Server 7 (Videasy)",
    url: (id: number, s: number, e: number) => `https://player.videasy.net/tv/${id}/${s}/${e}`,
  },
  {
    name: "Server 8 (Vidora)",
    url: (id: number, s: number, e: number) => `https://vidora.online/embed/tv/${id}/${s}/${e}`,
  },
];

type ZoomMode = "fit" | "fill";

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
  const [zoomMode, setZoomMode] = useState<ZoomMode>("fit");
  const [zoomLevel, setZoomLevel] = useState(1.0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isLandscape, setIsLandscape] = useState(false);
  const [iframeLoading, setIframeLoading] = useState(true);

  // Maintain local state for instant response when switching episodes
  const [currentSeason, setCurrentSeason] = useState(season);
  const [currentEpisode, setCurrentEpisode] = useState(episode);
  const navigatingRef = useRef<{ season: number; episode: number } | null>(null);

  // Reset loading state when server, show, season, or episode changes
  useEffect(() => {
    setIframeLoading(true);
    const timer = setTimeout(() => {
      setIframeLoading(false);
    }, 7000);
    return () => clearTimeout(timer);
  }, [activeServer, tvId, currentSeason, currentEpisode]);

  const playerRef = useRef<HTMLDivElement>(null);
  const toastTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastTapRef = useRef<number>(0);
  const pinchStartDistRef = useRef<number>(0);
  const pinchStartZoomRef = useRef<number>(1.0);

  // Sync props from server component when navigation completes
  useEffect(() => {
    if (navigatingRef.current) {
      if (navigatingRef.current.season === season && navigatingRef.current.episode === episode) {
        navigatingRef.current = null;
      } else {
        return;
      }
    }
    setCurrentSeason(season);
    setCurrentEpisode(episode);
  }, [season, episode]);

  // Save to "Continue Watching" history in localStorage
  useEffect(() => {
    try {
      const historyKey = "cineglow_history";
      const stored = localStorage.getItem(historyKey);
      let list = stored ? JSON.parse(stored) : [];
      list = list.filter((item: { id: number; mediaType?: string }) => !(item.id === tvId && item.mediaType === "tv"));
      list.unshift({
        id: tvId,
        title,
        season: currentSeason,
        episode: currentEpisode,
        mediaType: "tv",
        updatedAt: new Date().toISOString(),
      });
      localStorage.setItem(historyKey, JSON.stringify(list.slice(0, 30)));
    } catch {
      // Non-blocking storage
    }
  }, [tvId, title, currentSeason, currentEpisode]);

  // Compute exact fill scale for ultra-wide mobile screens
  const getDeviceFillScale = useCallback(() => {
    if (typeof window === "undefined") return 1.22;
    const w = window.innerWidth;
    const h = window.innerHeight;
    const screenRatio = Math.max(w, h) / Math.min(w, h);
    const videoRatio = 16 / 9;
    if (screenRatio > videoRatio) {
      return Math.round((screenRatio / videoRatio) * 100) / 100;
    }
    return 1.22;
  }, []);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 1800);
  }, []);

  // Toggle between Fit and Fill
  const toggleZoom = useCallback(() => {
    setZoomMode((prev) => {
      if (prev === "fit") {
        const fill = getDeviceFillScale();
        setZoomLevel(fill);
        showToast(`🔍 Zoomed to fill`);
        return "fill";
      } else {
        setZoomLevel(1.0);
        showToast(`📐 Original`);
        return "fit";
      }
    });
  }, [getDeviceFillScale, showToast]);

  // Auto-rotation: detect landscape/portrait on mobile
  useEffect(() => {
    if (typeof window === "undefined") return;

    const checkLandscape = () => {
      const isMobile = window.innerWidth <= 950 || window.innerHeight <= 550;
      const landscape = window.innerWidth > window.innerHeight;
      setIsLandscape(isMobile && landscape);
    };

    checkLandscape();

    const mql = window.matchMedia("(orientation: landscape)");
    const handleOrientationChange = () => {
      setTimeout(checkLandscape, 100);
    };

    mql.addEventListener("change", handleOrientationChange);
    window.addEventListener("resize", handleOrientationChange);

    if (screen.orientation) {
      screen.orientation.addEventListener("change", handleOrientationChange);
    }

    return () => {
      mql.removeEventListener("change", handleOrientationChange);
      window.removeEventListener("resize", handleOrientationChange);
      if (screen.orientation) {
        screen.orientation.removeEventListener("change", handleOrientationChange);
      }
    };
  }, []);

  // Double-tap to toggle zoom
  const handleSurfaceTap = useCallback(() => {
    const now = Date.now();
    const diff = now - lastTapRef.current;
    lastTapRef.current = now;

    if (diff < 350) {
      toggleZoom();
    }
  }, [toggleZoom]);

  // Pinch-to-zoom gesture handlers
  const getTouchDistance = (touches: React.TouchList) => {
    if (touches.length < 2) return 0;
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      pinchStartDistRef.current = getTouchDistance(e.touches);
      pinchStartZoomRef.current = zoomLevel;
    }
  }, [zoomLevel]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2 && pinchStartDistRef.current > 0) {
      const currentDist = getTouchDistance(e.touches);
      const ratio = currentDist / pinchStartDistRef.current;
      const fillScale = getDeviceFillScale();
      const newZoom = Math.min(fillScale, Math.max(1.0, pinchStartZoomRef.current * ratio));
      const rounded = Math.round(newZoom * 100) / 100;
      setZoomLevel(rounded);
    }
  }, [getDeviceFillScale]);

  const handleTouchEnd = useCallback(() => {
    if (pinchStartDistRef.current > 0) {
      pinchStartDistRef.current = 0;
      const fillScale = getDeviceFillScale();
      const threshold = 1.0 + (fillScale - 1.0) * 0.4;
      if (zoomLevel >= threshold) {
        setZoomLevel(fillScale);
        setZoomMode("fill");
        showToast(`🔍 Zoomed to fill`);
      } else {
        setZoomLevel(1.0);
        setZoomMode("fit");
        showToast(`📐 Original`);
      }
    }
  }, [zoomLevel, getDeviceFillScale, showToast]);

  // CSS Transform
  const computeTransform = () => {
    return `scale(${zoomLevel})`;
  };

  // Calculate Episode Navigation
  const currentSeasonIndex = allSeasons
    ? allSeasons.findIndex((s) => s.season_number === currentSeason)
    : -1;

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

    router.push(`/tv/${tvId}?s=${prevSeason}&e=${prevEp}`, { scroll: false });
    if (onEpisodeChange) {
      onEpisodeChange(prevSeason, prevEp);
    }
    showToast(`Playing S${prevSeason} : E${prevEp}`);
  };

  const handleNext = () => {
    if (!hasNext) return;

    navigatingRef.current = { season: nextSeason, episode: nextEp };
    setCurrentSeason(nextSeason);
    setCurrentEpisode(nextEp);

    router.push(`/tv/${tvId}?s=${nextSeason}&e=${nextEp}`, { scroll: false });
    if (onEpisodeChange) {
      onEpisodeChange(nextSeason, nextEp);
    }
    showToast(`Playing S${nextSeason} : E${nextEp}`);
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

      <div
        ref={playerRef}
        className={`${styles.playerWrapper} ${
          cinemaMode ? styles.playerWrapperTheater : ""
        } ${isLandscape ? styles.playerLandscape : ""}`}
      >
        {/* Top Controls Bar - Server selector and Theater mode */}
        {!isLandscape && (
          <div className={styles.controlsBar}>
            {/* Server Selection */}
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

            {/* Right Side: Theater Mode */}
            <div className={styles.controlsGroupRight}>
              <button
                onClick={() => setCinemaMode(!cinemaMode)}
                className={`${styles.theaterBtn} ${cinemaMode ? styles.theaterBtnActive : ""}`}
                title={cinemaMode ? "Exit Theater Mode" : "Expand to Cinema Theater Mode"}
              >
                <svg width="15" height="15" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm2 2v8h10V6H5z" clipRule="evenodd" />
                </svg>
                <span>{cinemaMode ? "Exit Theater" : "Theater Mode"}</span>
              </button>
            </div>
          </div>
        )}

        {/* Video Frame & Viewport */}
        <div className={`${styles.videoFrame} ${cinemaMode && !isLandscape ? styles.videoFrameTheater : ""} ${isLandscape ? styles.videoFrameLandscape : ""}`}>
          {/* Stream Loading & Resolving Feedback Overlay */}
          <div
            className={`${styles.iframeLoadingOverlay} ${
              !iframeLoading ? styles.iframeLoadingOverlayHidden : ""
            }`}
          >
            <div className={styles.spinnerGlow}>
              <div className={styles.spinnerRing} />
              <div className={styles.spinnerPulse} />
            </div>
            <div className={styles.loadingServerBadge}>
              <span className={styles.loadingDot} />
              <span>Connecting to {servers[activeServer]?.name || "Server"}</span>
            </div>
            <span className={styles.loadingStatusText}>
              Resolving secure high-speed stream...
            </span>
          </div>

          {/* Zoom Engine Viewport */}
          <div
            className={styles.iframeViewport}
            onClick={handleSurfaceTap}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div
              className={styles.iframeTransformWrapper}
              style={{
                transform: computeTransform(),
              }}
            >
              <iframe
                key={`${activeServer}-${currentSeason}-${currentEpisode}`}
                src={servers[activeServer].url(tvId, currentSeason, currentEpisode)}
                className={styles.iframeElement}
                allowFullScreen
                allow="autoplay *; fullscreen *; encrypted-media *; picture-in-picture *; accelerometer *; gyroscope *; clipboard-write *; screen-wake-lock *; cross-origin-isolated *"
                referrerPolicy="origin"
                title={`Playing Season ${currentSeason} Episode ${currentEpisode}`}
                loading="eager"
                onLoad={() => setIframeLoading(false)}
              />
            </div>
          </div>

          {/* On-screen Toast Notification */}
          {toastMessage && (
            <div className={styles.zoomToast}>
              <span>{toastMessage}</span>
            </div>
          )}

          {/* Landscape: Floating zoom toggle pill at top-center */}
          {isLandscape && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleZoom();
              }}
              className={styles.landscapeZoomPill}
              title={zoomMode === "fit" ? "Zoom to fill" : "Back to original"}
            >
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
              <span>{zoomMode === "fit" ? "Zoom to fill" : "Original"}</span>
            </button>
          )}

          {/* Landscape: Compact server + episode switcher at bottom */}
          {isLandscape && (
            <div className={styles.landscapeServerBar}>
              {servers.map((server, index) => (
                <button
                  key={index}
                  onClick={() => setActiveServer(index)}
                  className={`${styles.landscapeServerBtn} ${activeServer === index ? styles.landscapeServerBtnActive : ""}`}
                >
                  {server.name.split(" ")[0]} {server.name.includes("(") ? server.name.match(/\((.*?)\)/)?.[1] : ""}
                </button>
              ))}
              <span className={styles.landscapeDivider} />
              <button
                onClick={handlePrev}
                disabled={!hasPrev}
                className={styles.landscapeServerBtn}
                style={{ opacity: !hasPrev ? 0.35 : 1 }}
              >
                ⏮ Prev
              </button>
              <span className={styles.landscapeEpLabel}>
                S{currentSeason}:E{currentEpisode}
              </span>
              <button
                onClick={handleNext}
                disabled={!hasNext}
                className={`${styles.landscapeServerBtn} ${styles.landscapeServerBtnActive}`}
                style={{ opacity: !hasNext ? 0.35 : 1 }}
              >
                Next ⏭
              </button>
            </div>
          )}
        </div>

        {/* Episode Navigation Bar (Normal View) */}
        {!isLandscape && (
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
        )}

        {!isLandscape && (
          <p style={{ color: "var(--text-muted)", fontSize: "0.82rem", textAlign: "center" }}>
            If an episode is buffering or shows an error, switch to another Server above.
          </p>
        )}
      </div>
    </>
  );
}
