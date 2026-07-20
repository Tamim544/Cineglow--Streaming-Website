import Image from "next/image";
import Link from "next/link";
import styles from "./HeroSection.module.css";

interface HeroSectionProps {
  title?: string;
  description?: string;
  imageUrl?: string;
  movieId?: number;
}

export default function HeroSection({
  title = "Discover Your Next Favorite Movie",
  description = "Explore a vast collection of movies, from timeless classics to the latest blockbusters. Dive into the world of cinema with CineGlow.",
  imageUrl = "https://image.tmdb.org/t/p/original/mMA2YNddOGV8RbDPPspAOfQo1B.jpg", // Default placeholder background
  movieId
}: HeroSectionProps) {
  return (
    <section className={styles.hero}>
      <div className={styles.background}>
        <Image 
          src={imageUrl} 
          alt="Hero Background" 
          fill
          priority
          style={{ objectFit: 'cover' }}
        />
      </div>
      <div className={styles.overlay} />
      
      <div className={`${styles.content} animate-fade-in`}>
        <h1 className={`heading-xl ${styles.title}`}>
          <span className="text-gradient">{title}</span>
        </h1>
        <p className={styles.description}>
          {description}
        </p>
        <div className={styles.actions}>
          {movieId ? (
            <Link href={`/movie/${movieId}`} className="btn btn-primary">
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
              View Details
            </Link>
          ) : (
            <Link href="#trending" className="btn btn-primary">
              Explore Trending
            </Link>
          )}
          <Link href="/browse" className="btn btn-secondary">
            Browse All
          </Link>
        </div>
      </div>
    </section>
  );
}
