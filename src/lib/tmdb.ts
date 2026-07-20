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
