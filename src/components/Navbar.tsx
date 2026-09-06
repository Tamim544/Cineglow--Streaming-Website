"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Mobile navigation states
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const mobileSearchInputRef = useRef<HTMLInputElement>(null);

  const [watchlistCount, setWatchlistCount] = useState(0);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setMobileSearchOpen(false);
    setIsFocused(false);
  }, [pathname]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  // Focus mobile search input when opened
  useEffect(() => {
    if (mobileSearchOpen) {
      setTimeout(() => {
        mobileSearchInputRef.current?.focus();
      }, 100);
    }
  }, [mobileSearchOpen]);

  // Watchlist count sync
  useEffect(() => {
    const updateCount = () => {
      try {
        const stored = localStorage.getItem("cineglow_watchlist");
        if (stored) {
          const list = JSON.parse(stored);
          setWatchlistCount(Array.isArray(list) ? list.length : 0);
        } else {
          setWatchlistCount(0);
        }
      } catch (e) {
        setWatchlistCount(0);
      }
    };
    updateCount();
    window.addEventListener("watchlistUpdated", updateCount);
    return () => window.removeEventListener("watchlistUpdated", updateCount);
  }, []);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Debounced search fetching
  useEffect(() => {
    if (searchQuery.trim().length === 0) {
      setSuggestions([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      try {
        const res = await fetch(`/api/movies/search?query=${encodeURIComponent(searchQuery)}`);
        const data = await res.json();
        setSuggestions(data.results?.slice(0, 6) || []);
      } catch (error) {
        console.error("Failed to fetch search suggestions", error);
      }
    }, 350);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsFocused(false);
      setMobileSearchOpen(false);
      router.push(`/browse?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <>
      <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ""}`}>
        <div className={`container ${styles.navContainer}`}>
          {/* Brand Logo */}
          <Link href="/" className={styles.logo}>
            <span className={styles.logoCine}>Cine</span>
            <span className={styles.logoGlow}>Glow</span>
            <span className={styles.logoDot} />
          </Link>

          {/* Desktop Navigation Links */}
          <div className={styles.desktopNav}>
            <Link href="/" className={styles.link}>
              Home
            </Link>
            <Link href="/browse" className={styles.link}>
              Movies
            </Link>
            <Link href="/anime" className={styles.link}>
              <span>Anime</span>
              <span
                style={{
                  fontSize: "0.65rem",
                  background: "linear-gradient(135deg, #f87171, #fb923c)",
                  padding: "1px 6px",
                  borderRadius: "4px",
                  color: "#fff",
                  fontWeight: 700,
                }}
              >
                HOT
              </span>
            </Link>
            <Link href="/kdramas" className={styles.link}>
              <span>K-Dramas</span>
              <span
                style={{
                  fontSize: "0.65rem",
                  background: "linear-gradient(135deg, #ec4899, #8b5cf6)",
                  padding: "1px 6px",
                  borderRadius: "4px",
                  color: "#fff",
                  fontWeight: 700,
                }}
              >
                NEW
              </span>
            </Link>
            <Link href="/trending" className={styles.link}>
              Trending
            </Link>
            <Link href="/watchlist" className={styles.link}>
              <span>Watchlist</span>
              {watchlistCount > 0 && (
                <span
                  style={{
                    background: "var(--accent)",
                    color: "#fff",
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    padding: "1px 6px",
                    borderRadius: "10px",
                  }}
                >
                  {watchlistCount}
                </span>
              )}
            </Link>
            <Link href="/about" className={styles.link}>
              About
            </Link>

            {/* Desktop Search */}
            <div className={styles.searchContainer} ref={dropdownRef}>
              <form onSubmit={handleSearch}>
                <svg
                  className={styles.searchIcon}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Search movies, anime, K-Dramas..."
                  className={`input-base ${styles.searchInput}`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                />
              </form>

              {/* Desktop Live Suggestions */}
              {isFocused && searchQuery.length > 0 && (
                <div className={styles.dropdown}>
                  {suggestions.length > 0 ? (
                    suggestions.map((item) => {
                      const targetUrl = item.media_type === "tv" ? `/tv/${item.id}` : `/movie/${item.id}`;
                      const isTV = item.media_type === "tv";

                      return (
                        <Link
                          key={item.id}
                          href={targetUrl}
                          className={styles.suggestionItem}
                          onClick={() => {
                            setIsFocused(false);
                            setSearchQuery("");
                          }}
                        >
                          <div className={styles.suggestionImage}>
                            {item.poster_path ? (
                              <Image
                                src={`https://image.tmdb.org/t/p/w92${item.poster_path}`}
                                alt={item.title || item.name}
                                fill
                                style={{ objectFit: "cover" }}
                              />
                            ) : (
                              <div style={{ width: "100%", height: "100%", background: "#333" }} />
                            )}
                          </div>
                          <div className={styles.suggestionInfo}>
                            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                              <span className={styles.suggestionTitle}>
                                {item.title || item.name}
                              </span>
                              <span
                                style={{
                                  fontSize: "0.65rem",
                                  padding: "1px 5px",
                                  borderRadius: "3px",
                                  background: isTV ? "rgba(236, 72, 153, 0.2)" : "rgba(99, 102, 241, 0.2)",
                                  color: isTV ? "#f472b6" : "var(--accent)",
                                  fontWeight: 700,
                                }}
                              >
                                {isTV ? "SERIES" : "MOVIE"}
                              </span>
                            </div>
                            <div className={styles.suggestionYear}>
                              {item.release_date?.split("-")[0] || item.first_air_date?.split("-")[0] || "N/A"}
                            </div>
                          </div>
                        </Link>
                      );
                    })
                  ) : (
                    <div className={styles.noResults}>No results found</div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Mobile Action Controls (< 960px) */}
          <div className={styles.mobileControls}>
            {/* Search Toggle Button */}
            <button
              onClick={() => {
                setMobileSearchOpen(!mobileSearchOpen);
                if (mobileMenuOpen) setMobileMenuOpen(false);
              }}
              className={`${styles.iconBtn} ${mobileSearchOpen ? styles.iconBtnActive : ""}`}
              aria-label="Toggle Search"
              title="Search"
            >
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>

            {/* Hamburger Menu Toggle Button */}
            <button
              onClick={() => {
                setMobileMenuOpen(!mobileMenuOpen);
                if (mobileSearchOpen) setMobileSearchOpen(false);
              }}
              className={`${styles.iconBtn} ${mobileMenuOpen ? styles.iconBtnActive : ""}`}
              aria-label="Toggle Navigation Menu"
              title="Menu"
            >
              {mobileMenuOpen ? (
                <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Expandable Search Bar */}
      {mobileSearchOpen && (
        <div className={styles.mobileSearchBar}>
          <form onSubmit={handleSearch} className={styles.mobileSearchInputWrapper}>
            <svg
              className={styles.searchIcon}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              ref={mobileSearchInputRef}
              type="text"
              placeholder="Search movies, anime, K-Dramas..."
              className={styles.mobileSearchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                style={{
                  position: "absolute",
                  right: "1rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--text-secondary)",
                  fontSize: "1.1rem",
                  padding: "4px",
                }}
              >
                ✕
              </button>
            )}
          </form>

          {/* Mobile Live Suggestions Dropdown */}
          {searchQuery.length > 0 && (
            <div className={styles.dropdown} style={{ position: "relative", marginTop: "0.75rem" }}>
              {suggestions.length > 0 ? (
                suggestions.map((item) => {
                  const targetUrl = item.media_type === "tv" ? `/tv/${item.id}` : `/movie/${item.id}`;
                  const isTV = item.media_type === "tv";

                  return (
                    <Link
                      key={item.id}
                      href={targetUrl}
                      className={styles.suggestionItem}
                      onClick={() => {
                        setMobileSearchOpen(false);
                        setSearchQuery("");
                      }}
                    >
                      <div className={styles.suggestionImage}>
                        {item.poster_path ? (
                          <Image
                            src={`https://image.tmdb.org/t/p/w92${item.poster_path}`}
                            alt={item.title || item.name}
                            fill
                            style={{ objectFit: "cover" }}
                          />
                        ) : (
                          <div style={{ width: "100%", height: "100%", background: "#333" }} />
                        )}
                      </div>
                      <div className={styles.suggestionInfo}>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <span className={styles.suggestionTitle}>
                            {item.title || item.name}
                          </span>
                          <span
                            style={{
                              fontSize: "0.65rem",
                              padding: "1px 5px",
                              borderRadius: "3px",
                              background: isTV ? "rgba(236, 72, 153, 0.2)" : "rgba(99, 102, 241, 0.2)",
                              color: isTV ? "#f472b6" : "var(--accent)",
                              fontWeight: 700,
                            }}
                          >
                            {isTV ? "SERIES" : "MOVIE"}
                          </span>
                        </div>
                        <div className={styles.suggestionYear}>
                          {item.release_date?.split("-")[0] || item.first_air_date?.split("-")[0] || "N/A"}
                        </div>
                      </div>
                    </Link>
                  );
                })
              ) : (
                <div className={styles.noResults}>No results found</div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Mobile Slide-Out Navigation Drawer */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className={styles.drawerBackdrop}
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Content */}
          <div className={styles.mobileDrawer}>
            <div className={styles.drawerHeader}>
              <Link
                href="/"
                className={styles.logo}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className={styles.logoCine}>Cine</span>
                <span className={styles.logoGlow}>Glow</span>
                <span className={styles.logoDot} />
              </Link>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className={styles.iconBtn}
                aria-label="Close Drawer"
              >
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className={styles.drawerLinks}>
              <Link
                href="/"
                className={styles.drawerLinkItem}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>🏠 Home</span>
                <span style={{ color: "var(--text-secondary)", fontSize: "0.8rem" }}>→</span>
              </Link>

              <Link
                href="/browse"
                className={styles.drawerLinkItem}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>🎬 Movies</span>
                <span style={{ color: "var(--text-secondary)", fontSize: "0.8rem" }}>→</span>
              </Link>

              <Link
                href="/anime"
                className={styles.drawerLinkItem}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>⚡ Anime</span>
                <span
                  style={{
                    fontSize: "0.7rem",
                    background: "linear-gradient(135deg, #f87171, #fb923c)",
                    padding: "2px 8px",
                    borderRadius: "4px",
                    color: "#fff",
                    fontWeight: 700,
                  }}
                >
                  HOT
                </span>
              </Link>

              <Link
                href="/kdramas"
                className={styles.drawerLinkItem}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>🌸 K-Dramas</span>
                <span
                  style={{
                    fontSize: "0.7rem",
                    background: "linear-gradient(135deg, #ec4899, #8b5cf6)",
                    padding: "2px 8px",
                    borderRadius: "4px",
                    color: "#fff",
                    fontWeight: 700,
                  }}
                >
                  NEW
                </span>
              </Link>

              <Link
                href="/trending"
                className={styles.drawerLinkItem}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>🔥 Trending</span>
                <span style={{ color: "var(--text-secondary)", fontSize: "0.8rem" }}>→</span>
              </Link>

              <Link
                href="/watchlist"
                className={styles.drawerLinkItem}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>🔖 Watchlist</span>
                {watchlistCount > 0 ? (
                  <span
                    style={{
                      background: "var(--accent)",
                      color: "#fff",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      padding: "2px 8px",
                      borderRadius: "10px",
                    }}
                  >
                    {watchlistCount}
                  </span>
                ) : (
                  <span style={{ color: "var(--text-secondary)", fontSize: "0.8rem" }}>0</span>
                )}
              </Link>

              <Link
                href="/about"
                className={styles.drawerLinkItem}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>✨ About & Contact</span>
                <span style={{ color: "var(--text-secondary)", fontSize: "0.8rem" }}>→</span>
              </Link>
            </div>

            <div className={styles.drawerFooter}>
              <p>© {new Date().getFullYear()} CineGlow Premium</p>
            </div>
          </div>
        </>
      )}
    </>
  );
}
