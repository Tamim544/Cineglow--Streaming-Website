"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import styles from "./Player.module.css";

interface MoviePlayerProps {
  movieId: number;
  title?: string;
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
    name: "Server 4 (VidSrc.su)",
    url: (id: number) => `https://vidsrc.su/embed/movie/${id}`,
  },
  {
    name: "Server 5 (VidSrc.me)",
    url: (id: number) => `https://vidsrc.me/embed/movie?tmdb=${id}`,
  },
  {
    name: "Server 6 (Frembed)",
    url: (id: number) => `https://frembed.live/api/film.php?id=${id}`,
  },
  {
    name: "Server 7 (Videasy)",
    url: (id: number) => `https://player.videasy.net/movie/${id}`,
  },
  {
    name: "Server 8 (Vidora)",
    url: (id: number) => `https://vidora.online/embed/movie/${id}`,
  },
];

type ZoomMode = "fit" | "fill";

export default function MoviePlayer({ movieId, title }: MoviePlayerProps) {
  const [activeServer, setActiveServer] = useState(0);
  const [cinemaMode, setCinemaMode] = useState(false);
  const [zoomMode, setZoomMode] = useState<ZoomMode>("fit");
  const [zoomLevel, setZoomLevel] = useState(1.0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isLandscape, setIsLandscape] = useState(false);

  const playerRef = useRef<HTMLDivElement>(null);
  const toastTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastTapRef = useRef<number>(0);
  const pinchStartDistRef = useRef<number>(0);
  const pinchStartZoomRef = useRef<number>(1.0);

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

    // Use matchMedia for orientation changes
    const mql = window.matchMedia("(orientation: landscape)");
    const handleOrientationChange = () => {
      // Small delay to let the browser finish rotating
      setTimeout(checkLandscape, 100);
    };

    mql.addEventListener("change", handleOrientationChange);
    window.addEventListener("resize", handleOrientationChange);

    // Also listen for screen.orientation change event
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
      // Snap: if zoom > halfway to fill, snap to fill; otherwise snap to fit
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
            ><iframe
                key={`${activeServer}-${movieId}`}
                src={servers[activeServer].url(movieId)}
                className={styles.iframeElement}
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen; screen-wake-lock"
                title={title || "Movie Player"}
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

          {/* Landscape: Compact server switcher at bottom */}
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
            </div>
          )}
        </div>

        {!isLandscape && (
          <p style={{ color: "var(--text-muted)", fontSize: "0.82rem", textAlign: "center" }}>
            If a server is buffering or shows an error, please try selecting a different server above.
          </p>
        )}
      </div>
    </>
  );
}
