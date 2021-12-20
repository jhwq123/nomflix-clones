const API_KEY = "92eb6193b10b5f0adebb4d4c82e9d3ec";
const BASE_PATH = "https://api.themoviedb.org/3";

interface NowMovie {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
}

interface TopMovie {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string;
  vote_average: number;
  vote_count: number;
}

interface UpMovie {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
}

interface OnAirTv {
  id: number;
  backdrop_path: string;
  poster_path: string;
  name: string;
  overview: string;
  vote_average: number;
  vote_count: number;
}

interface LatestTv {
  name: string;
  overview: string;
  season_number: number;
  air_date: string;
}

interface TopTv {
  id: number;
  overview: string;
  backdrop_path: string;
  poster_path: string;
  name: string;
  vote_average: number;
  vote_count: number;
}

interface PopTv {
  id: number;
  overview: string;
  backdrop_path: string;
  name: string;
  vote_average: number;
  vote_count: number;
}

export interface IGetNowMoviesResult {
  dates: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: NowMovie[];
  total_pages: number;
  total_results: number;
}

export interface IGetLatestMoviesResult {
  id: number;
  poster_path: string;
  title: string;
  overview: string;
  release_date: string;
  runtime: number;
}

export interface IGetTopRatedMoviesResult {
  page: number;
  results: TopMovie[];
  total_pages: number;
  total_results: number;
}

export interface IGetUpcomingMoviesResult {
  dates: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: UpMovie[];
  total_pages: number;
  total_results: number;
}

export interface IGetOnAirTvResult {
  page: number;
  results: OnAirTv[];
  total_pages: number;
  total_results: number;
}

export interface IGetLatestTvResult {
  id: number;
  poster_path: string;
  name: string;
  overview: string;
  last_air_date: string;
  seasons: LatestTv[];
}

export interface IGetTopRatedTvResult {
  page: number;
  results: TopTv[];
  total_pages: number;
  total_results: number;
}

export interface IGetPopRatedTvResult {
  page: number;
  results: PopTv[];
  total_pages: number;
  total_results: number;
}

export function nowMovies() {
  return fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

export function latestMovies() {
  return fetch(`${BASE_PATH}/movie/latest?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

export function topRatedMovies() {
  return fetch(`${BASE_PATH}/movie/top_rated?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

export function upcomingMovies() {
  return fetch(`${BASE_PATH}/movie/upcoming?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

export function onAirTvShows() {
  return fetch(`${BASE_PATH}/tv/airing_today?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

export function latestTvshows() {
  return fetch(`${BASE_PATH}/tv/latest?api_key=${API_KEY}`).then((response) =>
    response.json()
  );
}

export function topTvshows() {
  return fetch(`${BASE_PATH}/tv/top_rated?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

export function popTvshows() {
  return fetch(`${BASE_PATH}/tv/popular?api_key=${API_KEY}`).then((response) =>
    response.json()
  );
}
