import HeroCarousel from "@/components/HeroCarousel";
import MovieCard from "@/components/MovieCard";
import Link from "next/link";
import { getTrendingMovies, getPopularMovies, getTopRatedMovies, getUpcomingMovies, getKoreanDramas, getAnime } from "@/lib/tmdb";

// Fallback mock data if API key is not yet provided
const MOCK_MOVIES = [
  { id: 1, title: "Inception", posterPath: "/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg", rating: 8.8, year: "2010" },
  { id: 2, title: "Interstellar", posterPath: "/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg", rating: 8.6, year: "2014" },
  { id: 3, title: "The Dark Knight", posterPath: "/qJ2tW6WMUDux911r6m7haRef0WH.jpg", rating: 9.0, year: "2008" },
  { id: 4, title: "Dune", posterPath: "/d5NXSklXo0qyIYkgV94XAgMIckC.jpg", rating: 8.0, year: "2021" },
  { id: 5, title: "Spider-Man", posterPath: "/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg", rating: 8.4, year: "2023" },
  { id: 6, title: "Avengers", posterPath: "/or06FN3Dka5tukK1e9sl16pB3iy.jpg", rating: 8.3, year: "2019" },
];

export const dynamic = 'force-dynamic';

export default async function Home() {
  let trendingMovies = [];
  let popularMovies = [];
  let topRatedMovies = [];
  let upcomingMovies = [];
  let koreanDramas = [];
  let animeList = [];

  try {
    const [trendingData, popularData, topRatedData, upcomingData, kdramaData, animeData] = await Promise.all([
      getTrendingMovies(1),
      getPopularMovies(1),
      getTopRatedMovies(1),
      getUpcomingMovies(1),
      getKoreanDramas(1),
      getAnime(1),
    ]);
    
    trendingMovies = trendingData.results;
    popularMovies = popularData.results;
    topRatedMovies = topRatedData.results;
    upcomingMovies = upcomingData.results;
    koreanDramas = kdramaData.results;
    animeList = animeData.results;
  } catch (error) {
    console.warn("Using mock data because TMDB fetch failed (API key missing?)");
    trendingMovies = MOCK_MOVIES;
    popularMovies = MOCK_MOVIES;
    topRatedMovies = MOCK_MOVIES;
    upcomingMovies = MOCK_MOVIES;
    koreanDramas = [];
    animeList = [];
  }

  return (
    <div style={{ position: "relative", minHeight: "100vh", isolation: "isolate" }}>
      {/* Dynamic Auto-Playing Hero Carousel */}
      <HeroCarousel movies={trendingMovies.slice(0, 5)} />

      <div className="container" style={{ marginTop: "4rem", marginBottom: "4rem" }} id="trending">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
          <h2 className="heading-md">Trending Now</h2>
          <Link href="/trending" className="btn btn-secondary" style={{ padding: "0.5rem 1rem", fontSize: "0.9rem" }}>View All</Link>
        </div>
        
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", 
          gap: "2rem" 
        }}>
          {trendingMovies.slice(0, 10).map((movie: any) => (
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

      {/* Korean Web Series & K-Dramas */}
      {koreanDramas.length > 0 && (
        <div className="container" style={{ marginBottom: "4rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <div style={{ display: "inline-block", padding: "2px 8px", borderRadius: "var(--radius-sm)", background: "rgba(236, 72, 153, 0.15)", border: "1px solid rgba(236, 72, 153, 0.3)", color: "#f472b6", fontSize: "0.75rem", fontWeight: 700, marginBottom: "0.5rem", textTransform: "uppercase" }}>
                Hot Right Now
              </div>
              <h2 className="heading-md">
                Popular <span style={{ background: "linear-gradient(135deg, #ec4899, #8b5cf6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Korean Web Series</span>
              </h2>
            </div>
            <Link href="/kdramas" className="btn btn-secondary" style={{ padding: "0.5rem 1rem", fontSize: "0.9rem" }}>
              Explore All K-Dramas →
            </Link>
          </div>
          
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", 
            gap: "2rem" 
          }}>
            {koreanDramas.slice(0, 10).map((drama: any) => (
              <MovieCard 
                key={drama.id}
                id={drama.id}
                title={drama.name || drama.title}
                posterPath={drama.poster_path}
                rating={drama.vote_average || 8.0}
                year={drama.first_air_date ? drama.first_air_date.split('-')[0] : "N/A"}
                mediaType="tv"
                badge="K-DRAMA"
              />
            ))}
          </div>
        </div>
      )}

      {/* Top Anime Spotlight */}
      {animeList.length > 0 && (
        <div className="container" style={{ marginBottom: "4rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <div style={{ display: "inline-block", padding: "2px 8px", borderRadius: "var(--radius-sm)", background: "rgba(239, 68, 68, 0.15)", border: "1px solid rgba(239, 68, 68, 0.3)", color: "#f87171", fontSize: "0.75rem", fontWeight: 700, marginBottom: "0.5rem", textTransform: "uppercase" }}>
                Top Rated Anime
              </div>
              <h2 className="heading-md">
                Trending <span style={{ background: "linear-gradient(135deg, #f87171, #fb923c)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Anime Series</span>
              </h2>
            </div>
            <Link href="/anime" className="btn btn-secondary" style={{ padding: "0.5rem 1rem", fontSize: "0.9rem" }}>
              Explore All Anime →
            </Link>
          </div>
          
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", 
            gap: "2rem" 
          }}>
            {animeList.slice(0, 10).map((anime: any) => (
              <MovieCard 
                key={anime.id}
                id={anime.id}
                title={anime.name || anime.title}
                posterPath={anime.poster_path}
                rating={anime.vote_average || 8.0}
                year={anime.first_air_date ? anime.first_air_date.split('-')[0] : "N/A"}
                mediaType="tv"
                badge="ANIME"
              />
            ))}
          </div>
        </div>
      )}



      <div className="container" style={{ marginBottom: "4rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
          <h2 className="heading-md">Popular Movies</h2>
        </div>
        
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", 
          gap: "2rem" 
        }}>
          {popularMovies.slice(0, 10).map((movie: any) => (
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

      <div className="container" style={{ marginBottom: "4rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
          <h2 className="heading-md">Top Rated Classics</h2>
        </div>
        
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", 
          gap: "2rem" 
        }}>
          {topRatedMovies.slice(0, 10).map((movie: any) => (
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

      <div className="container" style={{ marginBottom: "4rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
          <h2 className="heading-md">Coming Soon</h2>
        </div>
        
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", 
          gap: "2rem" 
        }}>
          {upcomingMovies.slice(0, 10).map((movie: any) => (
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
