// src/server.ts
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import cors from "cors";

// src/util/clean-text.ts
import * as cheerio from "cheerio";
var cleanText = (text) => {
  const clean = cheerio.load(`<div>${text}</div>`).text().replace(/\s+/g, " ").trim();
  return clean;
};

// src/scrapers/movie.ts
import * as cheerio2 from "cheerio";
var moviesScrape = async (req, res) => {
  try {
    const $ = cheerio2.load(res.data);
    const payload = [];
    $(".gallery-grid article").each((index, element) => {
      const obj = {};
      obj["_id"] = $(element).find("a").attr("href")?.split("/").pop() || "";
      obj["type"] = "movie";
      obj["title"] = $(element).find("h3").text().trim();
      obj["poster"] = $(element).find("img").attr("src");
      obj["year"] = parseInt($(element).find(".year").text().trim()) || 0;
      obj["rating"] = $(element).find("[itemprop='ratingValue']").text().trim();
      obj["genre"] = $(element).find(".genre").text().trim().split(",");
      payload.push(obj);
    });
    return payload;
  } catch (error) {
    console.error(error);
  }
};
var movieDetailScrape = async (req, res) => {
  try {
    const $ = cheerio2.load(res.data);
    const obj = {};
    const similarMovies = [];
    obj["title"] = $(".movie-info h1").text().trim();
    obj["director"] = $(".detail p").eq(1).find("a").text().trim();
    obj["cast"] = $(".detail p").eq(2).find("a").map((i, el) => $(el).text().trim()).get();
    obj["description"] = cleanText($("div.synopsis").html()?.trim());
    obj["duration"] = $(".info-tag span").last().text().trim();
    $(".video-list a").each((i, el) => {
      const movieObj = {};
      movieObj["_id"] = $(el).attr("href")?.split("/").pop() || "";
      movieObj["type"] = "movie";
      movieObj["title"] = $(el).find(".video-title").text().trim();
      movieObj["poster"] = $(el).find("img").attr("src");
      similarMovies.push(movieObj);
    });
    obj["similar"] = similarMovies;
    return obj;
  } catch (error) {
    console.log(error);
  }
};
var movieStreamScrape = async (req, res) => {
  try {
    const $ = cheerio2.load(res.data);
    const streams = [];
    $("#player-list a").each((i, el) => {
      streams.push({
        provider: $(el).text().trim() || "",
        link: $(el).attr("href") || ""
      });
    });
    return streams;
  } catch (error) {
    console.error(error);
  }
};

// src/controllers/movie.ts
import axios from "axios";
var createMovieController = (endpoint, message) => {
  return async (req, res, next) => {
    try {
      const { page = 1 } = req.query;
      const AxiosResponse = await axios.get(
        `${process.env.LK21_BASE_URL}/${endpoint}/page/${Number(page)}`
      );
      const payload = await moviesScrape(req, AxiosResponse);
      res.status(200).json({ message, data: payload });
    } catch (error) {
      console.error(error);
    }
  };
};
var latestMovie = createMovieController("latest", "Latest Movies");
var ratingMovies = createMovieController("rating", "Best Rating");
var populerMovies = createMovieController("populer", "Populer");
var detailMovie = async (req, res, next) => {
  try {
    const { id } = req.params;
    const AxiosResponse = await axios.get(`${process.env.LK21_BASE_URL}/${id}`);
    const movie = await movieDetailScrape(req, AxiosResponse);
    res.status(200).json({ message: "Movie Details", data: movie });
  } catch (error) {
    console.log(error);
  }
};
var streamMovie = async (req, res, next) => {
  try {
    const { id } = req.params;
    const AxiosResponse = await axios.get(`${process.env.LK21_BASE_URL}/${id}`);
    const movie = await movieStreamScrape(req, AxiosResponse);
    res.status(200).json({ message: "Movie Details", data: movie });
  } catch (error) {
    console.log(error);
  }
};
var createCategoriesController = (endpoint) => {
  return async (req, res, next) => {
    const { param } = req.params;
    const { page = 1 } = req.query;
    const AxiosResponse = await axios.get(
      `${process.env.LK21_BASE_URL}/${endpoint}/${param}/page/${Number(page)}`
    );
    const payload = await moviesScrape(req, AxiosResponse);
    res.status(200).json({ data: payload });
  };
};
var genreMovie = createCategoriesController("genre");
var countryMovie = createCategoriesController("country");

// src/scrapers/series.ts
import * as cheerio3 from "cheerio";
var seriesScrape = async (req, res) => {
  try {
    const $ = cheerio3.load(res.data);
    const payload = [];
    $(".gallery-grid article").each((index, element) => {
      const obj = {};
      obj["_id"] = $(element).find("a").attr("href")?.split("/").pop() || "";
      obj["type"] = "series";
      obj["title"] = $(element).find("h3").text().trim();
      obj["poster"] = $(element).find("img").attr("src");
      obj["year"] = parseInt($(element).find(".year").text().trim()) || 0;
      obj["rating"] = $(element).find("[itemprop='ratingValue']").text().trim();
      obj["genre"] = $(element).find(".genre").text().trim().split(",");
      obj["episodeLabel"] = Number(
        $(element).find(".episode strong").text().trim()
      );
      payload.push(obj);
    });
    return payload;
  } catch (error) {
    console.error(error);
  }
};
var detailSeriesScrape = async (req, res) => {
  try {
    const $ = cheerio3.load(res.data);
    const obj = {};
    let episodesList = [];
    obj["title"] = $(".movie-info h1").text().trim();
    obj["type"] = "series";
    obj["description"] = cleanText($("div.synopsis").html()?.trim());
    const script = $("#season-data");
    if (!script.length) return [];
    const json = JSON.parse(script.text());
    episodesList = Object.values(json).flat().map((ep) => ({
      season: ep.s,
      title: ep.title,
      slug: ep.slug
    }));
    obj["episodes"] = episodesList;
    return obj;
  } catch (error) {
    console.error(error);
  }
};
var seriesStreamScrape = async (req, res) => {
  try {
    const $ = cheerio3.load(res.data);
    const streams = [];
    $("#player-list a").each((i, el) => {
      streams.push({
        provider: $(el).text().trim() || "",
        link: $(el).attr("href") || ""
      });
    });
    return streams;
  } catch (error) {
    console.error(error);
  }
};

// src/controllers/series.ts
import axios2 from "axios";
var createSeriesController = (endpoint, message) => {
  return async (req, res, next) => {
    try {
      const { page = 1 } = req.query;
      const AxiosResponse = await axios2.get(
        `${process.env.ND_BASE_URL}/${endpoint}/page/${Number(page)}`
      );
      const series = await seriesScrape(req, AxiosResponse);
      res.status(200).json({ message, data: series });
    } catch (error) {
      console.error(error);
    }
  };
};
var latestSeries = createSeriesController("latest", "Latest Series");
var populerSeries = createSeriesController(
  "populer",
  "Populer Series"
);
var ratingSeries = createSeriesController(
  "rating",
  "Best Rating Series"
);
var ongoingSeries = createSeriesController(
  "series/ongoing",
  "Ongoing Series"
);
var detailSeries = async (req, res, next) => {
  try {
    const { id } = req.params;
    const AxiosResponse = await axios2.get(`${process.env.ND_BASE_URL}/${id}`);
    const series = await detailSeriesScrape(req, AxiosResponse);
    res.status(200).json({ message: "Series Details", data: series });
  } catch (error) {
    console.log(error);
  }
};
var streamSeries = async (req, res, next) => {
  try {
    const { id } = req.params;
    const AxiosResponse = await axios2.get(`${process.env.ND_BASE_URL}/${id}`);
    const series = await seriesStreamScrape(req, AxiosResponse);
    res.status(200).json({ message: "Series Details", data: series });
  } catch (error) {
    console.log(error);
  }
};
var createCategoriesController2 = (endpoint) => {
  return async (req, res, next) => {
    const { param } = req.params;
    const { page = 1 } = req.query;
    const AxiosResponse = await axios2.get(
      `${process.env.ND_BASE_URL}/${endpoint}/${param}/page/${Number(page)}`
    );
    const payload = await seriesScrape(req, AxiosResponse);
    res.status(200).json({ data: payload });
  };
};
var genreSeries = createCategoriesController2("genre");
var countryseries = createCategoriesController2("country");

// src/routes/index.ts
import { Router } from "express";
var router = Router();
router.get("/movies/latest", latestMovie);
router.get("/movies/rating", ratingMovies);
router.get("/movies/populer", populerMovies);
router.get("/movies/:id", detailMovie);
router.get("/movies/:id/stream", streamMovie);
router.get("/movies/genre/:param", genreMovie);
router.get("/movies/country/:param", countryMovie);
router.get("/series/latest", latestSeries);
router.get("/series/populer", populerSeries);
router.get("/series/rating", ratingSeries);
router.get("/series/ongoing", ongoingSeries);
router.get("/series/:id", detailSeries);
router.get("/series/:id/stream", streamSeries);
router.get("/series/genre/:param", genreSeries);
router.get("/series/country/:param", countryseries);
var routes_default = router;

// src/server.ts
dotenv.config();
var app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(morgan("dev"));
app.use(cors({ origin: "*" }));
app.use(routes_default);
app.get("/", (request, response) => {
  response.json({ message: "API is working!" });
});
var server_default = app;

// src/app.ts
var port = Number(process.env.PORT) || 3e3;
server_default.listen(port, () => {
  console.log(`App Running on ${port}`);
});
//# sourceMappingURL=app.js.map