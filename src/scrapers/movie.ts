import { IMovie, IMovieDetail, IStream } from "@/types";
import { cleanText } from "@/util/clean-text";
import { AxiosResponse } from "axios";
import * as cheerio from "cheerio";
import { Request } from "express";

export const moviesScrape = async (req: Request, res: AxiosResponse) => {
  try {
    const $: cheerio.CheerioAPI = cheerio.load(res.data);

    const payload: IMovie[] = [];

    $(".gallery-grid article").each((index, element) => {
      const obj = {} as IMovie;

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

export const movieDetailScrape = async (req: Request, res: AxiosResponse) => {
  try {
    const $: cheerio.CheerioAPI = cheerio.load(res.data);

    const obj = {} as IMovieDetail;

    const similarMovies: IMovie[] = [];

    obj["title"] = $(".movie-info h1").text().trim();
    obj["director"] = $(".detail p").eq(1).find("a").text().trim();
    obj["cast"] = $(".detail p")
      .eq(2)
      .find("a")
      .map((i, el) => $(el).text().trim())
      .get();
    obj["description"] = cleanText($("div.synopsis").html()?.trim());
    obj["duration"] = $(".info-tag span").last().text().trim();
    $(".video-list a").each((i, el) => {
      const movieObj = {} as IMovie;

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

export const movieStreamScrape = async (req: Request, res: AxiosResponse) => {
  try {
    const $: cheerio.CheerioAPI = cheerio.load(res.data);

    const streams: IStream[] = [];

    $("#player-list a").each((i, el) => {
      streams.push({
        provider: $(el).text().trim() || "",
        link: $(el).attr("href") || "",
      });
    });

    return streams;
  } catch (error) {
    console.error(error);
  }
};
