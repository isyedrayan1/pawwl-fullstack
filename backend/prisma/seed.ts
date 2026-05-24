import bcrypt from "bcryptjs";
import { PrismaClient, Prisma } from "@prisma/client";
import { uniqueSlug } from "../src/lib/slug.js";
import { createId } from "@paralleldrive/cuid2";

const prisma = new PrismaClient();

const main = async () => {
  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? "admin@pawwl.local";
  const adminUsername = process.env.SEED_ADMIN_USERNAME ?? "admin";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? "ChangeMe123!";
  const passwordHash = await bcrypt.hash(adminPassword, 12);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { role: "admin", status: "active", username: adminUsername },
    create: {
      id: createId(),
      name: "Pawwl Admin",
      username: adminUsername,
      email: adminEmail,
      passwordHash,
      role: "admin",
    },
  });

  const starterProducts = [
    {
      name: "Premium Adult Kibble",
      slug: "premium-adult-kibble",
      category: "In-house Food",
      price: 799,
      salePrice: 699,
      gstPrice: 799,
      stock: 50,
      image: "/assets/products/bag1.webp",
      description: "Our Premium Adult Kibble is meticulously crafted to provide a balanced and nutritionally dense diet for adult dogs of all breeds. Utilizing high-quality protein sources and wholesome grains, this formula supports sustained energy levels, lean muscle maintenance, and overall vitality.",
      benefits: ["Optimized protein-to-fat ratio for healthy weight management.", "Fortified with Omega-3 and Omega-6 fatty acids for a lustrous coat.", "Contains natural prebiotics to support robust digestive health.", "Specially shaped kibble to help reduce plaque and tartar buildup."],
      ingredients: "Deboned Poultry, Brown Rice, Sweet Potatoes, Peas, Flaxseed, Blueberries, Spinach, Probiotics, Vitamin E Supplement, Zinc Proteinate.",
      usage: "Feed according to your dog's weight. Transition slowly over 7-10 days by mixing with current food.",
      rating: "4.9",
      reviewCount: 342,
    },
    {
      name: "Luxury Comfort Collar Set",
      slug: "luxury-comfort-collar-set",
      category: "Accessories",
      price: 499,
      salePrice: null,
      gstPrice: 499,
      stock: 30,
      image: "/assets/products/collar1.webp",
      description: "Experience the perfect blend of elegance and functionality with our Luxury Comfort Collar Set. Hand-finished with premium materials and reinforced stitching, this set is designed to provide maximum security while ensuring your pet's comfort during daily walks and adventures.",
      benefits: ["Ergonomic design prevents chafing and throat pressure.", "Weather-resistant hardware for long-lasting performance.", "Soft-touch inner padding for all-day comfort.", "Quick-release safety buckle for easy handling."],
      ingredients: null,
      usage: "Adjust to fit comfortably, ensuring two fingers can fit between the collar and your pet's neck.",
      rating: "4.8",
      reviewCount: 185,
    },
    {
      name: "Ergonomic Pet Food Bowl",
      slug: "ergonomic-pet-food-bowl",
      category: "Pawwl Select Product",
      price: 599,
      salePrice: 499,
      gstPrice: 599,
      stock: 40,
      image: "/assets/products/bowl1.webp",
      description: "Elevate your pet's dining experience with our Ergonomic Pet Food Bowl. Featuring a weighted non-slip base and a modern aesthetic, this bowl is designed to reduce neck strain and prevent spills, making mealtime cleaner and more comfortable for your furry companion.",
      benefits: ["Weighted base prevents tipping and sliding during meals.", "Food-grade, non-toxic ceramic for superior hygiene.", "Sleek minimalist design complements any home decor.", "Wide-mouth design reduces whisker fatigue for cats."],
      ingredients: null,
      usage: "Suitable for both wet and dry food. Dishwasher safe for easy cleaning.",
      rating: "4.7",
      reviewCount: 124,
    },
    {
      name: "Puppy Support Nutrition",
      slug: "puppy-support-nutrition",
      category: "In-house Food",
      price: 899,
      salePrice: 799,
      gstPrice: 899,
      stock: 35,
      image: "/assets/products/bag2.webp",
      description: "Give your puppy the best start in life with our specialized Puppy Support Nutrition. Rich in DHA for brain development and essential minerals for bone growth, this recipe provides the precise calories and nutrients needed for the critical developmental months.",
      benefits: ["Rich in DHA to support cognitive and visual development.", "Balanced calcium and phosphorus for strong skeletal growth.", "Enhanced antioxidants to boost a developing immune system.", "Gentle formula tailored for sensitive young stomachs."],
      ingredients: "High-quality Chicken, Oatmeal, Carrots, Salmon Oil, Dried Kelp, Taurine, Vitamin D3 Supplement, Iron Proteinate.",
      usage: "Divide daily servings into 3-4 meals. Refer to the puppy growth chart on packaging.",
      rating: "4.9",
      reviewCount: 215,
    },
    {
      name: "Professional Retractable Leash",
      slug: "professional-retractable-leash",
      category: "Accessories",
      price: 699,
      salePrice: 599,
      gstPrice: 699,
      stock: 45,
      image: "/assets/products/collar2.webp",
      description: "Our Professional Retractable Leash offers your pet the freedom to explore while giving you ultimate control. The smooth braking system and tangle-free tape ensure a safe and enjoyable walking experience in any environment.",
      benefits: ["High-strength nylon tape for reliable durability.", "One-handed braking and locking mechanism for safety.", "Reflective stitching for enhanced low-light visibility.", "Ergonomic handle grip for superior comfort."],
      ingredients: null,
      usage: "Use for walking in open spaces. Not recommended for tie-out or training correction.",
      rating: "4.6",
      reviewCount: 98,
    },
    {
      name: "Home Grooming Professional Kit",
      slug: "home-grooming-professional-kit",
      category: "Grooming",
      price: 2499,
      salePrice: 1999,
      gstPrice: 2499,
      stock: 20,
      image: "/assets/products/kit1.webp",
      description: "Maintain your pet's salon-fresh look at home with our Professional Grooming Kit. This collection of designer tools is curated to handle regular maintenance, dematting, and bathing, ensuring your pet always feels and looks their best.",
      benefits: ["Includes professional-grade stainless steel tools.", "Suited for all coat types and lengths.", "Reduces shedding and prevents painful mats.", "Ergonomic handles to reduce hand fatigue during use."],
      ingredients: null,
      usage: "Inquire about specific tool instructions for different coat textures.",
      rating: "4.8",
      reviewCount: 156,
    },
    {
      name: "Advanced Health Supplements",
      slug: "advanced-health-supplements",
      category: "Health & Supplements",
      price: 1299,
      salePrice: 999,
      gstPrice: 1299,
      stock: 60,
      image: "/assets/products/supp1.webp",
      description: "Support your pet's long-term wellness with our Advanced Health Supplements. Formulated by experts to target joint mobility, digestive health, and immune support, these supplements provide the extra care your pet needs as they age.",
      benefits: ["Glucosamine and Chondroitin for joint stability.", "Probiotic blend for improved nutrient absorption.", "Natural antioxidants to fight oxidative stress.", "Easy-to-administer soft chews pets love."],
      ingredients: "Glucosamine HCl, Methylsulfonylmethane (MSM), Chondroitin Sulfate, Yucca Schidigera, Vitamin C, Dried Lactobacillus.",
      usage: "Administer daily according to pet's weight. Consult with a veterinarian before use.",
      rating: "4.9",
      reviewCount: 290,
    },
  ];

  for (const item of starterProducts) {
    await prisma.product.upsert({
      where: { slug: item.slug },
        update: {
          description: item.description,
          benefits: JSON.stringify(item.benefits),
          ingredients: item.ingredients,
          usage: item.usage,
          rating: item.rating,
          reviewCount: item.reviewCount,
        },
      create: {
        id: createId(),
        name: item.name,
        slug: item.slug,
        category: item.category,
        description: item.description,
        images: JSON.stringify([item.image]),
        status: "published",
        benefits: JSON.stringify(item.benefits),
        ingredients: item.ingredients,
        usage: item.usage,
        rating: item.rating,
        reviewCount: item.reviewCount,
        productvariant: {
          create: {
            id: createId(),
            name: "Standard",
            price: new Prisma.Decimal(item.price),
            salePrice: item.salePrice ? new Prisma.Decimal(item.salePrice) : null,
            gstPrice: new Prisma.Decimal(item.gstPrice),
            stock: item.stock,
            isActive: true,
          },
        },
      },
    });
  }

  console.log(`✅ Seed complete. Admin: ${adminEmail} | 7 products added`);
};

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
