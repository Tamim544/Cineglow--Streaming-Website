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
        setSuggestions(data.results?.slice(0, 5) || []);
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
          <Link href="/trending" className={styles.link}>Trending</Link>
          
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
                placeholder="Search movies..." 
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
                  suggestions.map((movie) => (
                    <Link 
                      key={movie.id} 
                      href={`/movie/${movie.id}`}
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
                        {movie.poster_path ? (
                          <Image 
                            src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`} 
                            alt={movie.title || movie.name}
                            fill
                            style={{ objectFit: 'cover' }}
                          />
                        ) : (
                          <div style={{ width: '100%', height: '100%', background: '#333' }} />
                        )}
                      </div>
                      <div className={styles.suggestionInfo} style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                        <div className={styles.suggestionTitle} style={{ fontWeight: 600, fontSize: '0.95rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {movie.title || movie.name}
                        </div>
                        <div className={styles.suggestionYear} style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                          {movie.release_date?.split('-')[0] || movie.first_air_date?.split('-')[0] || "N/A"}
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className={styles.noResults} style={{ padding: '1rem', textAlign: 'center' }}>No movies found</div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
