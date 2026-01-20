import { AxiosResponse } from "axios";
import { Request } from "express";
import * as cheerio from "cheerio";
import { IEpisode, IMovie, ISeries, ISeriesDetail, IStream } from "@/types";
import { cleanText } from "@/util/clean-text";

export const seriesScrape = async (req: Request, res: AxiosResponse) => {
  try {
    const $: cheerio.CheerioAPI = cheerio.load(res.data);

    const payload: ISeries[] = [];

    $(".gallery-grid article").each((index, element) => {
      const obj = {} as ISeries;

      obj["_id"] = $(element).find("a").attr("href")?.split("/").pop() || "";
      obj["type"] = "series";
      obj["title"] = $(element).find("h3").text().trim();
      obj["poster"] = $(element).find("img").attr("src");
      obj["year"] = parseInt($(element).find(".year").text().trim()) || 0;
      obj["rating"] = $(element).find("[itemprop='ratingValue']").text().trim();
      obj["genre"] = $(element).find(".genre").text().trim().split(",");
      obj["episodeLabel"] = Number(
        $(element).find(".episode strong").text().trim(),
      );

      payload.push(obj);
    });

    return payload;
  } catch (error) {
    console.error(error);
  }
};

export const detailSeriesScrape = async (req: Request, res: AxiosResponse) => {
  try {
    const $: cheerio.CheerioAPI = cheerio.load(res.data);

    const obj = {} as ISeriesDetail;
    let episodesList: IEpisode[] = [];

    obj["title"] = $(".movie-info h1").text().trim();
    obj["type"] = "series";
    obj["description"] = cleanText($("div.synopsis").html()?.trim());

    const script = $("#season-data");
    if (!script.length) return [];
    const json = JSON.parse(script.text());

    episodesList = Object.values(json)
      .flat()
      .map((ep: any) => ({
        season: ep.s,
        title: ep.title,
        slug: ep.slug,
      }));

    obj["episodes"] = episodesList;

    return obj;
  } catch (error) {
    console.error(error);
  }
};

export const seriesStreamScrape = async (req: Request, res: AxiosResponse) => {
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
