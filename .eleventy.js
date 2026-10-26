import { mkdirSync, writeFileSync } from "fs";
import { resolve } from "path";
import { formatDate } from "./src/_lib/format-date.js";

export default function (eleventyConfig) {
  eleventyConfig.addFilter("displayDate", formatDate);

  eleventyConfig.addCollection("talks", (collectionApi) =>
    collectionApi
      .getFilteredByTag("talk")
      .sort((a, b) => new Date(a.data.date) - new Date(b.data.date)),
  );

  eleventyConfig.addCollection("applications", (collectionApi) =>
    collectionApi
      .getFilteredByTag("application")
      .sort((a, b) => new Date(b.data.submitted) - new Date(a.data.submitted)),
  );

  // Working notes, not published content.
  eleventyConfig.ignores.add("src/plan.md");

  eleventyConfig.addPassthroughCopy({
    "node_modules/@fontsource/inter/files": "fonts/inter",
  });
  eleventyConfig.addPassthroughCopy("src/js");
  eleventyConfig.addPassthroughCopy("src/images");
  eleventyConfig.addPassthroughCopy("src/favicon.svg");

  eleventyConfig.on("eleventy.before", async ({ dir }) => {
    const { bundle } = await import("lightningcss");
    const outDir = resolve(dir.output, "css");
    mkdirSync(outDir, { recursive: true });
    const { code } = bundle({
      filename: resolve("src/css/main.css"),
      minify: true,
      targets: { chrome: 111, firefox: 111, safari: 16 },
    });
    writeFileSync(resolve(outDir, "main.css"), code);
  });

  eleventyConfig.addWatchTarget("src/css/");
  eleventyConfig.addWatchTarget("src/components/");
  eleventyConfig.addWatchTarget("src/_lib/");

  return {
    dir: {
      input: "src",
      output: "dist",
      includes: "_includes",
      data: "_data",
    },
    templateFormats: ["njk", "md", "html"],
    htmlTemplateEngine: "njk",
  };
}
