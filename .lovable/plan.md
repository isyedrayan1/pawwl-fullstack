

## Goal
Replace all Lorem ipsum + "Super Chewer" / duplicate placeholder names across the **Home page** and **Products page** with real, simple product names + short descriptions inspired by the client's actual shelf inventory (dry food, wet food, treats, dental chews, supplements, accessories, bowls). Layout, sizing, colors, images stay 100% untouched — text-only edits.

## Product naming pool (from shelf analysis)
| Type | Simple name | One-liner |
|---|---|---|
| Dry kibble (dog) | Premium Dog Kibble | Wholesome dry food for adult dogs — chicken & rice. |
| Dry kibble (puppy) | Puppy Starter Food | Balanced nutrition to fuel growing puppies. |
| Dry kibble (cat) | Adult Cat Dry Food | Crunchy bites packed with protein for adult cats. |
| Wet pouches | Tasty Cat Gravy Pouch | Soft chunks in rich gravy — irresistible for cats. |
| Treats (soft) | Smooth & Creamy Treats | Soft cat treats in salmon & chicken flavours. |
| Jerky sticks | Chicken Jerky Sticks | Slow-cooked meaty jerky — perfect training reward. |
| Dental chews | Dental Chew Sticks | Daily chews that clean teeth and freshen breath. |
| Bully bones | Long-Lasting Chew Bones | Tough chews to keep heavy chewers happy for hours. |
| Supplements | Pet Health Supplements | Drops & tablets for shiny coat and strong immunity. |
| Bowls | Stainless Steel Bowl | Sturdy non-slip bowl for food and water. |
| Collar/leash | Comfort Collar & Leash | Soft padded collar set for everyday walks. |
| Litter | Clumping Cat Litter | Odour-control litter that scoops easily. |

## Files to edit (text-only)

### 1. `src/components/Services.tsx` (Home — Services bento)
- **Main blue card** (line 31–34): "Super Chewer" → **"Long-Lasting Chew Bones"**, sub → "Tough chews for power chewers — 50% off this week."
- **Right top white card** (line 62–65): "Super Chewer" → **"Premium Dog Kibble"**, desc → "Wholesome dry food for adult dogs with real chicken and rice."
- **Right bottom white card** (line 90–93): "Super Chewer" → **"Tasty Cat Gravy Pouch"**, desc → "Soft chunks in rich gravy cats can't resist."
- **Desktop 3-card row** (line 122–123): all three say "Tasty Cat & Dog Food" → vary to **"Adult Cat Dry Food"**, **"Puppy Starter Food"**, **"Chicken Jerky Sticks"**, each with its own one-liner.
- **Accessories card** (line 147–148): keep title, replace lorem desc → "Collars, bowls, beds and grooming kits — everything pets need."
- **Day Care card** (line 169–170): keep title, lorem desc → "Safe daycare, grooming and pampering for your furry family."
- **Mobile 4-card grid** (line 194–199): vary names to **Adult Cat Dry Food / Puppy Starter Food / Chicken Jerky Sticks / Pet Accessories** with matching short descriptions.
- **Mobile day-care** (line 228): replace lorem.

### 2. `src/components/Blogs.tsx` (Home — Blogs)
- Two blogs both say "Premium Grooming Care". Change second to **"Choosing the Right Pet Food"** with a real one-liner about picking dry vs wet food.

### 3. `src/pages/Products.tsx` (Products page)
- **Categories row** (line 60–66): Already realistic — keep but adjust counts/labels: Food bowls, Pet Toys, Treats, Dry Food, Wet Food, Pet Beds.
- **Main premium product card** (line 109): "Pawwl Premium Kibble" → keep (it's good). Subtitle "In-house Nutrition" stays.
- **Side column items** (line 121–122):
  - "Comfort Collar Set" → keep, category "Accessories", tag "New"
  - "Pawwl Food Bowl for pets" → keep
- **Bottom 4-card grid** (line 144–147): rename to:
  - **Premium Dog Kibble** (In-house Food) — $34.99
  - **Comfort Collar & Leash** (Accessories) — $19.99
  - **Pet Grooming Kit** (Grooming) — $49.99
  - **Pet Health Supplements** (Health & Supplements) — $29.99

### 4. `src/components/FeaturedProducts.tsx`
Not used by Index — **skip** (no edit, no risk).

## What I will NOT touch
- Any layout, grid, sizing, colors, images, asset paths, image positioning, padding, fonts, animations.
- Hero sections on every page.
- About, Careers, Contact, Services page layout/text (only Home + Products page per request).
- Testimonial quotes (those are real testimonials, not placeholder).

## Constraints respected
- Descriptions kept ≤ ~10 words to fit existing card spaces and not break wraps.
- Names kept ≤ ~3 words to match existing typography sizes.
- No new sections, no new cards, no removed elements.

