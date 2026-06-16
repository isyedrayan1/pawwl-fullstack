export const isAdminHost = () => false;

export const adminPath = (path = "") => {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `/admin${cleanPath === "/" ? "" : cleanPath}`;
};
