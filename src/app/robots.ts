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
    sitemap: "https://bblaze-cabinet-f7zk.vercel.app/sitemap.xml",
  };
}
