import { formatDate } from "../../_lib/format-date.js";

// One Markdown file per talk. The filename is the URL slug, so keep it stable:
// /wivey-talks/<filename>/.
//
// `image` is a base path for a square image. Templates request
// <image>-{400,800,1200}.jpg from src/images/talks/. `imageAlt` is optional;
// omit it for decorative images.
export default {
  layout: "talk.njk",
  tags: ["talk"],
  permalink: "/wivey-talks/{{ page.fileSlug }}/",
  heroEyebrow: "Wivey Talks",
  eleventyComputed: {
    description: (data) => {
      const parts = [
        data.title,
        data.byline,
        data.date ? formatDate(data.date) : "",
      ].filter(Boolean);
      return parts.join(". ");
    },
  },
};
