import site from "../../_data/site.js";
import { formatDate, toEventStart } from "../../_lib/format-date.js";

// One Markdown file per talk. The filename is the URL slug, so keep it stable:
// /wivey-talks/<filename>/.
//
// `image` is a base path for a square image. Templates request
// <image>-{400,800,1200}.jpg from src/images/talks/. `imageAlt` is optional;
// omit it for decorative images.

function buildDescription(data) {
  return [data.title, data.byline, data.date ? formatDate(data.date) : ""]
    .filter(Boolean)
    .join(". ");
}

export default {
  layout: "talk.njk",
  tags: ["talk"],
  permalink: "/wivey-talks/{{ page.fileSlug }}/",
  heroEyebrow: "Wivey Talks",
  ogType: "article",
  eleventyComputed: {
    description: buildDescription,
    ogImage: (data) => `${data.image}-1200.jpg`,
    ogImageAlt: (data) => data.imageAlt || data.title,
    schema: (data) => ({
      "@context": "https://schema.org",
      "@type": "Event",
      name: data.title,
      startDate: toEventStart(data.date, data.time),
      eventStatus: "https://schema.org/EventScheduled",
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      description: buildDescription(data),
      url: `${site.url}/wivey-talks/${data.page.fileSlug}/`,
      image: [`${site.url}${data.image}-1200.jpg`],
      location: {
        "@type": "Place",
        name: "St Andrew's Church, Wiveliscombe",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Wiveliscombe",
          addressRegion: "Somerset",
          addressCountry: "GB",
        },
      },
      organizer: { "@id": `${site.url}/#organization` },
      isAccessibleForFree: false,
      offers: {
        "@type": "Offer",
        price: "5.00",
        priceCurrency: "GBP",
        availability: "https://schema.org/InStock",
        description: "£5 for visitors on the door; free to members.",
        url: `${site.url}/wivey-talks/`,
      },
    }),
  },
};
