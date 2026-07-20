import Image from "next/image";
import Link from "next/link";
import styles from "./MovieCard.module.css";

interface MovieCardProps {
  id: number;
  title: string;
  posterPath: string;
  rating: number;
  year: string;
}

export default function MovieCard({ id, title, posterPath, rating, year }: MovieCardProps) {
  // Use a placeholder if poster is missing
  const imageUrl = posterPath 
    ? `https://image.tmdb.org/t/p/w500${posterPath}` 
    : "https://via.placeholder.com/500x750?text=No+Image";

  return (
    <Link href={`/movie/${id}`}>
      <div className={`${styles.card} glass-card`}>
        <div className={styles.imageWrapper}>
          <Image 
            src={imageUrl} 
            alt={title} 
            fill
            className={styles.image}
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
          />
        </div>
        <div className={styles.overlay}>
          <h3 className={styles.title} title={title}>{title}</h3>
          <div className={styles.meta}>
            <span>{year}</span>
            <div className={styles.rating}>
              <svg width="14" height="14" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              {rating.toFixed(1)}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
