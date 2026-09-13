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
    name: "Server 4 (VidSrc.me)",
    url: (id: number) => `https://vidsrc.me/embed/movie?tmdb=${id}`,
  },
  {
    name: "Server 5 (VidSrc.to)",
    url: (id: number) => `https://vidsrc.to/embed/movie/${id}`,
  },
];

type ZoomMode = "fit" | "fill" | "wide" | "stretch" | "custom";

export default function MoviePlayer({ movieId, title }: MoviePlayerProps) {
  const [activeServer, setActiveServer] = useState(0);
  const [cinemaMode, setCinemaMode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoomMode, setZoomMode] = useState<ZoomMode>("fit");
  const [zoomLevel, setZoomLevel] = useState(1.0);
  const [showOverlay, setShowOverlay] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const playerRef = useRef<HTMLDivElement>(null);
  const overlayTimerRef = useRef<NodeJS.Timeout | null>(null);
  const toastTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastTapRef = useRef<number>(0);

  // Compute exact fill scale for ultra-wide mobile screens (like Samsung S23 Ultra ~19.3:9)
  const getDeviceFillScale = useCallback(() => {
    if (typeof window === "undefined") return 1.22;
    const w = window.innerWidth;
    const h = window.innerHeight;
    const screenRatio = Math.max(w, h) / Math.min(w, h);
    const videoRatio = 16 / 9; // ~1.7778
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
    }, 2200);
  }, []);

  // Handle Zoom Mode Selection
  const applyZoomMode = useCallback((mode: ZoomMode) => {
    setZoomMode(mode);
    if (mode === "fit") {
      setZoomLevel(1.0);
      showToast("Fit: Original 16:9");
    } else if (mode === "fill") {
      const fill = getDeviceFillScale();
      setZoomLevel(fill);
      showToast(`Fill Screen: ${Math.round(fill * 100)}%`);
    } else if (mode === "wide") {
      setZoomLevel(1.33);
      showToast("Cinemascope: 133%");
    } else if (mode === "stretch") {
      const fill = getDeviceFillScale();
      setZoomLevel(fill);
      showToast("Stretched: 100% Full Width");
    }
  }, [getDeviceFillScale, showToast]);

  // Step Zoom in/out (+/- 5%)
  const stepZoom = useCallback((delta: number) => {
    setZoomLevel((prev) => {
      const next = Math.min(1.7, Math.max(1.0, Math.round((prev + delta) * 100) / 100));
      setZoomMode("custom");
      showToast(`Zoom: ${Math.round(next * 100)}%`);
      return next;
    });
  }, [showToast]);

  // Dedicated Enter Fullscreen
  const enterFullscreen = useCallback(async () => {
    const el = playerRef.current;
    if (!el) return;

    try {
      const requestFs =
        el.requestFullscreen ||
        (el as unknown as { webkitRequestFullscreen?: (opts?: unknown) => Promise<void> })
          .webkitRequestFullscreen;

      if (requestFs) {
        await requestFs.call(el, { navigationUI: "hide" });
      }
      setIsFullscreen(true);
      setShowOverlay(true);

      const screenAny = screen as unknown as {
        orientation?: { lock?: (orientation: string) => Promise<void>; unlock?: () => void };
      };
      if (screenAny.orientation?.lock) {
        await screenAny.orientation.lock("landscape").catch(() => {});
      }
    } catch (err) {
      console.warn("Fullscreen enter error:", err);
      setIsFullscreen(true);
    }
  }, []);

  // Dedicated Clean Exit Fullscreen - Guarantees NO loop
  const exitFullscreen = useCallback(async () => {
    setIsFullscreen(false);
    setZoomMode("fit");
    setZoomLevel(1.0);

    try {
      const doc = document as unknown as {
        fullscreenElement?: Element;
        webkitFullscreenElement?: Element;
        exitFullscreen?: () => Promise<void>;
        webkitExitFullscreen?: () => Promise<void>;
      };

      if (doc.fullscreenElement || doc.webkitFullscreenElement) {
        if (doc.exitFullscreen) {
          await doc.exitFullscreen();
        } else if (doc.webkitExitFullscreen) {
          await doc.webkitExitFullscreen();
        }
      }
    } catch (err) {
      console.warn("Fullscreen exit error:", err);
    }

    try {
      const screenAny = screen as unknown as {
        orientation?: { unlock?: () => void };
      };
      if (screenAny.orientation?.unlock) {
        screenAny.orientation.unlock();
      }
    } catch {
      // Ignore
    }
  }, []);

  // Toggle Fullscreen
  const toggleFullscreen = useCallback(() => {
    const doc = document as unknown as {
      fullscreenElement?: Element;
      webkitFullscreenElement?: Element;
    };
    const isCurrentFs = !!(doc.fullscreenElement || doc.webkitFullscreenElement);
    if (isFullscreen || isCurrentFs) {
      exitFullscreen();
    } else {
      enterFullscreen();
    }
  }, [isFullscreen, exitFullscreen, enterFullscreen]);

  // Native Fullscreen Event Listener
  useEffect(() => {
    const onFsChange = () => {
      const doc = document as unknown as {
        fullscreenElement?: Element;
        webkitFullscreenElement?: Element;
      };
      const active = !!(doc.fullscreenElement || doc.webkitFullscreenElement);
      setIsFullscreen(active);
      if (!active) {
        setZoomMode("fit");
        setZoomLevel(1.0);
        try {
          const screenAny = screen as unknown as {
            orientation?: { unlock?: () => void };
          };
          screenAny.orientation?.unlock?.();
        } catch {
          // Ignore
        }
      }
    };

    document.addEventListener("fullscreenchange", onFsChange);
    document.addEventListener("webkitfullscreenchange", onFsChange);

    return () => {
      document.removeEventListener("fullscreenchange", onFsChange);
      document.removeEventListener("webkitfullscreenchange", onFsChange);
    };
  }, []);

  // Fullscreen HUD Auto-Hide Timer
  const resetOverlayTimer = useCallback(() => {
    setShowOverlay(true);
    if (overlayTimerRef.current) clearTimeout(overlayTimerRef.current);
    if (isFullscreen) {
      overlayTimerRef.current = setTimeout(() => {
        setShowOverlay(false);
      }, 3500);
    }
  }, [isFullscreen]);

  useEffect(() => {
    if (isFullscreen) {
      resetOverlayTimer();
    } else {
      setShowOverlay(true);
    }
    return () => {
      if (overlayTimerRef.current) clearTimeout(overlayTimerRef.current);
    };
  }, [isFullscreen, resetOverlayTimer]);

  // Double-tap on video to toggle between Fit (100%) and Fill (Ultra-wide Full Screen)
  const handleSurfaceTap = () => {
    const now = Date.now();
    const diff = now - lastTapRef.current;
    lastTapRef.current = now;

    if (diff < 350) {
      // Double Tap detected!
      if (zoomMode === "fit" && zoomLevel === 1.0) {
        applyZoomMode("fill");
      } else {
        applyZoomMode("fit");
      }
    } else {
      // Single Tap toggles overlay visibility in fullscreen
      if (isFullscreen) {
        setShowOverlay((prev) => !prev);
      }
    }
  };

  // Rotate screen orientation if supported on mobile
  const handleRotateScreen = async () => {
    const screenAny = screen as unknown as {
      orientation?: {
        type?: string;
        lock?: (o: string) => Promise<void>;
        unlock?: () => void;
      };
    };
    if (!screenAny.orientation?.lock) {
      showToast("Turn on Auto-Rotate in phone settings");
      return;
    }
    try {
      const currentType = screenAny.orientation.type || "";
      if (currentType.includes("landscape")) {
        await screenAny.orientation.lock("portrait");
        showToast("Screen: Portrait");
      } else {
        await screenAny.orientation.lock("landscape");
        showToast("Screen: Landscape");
      }
    } catch {
      showToast("Turn on Auto-Rotate in phone settings");
    }
  };

  // Determine CSS Transform based on zoom mode & level
  const computeTransform = () => {
    if (zoomMode === "stretch") {
      return `scaleX(${zoomLevel}) scaleY(1.0)`;
    }
    return `scale(${zoomLevel})`;
  };

  return (
    <>
      {cinemaMode && !isFullscreen && (
        <div
          className={styles.cinemaBackdrop}
          onClick={() => setCinemaMode(false)}
          title="Click to exit theater mode"
        />
      )}

      <div
        ref={playerRef}
        className={`${styles.playerWrapper} ${
          cinemaMode && !isFullscreen ? styles.playerWrapperTheater : ""
        }`}
        onMouseMove={resetOverlayTimer}
        onTouchStart={resetOverlayTimer}
      >
        {/* Top Controls Bar - Clean single line: Servers on left, Fullscreen on right */}
        {!isFullscreen && (
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

            {/* Right Side: Theater Mode & Fullscreen */}
            <div className={styles.controlsGroupRight}>
              {/* Theater Mode Button (Desktop) */}
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
        <div className={`${styles.videoFrame} ${cinemaMode && !isFullscreen ? styles.videoFrameTheater : ""}`}>
          {/* Zoom Engine Viewport */}
          <div className={styles.iframeViewport} onClick={handleSurfaceTap}>
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

          {!isFullscreen && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleFullscreen();
              }}
              className={styles.floatingFullscreenBtn}
              title="Watch in Full Screen"
            >
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
            </button>
          )}

          {/* On-screen Toast Notification */}
          {toastMessage && (
            <div className={styles.zoomToast}>
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
              </svg>
              <span>{toastMessage}</span>
            </div>
          )}

          {/* Fullscreen Floating HUD Overlay */}
          {isFullscreen && (
            <div
              className={`${styles.fullscreenOverlay} ${
                showOverlay ? styles.fullscreenOverlayVisible : styles.fullscreenOverlayHidden
              }`}
            >
              {/* Fullscreen Top Bar */}
              <div className={styles.fullscreenTopBar}>
                {/* Server Selector inside Fullscreen */}
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                  <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)" }}>
                    SERVER:
                  </span>
                  {servers.map((server, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveServer(index)}
                      className={`${styles.hudBtn} ${activeServer === index ? styles.hudBtnActive : ""}`}
                    >
                      {server.name.split(" ")[0]} {server.name.includes("(") ? server.name.match(/\((.*?)\)/)?.[1] : ""}
                    </button>
                  ))}
                </div>

                {/* Top Right Controls */}
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                  {/* Rotate Screen */}
                  <button
                    onClick={handleRotateScreen}
                    className={styles.hudBtn}
                    title="Rotate Screen"
                  >
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span>Rotate</span>
                  </button>

                  {/* Explicit Exit Fullscreen Button - One Tap Guaranteed Exit */}
                  <button
                    onClick={exitFullscreen}
                    className={`${styles.hudBtn} ${styles.hudCloseBtn}`}
                    title="Exit Fullscreen"
                  >
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span>Exit</span>
                  </button>
                </div>
              </div>

              {/* Fullscreen Bottom Bar: Zoom Modes & Stepper */}
              <div className={styles.fullscreenBottomBar}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                  <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)" }}>
                    ZOOM:
                  </span>
                  <div className={styles.zoomButtonGroup}>
                    <button
                      onClick={() => applyZoomMode("fit")}
                      className={`${styles.zoomModeBtn} ${zoomMode === "fit" ? styles.zoomModeBtnActive : ""}`}
                    >
                      Fit 16:9
                    </button>
                    <button
                      onClick={() => applyZoomMode("fill")}
                      className={`${styles.zoomModeBtn} ${zoomMode === "fill" ? styles.zoomModeBtnActive : ""}`}
                      title="Fill Full Screen (Samsung S23 Ultra Edge-to-Edge)"
                    >
                      Fill Screen
                    </button>
                    <button
                      onClick={() => applyZoomMode("wide")}
                      className={`${styles.zoomModeBtn} ${zoomMode === "wide" ? styles.zoomModeBtnActive : ""}`}
                    >
                      21:9
                    </button>
                    <button
                      onClick={() => applyZoomMode("stretch")}
                      className={`${styles.zoomModeBtn} ${zoomMode === "stretch" ? styles.zoomModeBtnActive : ""}`}
                    >
                      Stretch
                    </button>

                    <button
                      onClick={() => stepZoom(-0.05)}
                      disabled={zoomLevel <= 1.0}
                      className={styles.zoomStepBtn}
                    >
                      -
                    </button>
                    <span className={styles.zoomLabel}>{Math.round(zoomLevel * 100)}%</span>
                    <button
                      onClick={() => stepZoom(0.05)}
                      disabled={zoomLevel >= 1.7}
                      className={styles.zoomStepBtn}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)" }}>
                  Double-tap video to toggle Fit / Fill Screen
                </div>
              </div>
            </div>
          )}

          {/* Subtle floating button when HUD is hidden */}
          {isFullscreen && !showOverlay && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowOverlay(true);
                resetOverlayTimer();
              }}
              className={styles.floatingZoomHintBtn}
              title="Tap to show controls"
            >
              <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
              <span>{Math.round(zoomLevel * 100)}% • Controls</span>
            </button>
          )}
        </div>

        {!isFullscreen && (
          <p style={{ color: "var(--text-muted)", fontSize: "0.82rem", textAlign: "center" }}>
            If a server is buffering or shows an error, please try selecting a different server above.
          </p>
        )}
      </div>
    </>
  );
}
