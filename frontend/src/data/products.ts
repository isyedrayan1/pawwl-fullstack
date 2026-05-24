export interface Product {
  id: string;
  title: string;
  category: string;
  subtitle: string;
  description: string;
  benefits: string[];
  ingredients?: string;
  usage: string;
  rating: string;
  reviewCount: number;
  images: string[];
  sizes: string[];
  tag?: string;
  slug: string;
}

export const products: Product[] = [
  {
    id: "1",
    slug: "premium-adult-kibble",
    title: "Premium Adult Kibble",
    subtitle: "High-Protein Nutritional Formula",
    category: "In-house Food",
    description: "Our Premium Adult Kibble is meticulously crafted to provide a balanced and nutritionally dense diet for adult dogs of all breeds. Utilizing high-quality protein sources and wholesome grains, this formula supports sustained energy levels, lean muscle maintenance, and overall vitality.",
    benefits: [
      "Optimized protein-to-fat ratio for healthy weight management.",
      "Fortified with Omega-3 and Omega-6 fatty acids for a lustrous coat.",
      "Contains natural prebiotics to support robust digestive health.",
      "Specially shaped kibble to help reduce plaque and tartar buildup."
    ],
    ingredients: "Deboned Poultry, Brown Rice, Sweet Potatoes, Peas, Flaxseed, Blueberries, Spinach, Probiotics, Vitamin E Supplement, Zinc Proteinate.",
    usage: "Feed according to your dog's weight. Transition slowly over 7-10 days by mixing with current food.",
    rating: "4.9",
    reviewCount: 342,
    images: ["/assets/products/bag1.webp"],
    sizes: ["5 lb", "15 lb", "30 lb"],
    tag: "Best Seller"
  },
  {
    id: "2",
    slug: "luxury-comfort-collar-set",
    title: "Luxury Comfort Collar Set",
    subtitle: "Handcrafted Durability & Style",
    category: "Accessories",
    description: "Experience the perfect blend of elegance and functionality with our Luxury Comfort Collar Set. Hand-finished with premium materials and reinforced stitching, this set is designed to provide maximum security while ensuring your pet's comfort during daily walks and adventures.",
    benefits: [
      "Ergonomic design prevents chafing and throat pressure.",
      "Weather-resistant hardware for long-lasting performance.",
      "Soft-touch inner padding for all-day comfort.",
      "Quick-release safety buckle for easy handling."
    ],
    usage: "Adjust to fit comfortably, ensuring two fingers can fit between the collar and your pet's neck.",
    rating: "4.8",
    reviewCount: 185,
    images: ["/assets/products/collar1.webp"],
    sizes: ["Small", "Medium", "Large"],
    tag: "New"
  },
  {
    id: "3",
    slug: "ergonomic-pet-food-bowl",
    title: "Ergonomic Pet Food Bowl",
    subtitle: "Aesthetic & Functional Dining",
    category: "Pawwl Select Product",
    description: "Elevate your pet's dining experience with our Ergonomic Pet Food Bowl. Featuring a weighted non-slip base and a modern aesthetic, this bowl is designed to reduce neck strain and prevent spills, making mealtime cleaner and more comfortable for your furry companion.",
    benefits: [
      "Weighted base prevents tipping and sliding during meals.",
      "Food-grade, non-toxic ceramic for superior hygiene.",
      "Sleek minimalist design complements any home decor.",
      "Wide-mouth design reduces whisker fatigue for cats."
    ],
    usage: "Suitable for both wet and dry food. Dishwasher safe for easy cleaning.",
    rating: "4.7",
    reviewCount: 124,
    images: ["/assets/products/bowl1.webp"],
    sizes: ["Standard", "Large"]
  },
  {
    id: "4",
    slug: "puppy-support-nutrition",
    title: "Puppy Support Nutrition",
    subtitle: "Foundation for Healthy Growth",
    category: "In-house Food",
    description: "Give your puppy the best start in life with our specialized Puppy Support Nutrition. Rich in DHA for brain development and essential minerals for bone growth, this recipe provides the precise calories and nutrients needed for the critical developmental months.",
    benefits: [
      "Rich in DHA to support cognitive and visual development.",
      "Balanced calcium and phosphorus for strong skeletal growth.",
      "Enhanced antioxidants to boost a developing immune system.",
      "Gentle formula tailored for sensitive young stomachs."
    ],
    ingredients: "High-quality Chicken, Oatmeal, Carrots, Salmon Oil, Dried Kelp, Taurine, Vitamin D3 Supplement, Iron Proteinate.",
    usage: "Divide daily servings into 3-4 meals. Refer to the puppy growth chart on packaging.",
    rating: "4.9",
    reviewCount: 215,
    images: ["/assets/products/bag2.webp"],
    sizes: ["4 lb", "12 lb"],
    tag: "Popular"
  },
  {
    id: "5",
    slug: "professional-retractable-leash",
    title: "Professional Retractable Leash",
    subtitle: "Freedom and Control Combined",
    category: "Accessories",
    description: "Our Professional Retractable Leash offers your pet the freedom to explore while giving you ultimate control. The smooth braking system and tangle-free tape ensure a safe and enjoyable walking experience in any environment.",
    benefits: [
      "High-strength nylon tape for reliable durability.",
      "One-handed braking and locking mechanism for safety.",
      "Reflective stitching for enhanced low-light visibility.",
      "Ergonomic handle grip for superior comfort."
    ],
    usage: "Use for walking in open spaces. Not recommended for tie-out or training correction.",
    rating: "4.6",
    reviewCount: 98,
    images: ["/assets/products/collar2.webp"],
    sizes: ["16ft / Up to 50 lbs"]
  },
  {
    id: "6",
    slug: "home-grooming-professional-kit",
    title: "Home Grooming Professional Kit",
    subtitle: "Complete Care at Your Fingertips",
    category: "Grooming",
    description: "Maintain your pet's salon-fresh look at home with our Professional Grooming Kit. This collection of designer tools is curated to handle regular maintenance, dematting, and bathing, ensuring your pet always feels and looks their best.",
    benefits: [
      "Includes professional-grade stainless steel tools.",
      "Suited for all coat types and lengths.",
      "Reduces shedding and prevents painful mats.",
      "Ergonomic handles to reduce hand fatigue during use."
    ],
    usage: "Inquire about specific tool instructions for different coat textures.",
    rating: "4.8",
    reviewCount: 156,
    images: ["/assets/products/kit1.webp"],
    sizes: ["Full Set"],
    tag: "Featured"
  },
  {
    id: "7",
    slug: "advanced-health-supplements",
    title: "Advanced Health Supplements",
    subtitle: "Holistic Wellness Support",
    category: "Health & Supplements",
    description: "Support your pet's long-term wellness with our Advanced Health Supplements. Formulated by experts to target joint mobility, digestive health, and immune support, these supplements provide the extra care your pet needs as they age.",
    benefits: [
      "Glucosamine and Chondroitin for joint stability.",
      "Probiotic blend for improved nutrient absorption.",
      "Natural antioxidants to fight oxidative stress.",
      "Easy-to-administer soft chews pets love."
    ],
    ingredients: "Glucosamine HCl, Methylsulfonylmethane (MSM), Chondroitin Sulfate, Yucca Schidigera, Vitamin C, Dried Lactobacillus.",
    usage: "Administer daily according to pet's weight. Consult with a veterinarian before use.",
    rating: "4.9",
    reviewCount: 290,
    images: ["/assets/products/supp1.webp"],
    sizes: ["60 Soft Chews", "120 Soft Chews"],
    tag: "Popular"
  }
];
