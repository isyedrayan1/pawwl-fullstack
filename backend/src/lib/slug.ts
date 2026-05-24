export const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90);

export const uniqueSlug = (name: string, suffix?: string | number) => {
  const base = slugify(name) || "product";
  return suffix ? `${base}-${suffix}` : base;
};
