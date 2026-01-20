import {
  detailSeriesScrape,
  seriesScrape,
  seriesStreamScrape,
} from "@/scrapers/series";
import axios from "axios";
import { Request, Response, NextFunction } from "express";

type TController = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<void>;

const createSeriesController = (
  endpoint: string,
  message: string,
): TController => {
  return async (req, res, next) => {
    try {
      const { page = 1 } = req.query;

      const AxiosResponse = await axios.get(
        `${process.env.ND_BASE_URL}/${endpoint}/page/${Number(page)}`,
      );

      const series = await seriesScrape(req, AxiosResponse);

      res.status(200).json({ message: message, data: series });
    } catch (error) {
      console.error(error);
    }
  };
};

export const latestSeries = createSeriesController("latest", "Latest Series");

export const populerSeries = createSeriesController(
  "populer",
  "Populer Series",
);

export const ratingSeries = createSeriesController(
  "rating",
  "Best Rating Series",
);

export const ongoingSeries = createSeriesController(
  "series/ongoing",
  "Ongoing Series",
);

export const detailSeries: TController = async (req, res, next) => {
  try {
    const { id } = req.params;

    const AxiosResponse = await axios.get(`${process.env.ND_BASE_URL}/${id}`);

    const series = await detailSeriesScrape(req, AxiosResponse);

    res.status(200).json({ message: "Series Details", data: series });
  } catch (error) {
    console.log(error);
  }
};

export const streamSeries: TController = async (req, res, next) => {
  try {
    const { id } = req.params;

    const AxiosResponse = await axios.get(`${process.env.ND_BASE_URL}/${id}`);

    const series = await seriesStreamScrape(req, AxiosResponse);

    res.status(200).json({ message: "Series Details", data: series });
  } catch (error) {
    console.log(error);
  }
};

const createCategoriesController = (endpoint: string): TController => {
  return async (req, res, next) => {
    const { param } = req.params;
    const { page = 1 } = req.query;

    const AxiosResponse = await axios.get(
      `${process.env.ND_BASE_URL}/${endpoint}/${param}/page/${Number(page)}`,
    );

    const payload = await seriesScrape(req, AxiosResponse);

    res.status(200).json({ data: payload });
  };
};

export const genreSeries = createCategoriesController("genre");

export const countryseries = createCategoriesController("country");
