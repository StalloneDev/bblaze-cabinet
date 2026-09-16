export function getImageUrl(
  type: "post" | "service" | "about",
  id: string | number,
  imageUrl?: string | null
): string {
  if (!imageUrl) {
    if (type === "post") return "/hero-law.jpg";
    if (type === "service") return `/services/${id}.png`;
    return "/hero-law.jpg";
  }
  if (imageUrl.startsWith("data:image")) {
    return `/api/images/${type}/${id}`;
  }
  return imageUrl;
}
