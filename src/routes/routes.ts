import {
  latestMovie,
  detailMovie,
  ratingMovies,
  populerMovies,
  streamMovie,
  genreMovie,
  countryMovie,
} from "../controllers/movie";
import {
  countryseries,
  detailSeries,
  genreSeries,
  latestSeries,
  ongoingSeries,
  populerSeries,
  ratingSeries,
  streamSeries,
} from "../controllers/series";
import { Router, IRouter } from "express";

const routes: IRouter = Router();

// movies
routes.get("/movies/latest", latestMovie);
routes.get("/movies/rating", ratingMovies);
routes.get("/movies/populer", populerMovies);
routes.get("/movies/:id", detailMovie);
routes.get("/movies/:id/stream", streamMovie);
routes.get("/movies/genre/:param", genreMovie);
routes.get("/movies/country/:param", countryMovie);

// series
routes.get("/series/latest", latestSeries);
routes.get("/series/populer", populerSeries);
routes.get("/series/rating", ratingSeries);
routes.get("/series/ongoing", ongoingSeries);
routes.get("/series/:id", detailSeries);
routes.get("/series/:id/stream", streamSeries);
routes.get("/series/genre/:param", genreSeries);
routes.get("/series/country/:param", countryseries);

export default routes;
