export const isAdminHost = () =>
  typeof window !== "undefined" && window.location.hostname.startsWith("admin.");

export const adminPath = (path = "") => {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return isAdminHost() ? cleanPath : `/admin${cleanPath === "/" ? "" : cleanPath}`;
};
