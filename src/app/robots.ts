import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/admin/dashboard"],
      },
    ],
    sitemap: `${process.env.NEXT_PUBLIC_SITE_URL || "https://cabinetbblaze.com"}/sitemap.xml`,
  };
}

