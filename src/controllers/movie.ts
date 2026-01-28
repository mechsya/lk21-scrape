import {
  movieDetailScrape,
  moviesScrape,
  movieStreamScrape,
} from "../scrapers/movie.js";
import { Request, Response, NextFunction } from "express";
import api from "../util/axios-instance.js";

type TController = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<void>;

const createMovieController = (
  endpoint: string,
  message: string,
): TController => {
  return async (req, res, next) => {
    try {
      const { page = 1 } = req.query;

      const AxiosResponse = await api.get(
        `${process.env.LK21_BASE_URL}/${endpoint}/page/${Number(page)}`,
      );

      const payload = await moviesScrape(req, AxiosResponse);

      res.status(200).json({ message: message, data: payload });
    } catch (error) {
      console.error(error);
    }
  };
};

export const latestMovie = createMovieController("latest", "Latest Movies");

export const ratingMovies = createMovieController("rating", "Best Rating");

export const populerMovies = createMovieController("populer", "Populer");

export const detailMovie: TController = async (req, res, next) => {
  try {
    const { id } = req.params;

    const AxiosResponse = await api.get(`${process.env.LK21_BASE_URL}/${id}`);

    const movie = await movieDetailScrape(req, AxiosResponse);

    res.status(200).json({ message: "Movie Details", data: movie });
  } catch (error) {
    console.log(error);
  }
};

export const streamMovie: TController = async (req, res, next) => {
  try {
    const { id } = req.params;

    const AxiosResponse = await api.get(`${process.env.LK21_BASE_URL}/${id}`);

    const movie = await movieStreamScrape(req, AxiosResponse);

    res.status(200).json({ message: "Movie Details", data: movie });
  } catch (error) {
    console.log(error);
  }
};

const createCategoriesController = (endpoint: string): TController => {
  return async (req, res, next) => {
    const { param } = req.params;
    const { page = 1 } = req.query;

    const AxiosResponse = await api.get(
      `${process.env.LK21_BASE_URL}/${endpoint}/${param}/page/${Number(page)}`,
    );

    const payload = await moviesScrape(req, AxiosResponse);

    res.status(200).json({ data: payload });
  };
};

export const genreMovie = createCategoriesController("genre");

export const countryMovie = createCategoriesController("country");
