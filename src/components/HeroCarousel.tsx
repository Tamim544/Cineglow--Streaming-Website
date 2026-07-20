"use client";

import { useState, useEffect } from "react";
import HeroSection from "./HeroSection";

export default function HeroCarousel({ movies }: { movies: any[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    if (!movies || movies.length === 0) return;
    
    // Automatically change the featured movie every 5 seconds
    const interval = setInterval(() => {
      setIsFading(true); // Trigger fade out
      
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % movies.length);
        setIsFading(false); // Trigger fade in
      }, 500); // 500ms matches the CSS transition duration
      
    }, 6000); // Changed to 6s so the user has 5s to read, plus 1s of animation
    
    return () => clearInterval(interval);
  }, [movies]);

  if (!movies || movies.length === 0) return null;

  const heroMovie = movies[currentIndex];
  const backgroundUrl = heroMovie 
    ? (heroMovie.backdrop_path 
        ? `https://image.tmdb.org/t/p/original${heroMovie.backdrop_path}` 
        : `https://image.tmdb.org/t/p/original${heroMovie.poster_path}`) 
    : "https://via.placeholder.com/1920x1080?text=CineGlow";

  return (
    <div style={{ 
      opacity: isFading ? 0 : 1, 
      transition: "opacity 0.5s ease-in-out",
      width: "100%",
      height: "100%"
    }}>
      {/* Immersive Blurred Background for the entire Home Page */}
      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundImage: `url(${backgroundUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        filter: "blur(70px) brightness(0.25)",
        transform: "scale(1.2)", // Prevent blur bleeding on edges
        zIndex: -5
      }} />

      <HeroSection 
        title={heroMovie ? heroMovie.title || heroMovie.name : "Welcome to CineGlow"}
        description={heroMovie ? heroMovie.overview : "Your premium destination to discover, track, and enjoy the world's best movies."}
        imageUrl={backgroundUrl}
        movieId={heroMovie ? heroMovie.id : undefined}
      />
    </div>
  );
}
