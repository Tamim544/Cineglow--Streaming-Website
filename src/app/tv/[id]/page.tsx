import { getTVDetails, getTVSeason } from "@/lib/tmdb";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import TVPlayer from "@/components/TVPlayer";
import WatchlistButton from "@/components/WatchlistButton";

export default async function TVDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { id } = await params;
  const resolvedSearchParams = await searchParams;

  let show: any = null;
  try {
    show = await getTVDetails(id);
  } catch (error) {
    notFound();
  }

  // Determine active season and episode
  const requestedSeason = typeof resolvedSearchParams.s === "string" ? parseInt(resolvedSearchParams.s, 10) : 1;
  const requestedEpisode = typeof resolvedSearchParams.e === "string" ? parseInt(resolvedSearchParams.e, 10) : 1;

  // Filter out season 0 (specials) if regular seasons exist, unless season 0 is specifically requested
  const validSeasons = (show.seasons || []).filter((s: any) => s.season_number > 0 || show.seasons.length === 1);
  const currentSeasonNumber = validSeasons.some((s: any) => s.season_number === requestedSeason)
    ? requestedSeason
    : validSeasons[0]?.season_number || 1;

  // Fetch season episodes
  let seasonData: any = null;
  try {
    seasonData = await getTVSeason(id, currentSeasonNumber);
  } catch (error) {
    seasonData = { episodes: [] };
  }

  const episodes = seasonData?.episodes || [];
  const currentEpisodeNumber = episodes.some((ep: any) => ep.episode_number === requestedEpisode)
    ? requestedEpisode
    : episodes[0]?.episode_number || 1;

  const backdropUrl = show.backdrop_path
    ? `https://image.tmdb.org/t/p/original${show.backdrop_path}`
    : "https://via.placeholder.com/1920x1080?text=No+Background";

  const posterUrl = show.poster_path
    ? `https://image.tmdb.org/t/p/w500${show.poster_path}`
    : "https://via.placeholder.com/500x750?text=No+Poster";

  const trailer = show.videos?.results?.find(
    (v: any) => (v.type === "Trailer" || v.type === "Teaser") && v.site === "YouTube"
  );

  const isKorean = show.original_language === "ko";

  return (
    <div style={{ position: "relative", minHeight: "100vh", isolation: "isolate" }}>
      {/* Immersive Blurred Background */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundImage: `url(${backdropUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(60px) brightness(0.2)",
          transform: "scale(1.1)",
          zIndex: -5,
        }}
      />

      {/* Hero Section */}
      <section
        style={{
          position: "relative",
          width: "100%",
          minHeight: "520px",
          marginTop: "-80px",
          paddingTop: "120px",
        }}
      >
        <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: -2 }}>
          <Image src={backdropUrl} alt={show.name} fill className="object-cover" style={{ objectFit: "cover" }} priority />
        </div>
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: -1,
            background: "linear-gradient(to bottom, rgba(10,10,15,0.2) 0%, rgba(10,10,15,0.95) 100%)",
          }}
        />

        <div
          className="container"
          style={{
            display: "flex",
            alignItems: "flex-end",
            height: "100%",
            paddingBottom: "3rem",
            gap: "2.5rem",
            flexWrap: "wrap",
          }}
        >
          {/* Poster */}
          <div
            style={{
              width: "220px",
              aspectRatio: "2/3",
              position: "relative",
              borderRadius: "var(--radius-md)",
              overflow: "hidden",
              boxShadow: "0 20px 40px rgba(0,0,0,0.8)",
              flexShrink: 0,
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <Image src={posterUrl} alt={show.name} fill style={{ objectFit: "cover" }} />
          </div>

          <div style={{ flex: 1, minWidth: "280px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
              <span
                style={{
                  background: isKorean ? "linear-gradient(135deg, #ec4899, #8b5cf6)" : "var(--accent)",
                  color: "#fff",
                  padding: "4px 10px",
                  borderRadius: "var(--radius-sm)",
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                {isKorean ? "K-Drama" : "TV Series"}
              </span>
              <span style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
                {show.number_of_seasons} {show.number_of_seasons === 1 ? "Season" : "Seasons"} • {show.number_of_episodes} Episodes
              </span>
            </div>

            <h1 className="heading-xl" style={{ marginBottom: "0.5rem" }}>{show.name}</h1>

            <div
              style={{
                display: "flex",
                gap: "1rem",
                color: "var(--text-secondary)",
                marginBottom: "1.5rem",
                flexWrap: "wrap",
                fontSize: "0.95rem",
              }}
            >
              <span>{show.first_air_date?.split("-")[0]}</span>
              <span>•</span>
              <span style={{ color: "#fbbf24", display: "flex", alignItems: "center", gap: "4px" }}>
                ★ {show.vote_average?.toFixed(1)}
              </span>
              <span>•</span>
              <span>{show.genres?.map((g: any) => g.name).join(", ")}</span>
            </div>

            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <a
                href="#player"
                className="btn btn-primary"
                style={{
                  background: "var(--accent)",
                  color: "#fff",
                  borderColor: "var(--accent)",
                  boxShadow: "0 0 25px rgba(99, 102, 241, 0.7), 0 0 10px rgba(99, 102, 241, 0.5)",
                }}
              >
                ▶ Watch Now
              </a>

              {trailer && (
                <a
                  href={`https://www.youtube.com/watch?v=${trailer.key}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-secondary"
                >
                  Watch Trailer
                </a>
              )}

              <WatchlistButton
                item={{
                  id: show.id,
                  title: show.name,
                  posterPath: show.poster_path,
                  rating: show.vote_average || 0,
                  year: show.first_air_date?.split("-")[0] || "N/A",
                  mediaType: "tv",
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Overview */}
      <section className="container" style={{ padding: "2rem 1rem 2.5rem", maxWidth: "1100px", margin: "0 auto" }}>
        <h2 className="heading-md" style={{ marginBottom: "0.75rem" }}>Synopsis</h2>
        <p style={{ fontSize: "1.05rem", lineHeight: "1.8", color: "var(--text-secondary)" }}>
          {show.overview || "No synopsis available."}
        </p>
      </section>

      {/* Video Player Section */}
      <section id="player" className="container" style={{ padding: "0 1rem 3.5rem", maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <h2 className="heading-md">Now Watching</h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
              Season {currentSeasonNumber} • Episode {currentEpisodeNumber}
              {episodes.find((ep: any) => ep.episode_number === currentEpisodeNumber)?.name
                ? `: ${episodes.find((ep: any) => ep.episode_number === currentEpisodeNumber)?.name}`
                : ""}
            </p>
          </div>
        </div>

        <TVPlayer
          tvId={show.id}
          title={show.name}
          season={currentSeasonNumber}
          episode={currentEpisodeNumber}
          totalEpisodesInSeason={episodes.length || 1}
          allSeasons={validSeasons.map((s: any) => ({
            season_number: s.season_number,
            episode_count: s.episode_count || 1,
          }))}
        />
      </section>

      {/* Seasons & Episodes Selector */}
      <section className="container" style={{ padding: "0 1rem 5rem", maxWidth: "1100px", margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "2rem",
            flexWrap: "wrap",
            gap: "1rem",
            borderBottom: "1px solid rgba(255,255,255,0.1)",
            paddingBottom: "1rem",
          }}
        >
          <h2 className="heading-md">Episodes</h2>

          {/* Season Selector */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
            <span style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>Season:</span>
            <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
              {validSeasons.map((s: any) => (
                <Link
                  key={s.id}
                  href={`/tv/${show.id}?s=${s.season_number}&e=1#player`}
                  className={`btn ${s.season_number === currentSeasonNumber ? "btn-primary" : "btn-secondary"}`}
                  style={{
                    padding: "0.4rem 0.8rem",
                    fontSize: "0.85rem",
                    background: s.season_number === currentSeasonNumber ? "var(--accent)" : "rgba(255,255,255,0.05)",
                  }}
                >
                  Season {s.season_number}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Episode Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
            gap: "1rem",
          }}
        >
          {episodes.map((ep: any) => {
            const isCurrent = ep.episode_number === currentEpisodeNumber;
            const stillUrl = ep.still_path
              ? `https://image.tmdb.org/t/p/w300${ep.still_path}`
              : "https://via.placeholder.com/300x170?text=No+Preview";

            return (
              <Link
                key={ep.id}
                href={`/tv/${show.id}?s=${currentSeasonNumber}&e=${ep.episode_number}#player`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <div
                  className="glass-card"
                  style={{
                    borderRadius: "var(--radius-md)",
                    overflow: "hidden",
                    border: isCurrent ? "2px solid var(--accent)" : "1px solid rgba(255,255,255,0.08)",
                    background: isCurrent ? "rgba(99, 102, 241, 0.15)" : "rgba(255,255,255,0.03)",
                    transition: "transform 0.2s ease, border-color 0.2s ease",
                    cursor: "pointer",
                  }}
                >
                  {/* Thumbnail */}
                  <div style={{ position: "relative", width: "100%", aspectRatio: "16/9", background: "#111" }}>
                    <Image
                      src={stillUrl}
                      alt={ep.name || `Episode ${ep.episode_number}`}
                      fill
                      style={{ objectFit: "cover" }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        top: "8px",
                        left: "8px",
                        background: isCurrent ? "var(--accent)" : "rgba(0,0,0,0.7)",
                        color: "#fff",
                        padding: "2px 8px",
                        borderRadius: "var(--radius-sm)",
                        fontSize: "0.75rem",
                        fontWeight: 700,
                      }}
                    >
                      EP {ep.episode_number}
                    </div>
                    {ep.runtime && (
                      <div
                        style={{
                          position: "absolute",
                          bottom: "8px",
                          right: "8px",
                          background: "rgba(0,0,0,0.7)",
                          color: "var(--text-secondary)",
                          padding: "2px 6px",
                          borderRadius: "var(--radius-sm)",
                          fontSize: "0.7rem",
                        }}
                      >
                        {ep.runtime}m
                      </div>
                    )}
                  </div>

                  {/* Episode Details */}
                  <div style={{ padding: "1rem" }}>
                    <h3
                      style={{
                        fontSize: "0.95rem",
                        fontWeight: 600,
                        marginBottom: "0.35rem",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        color: isCurrent ? "var(--accent)" : "#fff",
                      }}
                      title={ep.name}
                    >
                      {ep.name || `Episode ${ep.episode_number}`}
                    </h3>
                    <p
                      style={{
                        fontSize: "0.8rem",
                        color: "var(--text-secondary)",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        lineHeight: "1.4",
                      }}
                    >
                      {ep.overview || "No episode description available."}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
