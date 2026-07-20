import HeroCarousel from "@/components/HeroCarousel";
import MovieCard from "@/components/MovieCard";
import { getTrendingMovies, getPopularMovies, getTopRatedMovies, getUpcomingMovies } from "@/lib/tmdb";

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

  try {
    const [trendingData, popularData, topRatedData, upcomingData] = await Promise.all([
      getTrendingMovies(1),
      getPopularMovies(1),
      getTopRatedMovies(1),
      getUpcomingMovies(1)
    ]);
    
    trendingMovies = trendingData.results;
    popularMovies = popularData.results;
    topRatedMovies = topRatedData.results;
    upcomingMovies = upcomingData.results;
  } catch (error) {
    console.warn("Using mock data because TMDB fetch failed (API key missing?)");
    trendingMovies = MOCK_MOVIES;
    popularMovies = MOCK_MOVIES;
    topRatedMovies = MOCK_MOVIES;
    upcomingMovies = MOCK_MOVIES;
  }

  return (
    <div style={{ position: "relative", minHeight: "100vh", isolation: "isolate" }}>
      {/* Dynamic Auto-Playing Hero Carousel */}
      <HeroCarousel movies={trendingMovies.slice(0, 5)} />

      <div className="container" style={{ marginTop: "4rem", marginBottom: "4rem" }} id="trending">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
          <h2 className="heading-md">Trending Now</h2>
          <button className="btn btn-secondary" style={{ padding: "0.5rem 1rem", fontSize: "0.9rem" }}>View All</button>
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
