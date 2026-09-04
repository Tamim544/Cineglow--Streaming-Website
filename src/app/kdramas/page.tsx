import MovieCard from "@/components/MovieCard";
import { getKoreanDramas } from "@/lib/tmdb";
import Link from "next/link";

export default async function KDramasPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const pageParam = typeof resolvedParams.page === "string" ? resolvedParams.page : "1";
  const filterParam = typeof resolvedParams.filter === "string" ? resolvedParams.filter : "popular";
  const currentPage = parseInt(pageParam, 10) || 1;

  let kdramas: any[] = [];
  let totalPages = 1;

  try {
    const data = await getKoreanDramas(currentPage, filterParam);
    kdramas = data.results || [];
    totalPages = Math.min(data.total_pages || 1, 500);
  } catch (error) {
    console.warn("Failed to fetch Korean dramas from TMDB", error);
  }

  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;

  const buildPageUrl = (page: number, filter: string = filterParam) => `/kdramas?page=${page}&filter=${filter}`;

  const filters = [
    { id: "popular", label: "🔥 Most Popular" },
    { id: "top_rated", label: "⭐ Top Rated" },
    { id: "new", label: "✨ New Releases" },
  ];

  return (
    <div style={{ paddingTop: "80px", minHeight: "80vh" }}>
      <div className="container" style={{ marginTop: "3rem", marginBottom: "4rem" }}>
        {/* Header & Filter Tabs */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "2.5rem", flexWrap: "wrap", gap: "1.5rem" }}>
          <div>
            <div style={{ display: "inline-block", padding: "4px 12px", borderRadius: "var(--radius-sm)", background: "rgba(236, 72, 153, 0.15)", border: "1px solid rgba(236, 72, 153, 0.3)", color: "#f472b6", fontSize: "0.8rem", fontWeight: 700, marginBottom: "0.75rem", textTransform: "uppercase", letterSpacing: "1px" }}>
              Trending Worldwide
            </div>
            <h1 className="heading-xl" style={{ marginBottom: "0.5rem" }}>
              Korean <span style={{ background: "linear-gradient(135deg, #ec4899, #8b5cf6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Web Series & K-Dramas</span>
            </h1>
            <p style={{ color: "var(--text-secondary)", maxWidth: "700px", fontSize: "1.05rem" }}>
              Dive into top-rated Korean dramas, romantic comedies, gripping thrillers, and viral web series. Stream all seasons and episodes for free.
            </p>
          </div>

          {/* Filter Pills */}
          <div style={{ display: "flex", gap: "0.5rem", background: "rgba(255,255,255,0.05)", padding: "4px", borderRadius: "var(--radius-sm)", border: "1px solid rgba(255,255,255,0.1)", flexWrap: "wrap" }}>
            {filters.map((f) => {
              const active = filterParam === f.id;
              return (
                <Link
                  key={f.id}
                  href={buildPageUrl(1, f.id)}
                  className={`btn ${active ? "btn-primary" : "btn-secondary"}`}
                  style={{
                    padding: "0.45rem 1rem",
                    fontSize: "0.85rem",
                    border: "none",
                    background: active ? "linear-gradient(135deg, #ec4899, #8b5cf6)" : "transparent",
                    color: "#fff",
                  }}
                >
                  {f.label}
                </Link>
              );
            })}
          </div>
        </div>


        {/* Drama Grid */}
        {kdramas.length > 0 ? (
          <div className="media-grid">
            {kdramas.map((drama: any) => (
              <MovieCard
                key={drama.id}
                id={drama.id}
                title={drama.name || drama.title}
                posterPath={drama.poster_path}
                rating={drama.vote_average || 0}
                year={drama.first_air_date ? drama.first_air_date.split("-")[0] : "N/A"}
                mediaType="tv"
                badge="K-DRAMA"
              />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "4rem 0", color: "var(--text-secondary)" }}>
            <h2 className="heading-md" style={{ marginBottom: "1rem" }}>No series found</h2>
            <p>Please check back later or try a different page.</p>
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
