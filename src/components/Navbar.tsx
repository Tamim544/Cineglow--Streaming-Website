"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [watchlistCount, setWatchlistCount] = useState(0);

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
    }, 400); // 400ms debounce delay

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
      router.push(`/browse?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ""}`}>
      <div className={`container ${styles.navContainer}`}>
        <Link href="/" className={styles.logo}>
          <span className="text-accent-gradient">Cine</span>Glow
        </Link>
        
        <div className={styles.navLinks}>
          <Link href="/" className={styles.link}>Home</Link>
          <Link href="/browse" className={styles.link}>Movies</Link>
          <Link href="/kdramas" className={styles.link} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <span>K-Dramas</span>
            <span style={{ fontSize: "0.65rem", background: "linear-gradient(135deg, #ec4899, #8b5cf6)", padding: "1px 5px", borderRadius: "4px", color: "#fff", fontWeight: 700 }}>NEW</span>
          </Link>
          <Link href="/trending" className={styles.link}>Trending</Link>
          <Link href="/watchlist" className={styles.link} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span>Watchlist</span>
            {watchlistCount > 0 && (
              <span style={{ background: "var(--accent)", color: "#fff", fontSize: "0.7rem", fontWeight: 700, padding: "1px 6px", borderRadius: "10px" }}>
                {watchlistCount}
              </span>
            )}
          </Link>
          
          <div className={styles.searchContainer} ref={dropdownRef}>
            <form onSubmit={handleSearch}>
              <svg 
                className={styles.searchIcon} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input 
                type="text" 
                placeholder="Search movies, K-Dramas..." 
                className={`input-base ${styles.searchInput}`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsFocused(true)}
              />
            </form>

            {/* Live Suggestions Dropdown */}
            {isFocused && searchQuery.length > 0 && (
              <div 
                className={styles.dropdown} 
                style={{ 
                  position: 'absolute', 
                  top: '100%', 
                  left: 0, 
                  width: '100%', 
                  marginTop: '0.5rem',
                  zIndex: 9999,
                  background: 'var(--bg-glass)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)'
                }}
              >
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
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          padding: '0.75rem 1rem',
                          gap: '1rem',
                          textDecoration: 'none',
                          borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
                        }}
                      >
                        <div style={{ position: 'relative', width: '40px', height: '60px', flexShrink: 0, borderRadius: '4px', overflow: 'hidden' }}>
                          {item.poster_path ? (
                            <Image 
                              src={`https://image.tmdb.org/t/p/w92${item.poster_path}`} 
                              alt={item.title || item.name}
                              fill
                              style={{ objectFit: 'cover' }}
                            />
                          ) : (
                            <div style={{ width: '100%', height: '100%', background: '#333' }} />
                          )}
                        </div>
                        <div className={styles.suggestionInfo} style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', flex: 1 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            <span className={styles.suggestionTitle} style={{ fontWeight: 600, fontSize: '0.95rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {item.title || item.name}
                            </span>
                            <span style={{ fontSize: "0.65rem", padding: "1px 4px", borderRadius: "3px", background: isTV ? "rgba(236, 72, 153, 0.2)" : "rgba(99, 102, 241, 0.2)", color: isTV ? "#f472b6" : "var(--accent)", fontWeight: 700 }}>
                              {isTV ? "SERIES" : "MOVIE"}
                            </span>
                          </div>
                          <div className={styles.suggestionYear} style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                            {item.release_date?.split('-')[0] || item.first_air_date?.split('-')[0] || "N/A"}
                          </div>
                        </div>
                      </Link>
                    );
                  })
                ) : (
                  <div className={styles.noResults} style={{ padding: '1rem', textAlign: 'center' }}>No results found</div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

