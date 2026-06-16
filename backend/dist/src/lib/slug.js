export const slugify = (value) => value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90);
export const uniqueSlug = (name, suffix) => {
    const base = slugify(name) || "product";
    return suffix ? `${base}-${suffix}` : base;
};
