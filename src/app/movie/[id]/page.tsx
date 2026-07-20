import { getMovieDetails } from "@/lib/tmdb";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function MovieDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let movie = null;
  
  try {
    movie = await getMovieDetails(id);
  } catch (error) {
    // If not found or error, just use a fallback or show 404
    notFound();
  }

  const backdropUrl = movie.backdrop_path 
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : "https://via.placeholder.com/1920x1080?text=No+Background";
    
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "https://via.placeholder.com/500x750?text=No+Poster";

  // Find trailer if exists
  const trailer = movie.videos?.results?.find((v: any) => v.type === "Trailer" && v.site === "YouTube");

  return (
    <div style={{ position: "relative", minHeight: "100vh", isolation: "isolate" }}>
      {/* Immersive Blurred Background */}
      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundImage: `url(${backdropUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        filter: "blur(60px) brightness(0.2)",
        transform: "scale(1.1)", // Prevent blur bleeding on edges
        zIndex: -5
      }} />

      {/* Detail Hero */}
      <section style={{ 
        position: "relative", 
        width: "100%", 
        height: "60vh", 
        minHeight: "500px",
        marginTop: "-80px"
      }}>
        <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: -2 }}>
          <Image src={backdropUrl} alt={movie.title} fill className="object-cover" style={{ objectFit: 'cover' }} />
        </div>
        <div style={{
          position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: -1,
          background: "linear-gradient(to bottom, rgba(10,10,15,0.1) 0%, rgba(10,10,15,0.8) 100%)"
        }} />
        
        <div className="container" style={{ 
          display: "flex", 
          alignItems: "flex-end", 
          height: "100%", 
          paddingBottom: "3rem",
          gap: "2rem"
        }}>
          {/* Poster */}
          <div style={{ 
            width: "250px", 
            aspectRatio: "2/3", 
            position: "relative",
            borderRadius: "var(--radius-md)",
            overflow: "hidden",
            boxShadow: "0 20px 40px rgba(0,0,0,0.8)",
            flexShrink: 0,
            display: "none" // hidden on mobile, shown on desktop (handled via media queries ideally, let's just show it)
          }} className="hide-on-mobile">
            <Image src={posterUrl} alt={movie.title} fill style={{ objectFit: 'cover' }} />
          </div>
          
          <div style={{ flex: 1 }}>
            <h1 className="heading-lg" style={{ marginBottom: "0.5rem" }}>{movie.title}</h1>
            <div style={{ display: "flex", gap: "1rem", color: "var(--text-secondary)", marginBottom: "1.5rem", flexWrap: "wrap" }}>
              <span>{movie.release_date?.split('-')[0]}</span>
              <span>•</span>
              <span style={{ color: "#fbbf24", display: "flex", alignItems: "center", gap: "4px" }}>
                ★ {movie.vote_average?.toFixed(1)}
              </span>
              <span>•</span>
              <span>{movie.runtime} min</span>
              <span>•</span>
              <span>{movie.genres?.map((g: any) => g.name).join(", ")}</span>
            </div>
            
            <div style={{ display: "flex", gap: "1rem" }}>
              <a href="#player" className="btn btn-primary" style={{ 
                background: "var(--accent)", 
                color: "#fff", 
                borderColor: "var(--accent)",
                boxShadow: "0 0 25px rgba(99, 102, 241, 0.7), 0 0 10px rgba(99, 102, 241, 0.5)"
              }}>
                ▶ Play Movie
              </a>
              {trailer && (
                <a href={`https://www.youtube.com/watch?v=${trailer.key}`} target="_blank" rel="noreferrer" className="btn btn-secondary">
                  Watch Trailer
                </a>
              )}
              <button className="btn btn-secondary">
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                Add to Watchlist
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Overview & Details */}
      <section className="container" style={{ padding: "4rem 2rem", maxWidth: "1000px", margin: "0 auto" }}>
        <h2 className="heading-md" style={{ marginBottom: "1rem" }}>Overview</h2>
        <p style={{ fontSize: "1.1rem", lineHeight: "1.8", color: "var(--text-secondary)", marginBottom: "3rem" }}>
          {movie.overview}
        </p>
      </section>

      {/* Player Section */}
      <section id="player" className="container" style={{ padding: "0 2rem 4rem", maxWidth: "1000px", margin: "0 auto" }}>
        <h2 className="heading-md" style={{ marginBottom: "1.5rem" }}>Watch Now</h2>
        <div style={{ position: "relative", width: "100%", paddingBottom: "56.25%", background: "#000", borderRadius: "var(--radius-md)", overflow: "hidden", boxShadow: "var(--card-shadow)" }}>
          <iframe 
            src={`https://vidsrc.me/embed/movie?tmdb=${movie.id}`}
            style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: 0 }}
            allowFullScreen
            title="Movie Player"
          />
        </div>
      </section>
    </div>
  );
}
