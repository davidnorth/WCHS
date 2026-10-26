// One Markdown file per planning application. The filename is the URL slug,
// so keep it stable: /community-matters/<filename>/.
export default {
  layout: "application.njk",
  tags: ["application"],
  permalink: "/community-matters/{{ page.fileSlug }}/",
  heroEyebrow: "Community Matters",
  eleventyComputed: {
    description: (data) =>
      [
        data.title,
        data.reference ? `Ref: ${data.reference}` : "",
        data.address,
        data.status ? `Status: ${data.status}` : "",
      ]
        .filter(Boolean)
        .join(". "),
  },
};
