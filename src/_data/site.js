const url = "https://wiveliscombecivicsociety.org.uk";

export default {
  name: "Wiveliscombe Civic and Historical Society",
  description:
    "Informing, engaging and supporting the Wiveliscombe community since 1997.",
  // Production URL. Also builds the canonical and Open Graph URLs, structured
  // data, the sitemap and the contact form's redirect, so it must match the
  // primary hostname.
  url,
  ogImage: "/img/og-default.png",
  nav: [
    { label: "Home", url: "/" },
    { label: "About", url: "/about/" },
    { label: "Community Matters", url: "/community-matters/" },
    { label: "Wivey Talks", url: "/wivey-talks/" },
    { label: "Contact", url: "/contact/" },
  ],
  // Site-wide Organization structured data, emitted on every page.
  organization: {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${url}/#organization`,
    name: "Wiveliscombe Civic and Historical Society",
    alternateName: "Wiveliscombe Civic Society",
    url: `${url}/`,
    logo: `${url}/img/logo.png`,
    description:
      "A volunteer-run civic society in Wiveliscombe, Somerset, founded in 1997. We monitor planning applications, run the Wivey Talks programme and promote local history.",
    foundingDate: "1997",
    email: "homeshaw@btopenworld.com",
    telephone: "+44 1984 624564",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Wiveliscombe",
      addressRegion: "Somerset",
      addressCountry: "GB",
    },
    areaServed: {
      "@type": "City",
      name: "Wiveliscombe",
    },
  },
};
