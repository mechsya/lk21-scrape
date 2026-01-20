export interface IMovie {
  _id: string;
  title: string;
  type: "movie" | "series";
  poster: string | undefined;
  year: number;
  rating: string;
  genre: string[];
}

export interface IMovieDetail extends IMovie {
  description: string | undefined;
  director: string;
  cast: string[];
  duration: string;
  similar: IMovie[];
}

export interface IStream {
  provider: string;
  link: string;
}

export interface IEpisode {
  season: number;
  title: string;
  slug: string;
}

export interface ISeries extends IMovie {
  episodeLabel: number;
}

export interface ISeriesDetail extends ISeries {
  episodes: IEpisode[];
  description: string;
  director: string;
  cast: string[];
}
