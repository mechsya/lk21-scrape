import * as cheerio from "cheerio";

export const cleanText = (text: string | undefined): string => {
  const clean = cheerio
    .load(`<div>${text}</div>`)
    .text()
    .replace(/\s+/g, " ")
    .trim();

  return clean;
};
