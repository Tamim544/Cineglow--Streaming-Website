# CineGlow 🎬✨

CineGlow is a premium, modern movie discovery web application built with **Next.js**. Designed to feel like a high-end streaming service (like Netflix or Apple TV+), CineGlow features an incredibly immersive user interface, dynamic cinematic backgrounds, and real-time movie data powered by the TMDB API.

## ✨ Features

- **Cinematic Auto-Playing Carousel**: A fully custom, auto-playing hero section that cycles through the top 5 trending movies of the day, complete with a professional cross-fade animation.
- **Immersive Dynamic Backgrounds**: The entire application dynamically adapts its background to match the currently featured movie, using a frosted-glass blur effect that makes the site feel alive.
- **Real-Time TMDB Data**: Automatically fetches and organizes movies into beautiful, categorized rows:
  - 🔥 Trending Now
  - 🌍 Popular Movies
  - ⭐ Top Rated Classics
  - 📅 Coming Soon
- **Premium UI/UX**: Built from the ground up with custom CSS to include glowing buttons, sleek glassmorphism navbars, and ultra-smooth hover states.
- **Lightning Fast**: Built on Next.js App Router for optimal performance, utilizing both Server Components and interactive Client Components.

## 🚀 Getting Started

First, clone the repository and install the dependencies:

```bash
npm install
# or
yarn install
```

Next, you will need a TMDB API Key to fetch live movie data. Create a `.env.local` file in the root directory and add your key:

```env
TMDB_API_KEY="your_tmdb_api_key_here"
```

Finally, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3001](http://localhost:3001) with your browser to see the result!

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Styling**: Vanilla CSS Modules (Custom Design System)
- **Data Fetching**: Axios & [TMDB API](https://developer.themoviedb.org/docs)
- **Icons**: Heroicons / Custom SVGs
- **Deployment**: Ready for Vercel

## 📝 License

This project is open-source and available for personal and educational use.
