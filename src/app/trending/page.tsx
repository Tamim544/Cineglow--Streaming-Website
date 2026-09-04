import HeroSection from "@/components/HeroSection";
import MovieCard from "@/components/MovieCard";
import { getTrendingMovies } from "@/lib/tmdb";

export default async function TrendingPage() {
  let trendingMovies = [];

  try {
    const data = await getTrendingMovies(1);
    trendingMovies = data.results || [];
  } catch (error) {
    console.warn("Using empty array because TMDB fetch failed");
  }

  return (
    <div style={{ paddingTop: "80px" }}>
      <div className="container" style={{ marginTop: "4rem", marginBottom: "4rem" }}>
        <h1 className="heading-lg" style={{ marginBottom: "2rem" }}>
          <span className="text-gradient">Trending Now</span>
        </h1>
        
        <div className="media-grid">
          {trendingMovies.map((movie: any) => (
            <MovieCard 
              key={movie.id}
              id={movie.id}
              title={movie.title || movie.name}
              posterPath={movie.poster_path}
              rating={movie.vote_average || 8.0}
              year={movie.release_date ? movie.release_date.split('-')[0] : (movie.first_air_date ? movie.first_air_date.split('-')[0] : "N/A")}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
