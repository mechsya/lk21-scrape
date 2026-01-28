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

const router: IRouter = Router();

// movies
router.get("/movies/latest", latestMovie);
router.get("/movies/rating", ratingMovies);
router.get("/movies/populer", populerMovies);
router.get("/movies/:id", detailMovie);
router.get("/movies/:id/stream", streamMovie);
router.get("/movies/genre/:param", genreMovie);
router.get("/movies/country/:param", countryMovie);

// series
router.get("/series/latest", latestSeries);
router.get("/series/populer", populerSeries);
router.get("/series/rating", ratingSeries);
router.get("/series/ongoing", ongoingSeries);
router.get("/series/:id", detailSeries);
router.get("/series/:id/stream", streamSeries);
router.get("/series/genre/:param", genreSeries);
router.get("/series/country/:param", countryseries);

export default router;
