import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://sufsracing.org",
      lastModified: new Date(),
    },
  ];
}