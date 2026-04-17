
The user wants to temporarily hide (not delete) the Products-related UI so it can be re-enabled later. Specifically:

1. **Home page** — hide the `FeaturedProducts` section
2. **Products page route** — hide/disable so visiting `/products` doesn't show it
3. **Navbar** — hide the Cart icon, Heart/Favorites icon, and the "Products" nav link (both desktop + mobile)

Keep all the code intact (just commented out or conditionally hidden) so the client can restore them later.

## Changes

### 1. `src/pages/Index.tsx`
- Comment out the `<FeaturedProducts />` line (keep the import).

### 2. `src/components/Navbar.tsx`
- Remove "Products" from the `navLinks` array (comment it out).
- Hide the desktop Cart button + Favorites button (wrap in `{false && ...}` or comment).
- Hide the mobile Cart button + mobile Favorites list item.
- Keep `useCart` hook + handlers intact (no logic deletion).

### 3. `src/App.tsx`
- Keep `/products` and `/products/:id` routes but redirect to `/` (or render `NotFound`) so visiting the URL doesn't expose the page. Keep imports so it's a one-line revert.

### What stays untouched
- `CartContext`, `SideDrawer`, `Products.tsx`, `ProductDetails.tsx`, `FeaturedProducts.tsx` files — all preserved
- All other pages, hero sections, design, layout
- Cart/favorites state logic — still functional under the hood

### Revert path (for future)
- Uncomment `<FeaturedProducts />` in Index
- Uncomment Products link + cart/heart icons in Navbar
- Restore `/products` routes in App.tsx

