import MovieCard from "@/components/MovieCard";
import { getPopularMovies, searchMovies } from "@/lib/tmdb";
import Link from "next/link";

export default async function BrowsePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const pageParam = typeof resolvedParams.page === 'string' ? resolvedParams.page : '1';
  const queryParam = typeof resolvedParams.q === 'string' ? resolvedParams.q : '';
  
  const currentPage = parseInt(pageParam, 10) || 1;

  let movies = [];
  let totalPages = 1;

  try {
    const data = queryParam 
      ? await searchMovies(queryParam, currentPage)
      : await getPopularMovies(currentPage);
      
    movies = data.results || [];
    totalPages = data.total_pages || 1;
    // Cap total pages to 500 as TMDB API restricts to 500 pages max
    totalPages = Math.min(totalPages, 500);
  } catch (error) {
    console.warn("Using empty array because TMDB fetch failed");
  }

  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;

  const buildPageUrl = (page: number) => {
    return `/browse?page=${page}${queryParam ? `&q=${encodeURIComponent(queryParam)}` : ''}`;
  };

  return (
    <div style={{ paddingTop: "80px", minHeight: "80vh" }}>
      <div className="container" style={{ marginTop: "3rem", marginBottom: "4rem" }}>
        
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <h1 className="heading-lg" style={{ marginBottom: "0.5rem" }}>
              {queryParam ? (
                <>Search Results for <span className="text-accent-gradient">"{queryParam}"</span></>
              ) : (
                <span className="text-gradient">Popular Movies</span>
              )}
            </h1>
            <p style={{ color: "var(--text-secondary)" }}>
              Page {currentPage} of {totalPages}
            </p>
          </div>
          
          <form action="/browse" method="GET" style={{ display: "flex", gap: "0.5rem" }}>
            <input 
              type="text" 
              name="q" 
              defaultValue={queryParam}
              placeholder="Search movies..." 
              className="input-base"
              style={{ width: "250px" }}
            />
            <button type="submit" className="btn btn-primary" style={{ padding: "0.75rem 1.5rem" }}>Search</button>
          </form>
        </div>
        
        {movies.length > 0 ? (
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", 
            gap: "2rem" 
          }}>
            {movies.map((movie: any) => (
              <MovieCard 
                key={movie.id}
                id={movie.id}
                title={movie.title || movie.name}
                posterPath={movie.poster_path}
                rating={movie.vote_average || 0}
                year={movie.release_date ? movie.release_date.split('-')[0] : (movie.first_air_date ? movie.first_air_date.split('-')[0] : "N/A")}
              />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "4rem 0", color: "var(--text-secondary)" }}>
            <h2 className="heading-md" style={{ marginBottom: "1rem" }}>No movies found</h2>
            <p>Try adjusting your search query.</p>
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div style={{ display: "flex", justifyContent: "center", gap: "1rem", marginTop: "4rem" }}>
            {hasPrevPage ? (
              <Link href={buildPageUrl(currentPage - 1)} className="btn btn-secondary">
                ← Previous
              </Link>
            ) : (
              <button className="btn btn-secondary" disabled style={{ opacity: 0.5, cursor: "not-allowed" }}>
                ← Previous
              </button>
            )}
            
            <div style={{ display: "flex", alignItems: "center", padding: "0 1rem", background: "rgba(255,255,255,0.05)", borderRadius: "var(--radius-sm)" }}>
              <span style={{ fontWeight: 600 }}>{currentPage}</span>
            </div>
            
            {hasNextPage ? (
              <Link href={buildPageUrl(currentPage + 1)} className="btn btn-primary">
                Next →
              </Link>
            ) : (
              <button className="btn btn-primary" disabled style={{ opacity: 0.5, cursor: "not-allowed" }}>
                Next →
              </button>
            )}
          </div>
        )}
        
      </div>
    </div>
  );
}
