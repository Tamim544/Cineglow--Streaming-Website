import MovieCard from "@/components/MovieCard";
import { getAnime, getAnimeMovies } from "@/lib/tmdb";
import Link from "next/link";

export default async function AnimePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const pageParam = typeof resolvedParams.page === "string" ? resolvedParams.page : "1";
  const typeParam = typeof resolvedParams.type === "string" ? resolvedParams.type : "series";
  const filterParam = typeof resolvedParams.filter === "string" ? resolvedParams.filter : "popular";
  const currentPage = parseInt(pageParam, 10) || 1;

  const isMovies = typeParam === "movies";

  let items: any[] = [];
  let totalPages = 1;

  try {
    const data = isMovies ? await getAnimeMovies(currentPage, filterParam) : await getAnime(currentPage, filterParam);
    items = data.results || [];
    totalPages = Math.min(data.total_pages || 1, 500);
  } catch (error) {
    console.warn("Failed to fetch anime from TMDB", error);
  }

  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;

  const buildPageUrl = (page: number, type: string = typeParam, filter: string = filterParam) =>
    `/anime?page=${page}&type=${type}&filter=${filter}`;

  const filters = [
    { id: "popular", label: "🔥 Most Popular" },
    { id: "top_rated", label: "⭐ Top Rated" },
    { id: "new", label: "✨ New Releases" },
  ];

  return (
    <div style={{ paddingTop: "80px", minHeight: "80vh" }}>
      <div className="container" style={{ marginTop: "3rem", marginBottom: "4rem" }}>
        
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "2rem", flexWrap: "wrap", gap: "1.5rem" }}>
          <div>
            <div style={{ display: "inline-block", padding: "4px 12px", borderRadius: "var(--radius-sm)", background: "rgba(239, 68, 68, 0.15)", border: "1px solid rgba(239, 68, 68, 0.3)", color: "#f87171", fontSize: "0.8rem", fontWeight: 700, marginBottom: "0.75rem", textTransform: "uppercase", letterSpacing: "1px" }}>
              アニメ • Japanese Animation
            </div>
            <h1 className="heading-xl" style={{ marginBottom: "0.5rem" }}>
              Top <span style={{ background: "linear-gradient(135deg, #f87171, #fb923c)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Anime & Films</span>
            </h1>
            <p style={{ color: "var(--text-secondary)", maxWidth: "650px", fontSize: "1.05rem" }}>
              Stream the world's most acclaimed anime series and animated feature films with all seasons, episodes, and multiple fast servers.
            </p>
          </div>

          {/* Series vs Movies Filter Tabs */}
          <div style={{ display: "flex", gap: "0.5rem", background: "rgba(255,255,255,0.05)", padding: "4px", borderRadius: "var(--radius-sm)", border: "1px solid rgba(255,255,255,0.1)" }}>
            <Link
              href={buildPageUrl(1, "series", filterParam)}
              className={`btn ${!isMovies ? "btn-primary" : "btn-secondary"}`}
              style={{
                padding: "0.5rem 1.25rem",
                fontSize: "0.9rem",
                border: "none",
                background: !isMovies ? "linear-gradient(135deg, #f87171, #fb923c)" : "transparent",
              }}
            >
              Anime Series
            </Link>
            <Link
              href={buildPageUrl(1, "movies", filterParam)}
              className={`btn ${isMovies ? "btn-primary" : "btn-secondary"}`}
              style={{
                padding: "0.5rem 1.25rem",
                fontSize: "0.9rem",
                border: "none",
                background: isMovies ? "linear-gradient(135deg, #f87171, #fb923c)" : "transparent",
              }}
            >
              Anime Movies
            </Link>
          </div>
        </div>

        {/* Sort Filter Pills */}
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "2.5rem", flexWrap: "wrap" }}>
          {filters.map((f) => {
            const active = filterParam === f.id;
            return (
              <Link
                key={f.id}
                href={buildPageUrl(1, typeParam, f.id)}
                className={`btn ${active ? "btn-primary" : "btn-secondary"}`}
                style={{
                  padding: "0.45rem 1rem",
                  fontSize: "0.85rem",
                  border: active ? "none" : "1px solid rgba(255,255,255,0.1)",
                  background: active ? "linear-gradient(135deg, #f87171, #fb923c)" : "rgba(255,255,255,0.05)",
                  color: "#fff",
                }}
              >
                {f.label}
              </Link>
            );
          })}
        </div>

        {/* Anime Grid */}
        {items.length > 0 ? (
          <div className="media-grid">
            {items.map((anime: any) => (
              <MovieCard
                key={anime.id}
                id={anime.id}
                title={anime.name || anime.title}
                posterPath={anime.poster_path}
                rating={anime.vote_average || 0}
                year={anime.first_air_date ? anime.first_air_date.split("-")[0] : (anime.release_date ? anime.release_date.split("-")[0] : "N/A")}
                mediaType={isMovies ? "movie" : "tv"}
                badge="ANIME"
              />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "4rem 0", color: "var(--text-secondary)" }}>
            <h2 className="heading-md" style={{ marginBottom: "1rem" }}>No anime titles found</h2>
            <p>Please try a different page or filter.</p>
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div style={{ display: "flex", justifyContent: "center", gap: "1rem", marginTop: "4rem" }}>
            {hasPrevPage ? (
              <Link href={buildPageUrl(currentPage - 1, typeParam, filterParam)} className="btn btn-secondary">
                ← Previous
              </Link>
            ) : (
              <button className="btn btn-secondary" disabled style={{ opacity: 0.5, cursor: "not-allowed" }}>
                ← Previous
              </button>
            )}

            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: "0 1.25rem",
                background: "rgba(255,255,255,0.05)",
                borderRadius: "var(--radius-sm)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <span style={{ fontWeight: 600 }}>Page {currentPage} of {totalPages}</span>
            </div>

            {hasNextPage ? (
              <Link href={buildPageUrl(currentPage + 1, typeParam, filterParam)} className="btn btn-primary">
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
