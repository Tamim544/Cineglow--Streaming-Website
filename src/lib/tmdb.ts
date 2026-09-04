import axios from 'axios';

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

const tmdbClient = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: TMDB_API_KEY,
  },
});

export const getTrendingMovies = async (page = 1) => {
  try {
    const response = await tmdbClient.get(`/trending/movie/day`, { params: { page } });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getPopularMovies = async (page = 1) => {
  try {
    const response = await tmdbClient.get(`/movie/popular`, { params: { page } });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getTopRatedMovies = async (page = 1) => {
  try {
    const response = await tmdbClient.get(`/movie/top_rated`, { params: { page } });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getUpcomingMovies = async (page = 1) => {
  try {
    const response = await tmdbClient.get(`/movie/upcoming`, { params: { page } });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const searchMovies = async (query: string, page = 1) => {
  try {
    const response = await tmdbClient.get(`/search/movie`, {
      params: { query, page, include_adult: false },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getMovieDetails = async (id: string) => {
  try {
    const response = await tmdbClient.get(`/movie/${id}`, {
      params: { append_to_response: 'videos,credits' },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getTrendingTV = async (page = 1) => {
  try {
    const response = await tmdbClient.get(`/trending/tv/day`, { params: { page } });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getPopularTV = async (page = 1) => {
  try {
    const response = await tmdbClient.get(`/tv/popular`, { params: { page } });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getSortParams = (filter: string, isMovie = false) => {
  const today = new Date().toISOString().split('T')[0];
  if (filter === 'top_rated' || filter === 'trending') {
    return {
      sort_by: 'vote_average.desc',
      'vote_count.gte': 50,
    };
  }
  if (filter === 'new') {
    return isMovie
      ? {
          sort_by: 'primary_release_date.desc',
          'primary_release_date.lte': today,
          'vote_count.gte': 5,
        }
      : {
          sort_by: 'first_air_date.desc',
          'first_air_date.lte': today,
          'vote_count.gte': 5,
        };
  }
  return {
    sort_by: 'popularity.desc',
  };
};

export const getKoreanDramas = async (page = 1, filter = 'popular') => {
  try {
    const sortParams = getSortParams(filter, false);
    const response = await tmdbClient.get(`/discover/tv`, {
      params: {
        page,
        with_original_language: 'ko',
        ...sortParams,
        include_adult: false,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getTVDetails = async (id: string) => {
  try {
    const response = await tmdbClient.get(`/tv/${id}`, {
      params: { append_to_response: 'videos,credits' },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getTVSeason = async (id: string, seasonNumber: number) => {
  try {
    const response = await tmdbClient.get(`/tv/${id}/season/${seasonNumber}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const searchMulti = async (query: string, page = 1) => {
  try {
    const response = await tmdbClient.get(`/search/multi`, {
      params: { query, page, include_adult: false },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAnime = async (page = 1, filter = 'popular') => {
  try {
    const sortParams = getSortParams(filter, false);
    const response = await tmdbClient.get(`/discover/tv`, {
      params: {
        page,
        with_genres: '16', // Animation
        with_original_language: 'ja',
        ...sortParams,
        include_adult: false,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAnimeMovies = async (page = 1, filter = 'popular') => {
  try {
    const sortParams = getSortParams(filter, true);
    const response = await tmdbClient.get(`/discover/movie`, {
      params: {
        page,
        with_genres: '16', // Animation
        with_original_language: 'ja',
        ...sortParams,
        include_adult: false,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
