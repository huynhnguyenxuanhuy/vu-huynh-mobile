const API_ORIGIN = (
  import.meta.env.VITE_API_URL || "http://localhost:5001/api"
).replace(/\/api\/?$/, "");

export const FALLBACK_PRODUCT_IMAGE =
  "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=1200&auto=format&fit=crop";

export const resolveImageUrl = (image) => {
  if (!image) {
    return FALLBACK_PRODUCT_IMAGE;
  }

  if (
    image.startsWith("http://") ||
    image.startsWith("https://") ||
    image.startsWith("data:")
  ) {
    return image;
  }

  return `${API_ORIGIN}${image.startsWith("/") ? image : `/${image}`}`;
};
