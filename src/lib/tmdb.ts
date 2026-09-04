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

export const getKoreanDramas = async (page = 1) => {
  try {
    const response = await tmdbClient.get(`/discover/tv`, {
      params: {
        page,
        with_original_language: 'ko',
        sort_by: 'popularity.desc',
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

