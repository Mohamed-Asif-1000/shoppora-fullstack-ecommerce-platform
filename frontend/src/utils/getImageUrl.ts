export function getImageUrl(path: string | undefined | null): string {
  if (!path) return "/placeholder.svg";
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  const baseUrl = import.meta.env.VITE_API_URL || "";
  return `${baseUrl.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
}