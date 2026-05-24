import blogImg1 from "@/assets/Newgallery/IMG_5056.JPG.webp";
import blogImg2 from "@/assets/Newgallery/products/IMG_5035.JPG.webp";

// Additional product images for the product blog
import prod1 from "@/assets/Newgallery/products/IMG_5021.JPG.webp";
import prod2 from "@/assets/Newgallery/products/IMG_5017.JPG.webp";
import prod3 from "@/assets/Newgallery/products/IMG_5020.JPG.webp";
import prod4 from "@/assets/Newgallery/products/IMG_5024.JPG.webp";

export interface BlogPost {
  id: string;
  title: string;
  desc: string;
  date: string;
  category: string;
  mainImage: string;
  content: string;
  highlightImages?: string[];
}

export const blogs: BlogPost[] = [
  {
    id: "premium-grooming-studio",
    title: "Premium Grooming Studio: Why Your Pet Deserves More Than Just a Basic Wash",
    desc: "Grooming is not just about cleanliness; it's a vital part of your pet's overall health and happiness. Discover the Pawwl Studio difference.",
    date: "April 24, 2026",
    category: "Grooming",
    mainImage: blogImg1,
    content: `
      <p>Hello Pet Parents! Many people think that grooming is just about giving their dog or cat a quick bath. But in reality, professional grooming is a comprehensive health check and a pampering session combined into one.</p>
      
      <h3>The Professional Studio Experience</h3>
      <p>At Pawwl, we have built a <strong>state-of-the-art Professional Grooming Studio</strong>. Unlike traditional shops, our studio is designed to be a calm, spa-like environment for your pets. We use specialized equipment that reduces noise and vibration, making the experience stress-free even for the most anxious pets.</p>
      
      <p>Our studio features hydraulic grooming tables for safety, professional-grade blowers that don't overheat the skin, and a dedicated hygiene zone. Every tool we use is sterilized after each session to maintain the highest standards of safety.</p>

      <h3>Step-by-Step Premium Care</h3>
      <p>When you bring your pet to our studio, they go through a detailed process:</p>
      <ul>
        <li><strong>Pre-Grooming Assessment:</strong> We check for skin issues, lumps, or parasites before we even start.</li>
        <li><strong>Relaxing Massage Bath:</strong> We use premium shampoos tailored to your pet's specific coat type (oily, dry, or sensitive).</li>
        <li><strong>Precision Styling:</strong> Our expert groomers are trained in breed-specific cuts that make your pet look like a star while keeping them comfortable in the Indian heat.</li>
        <li><strong>Sanitary Trimming:</strong> We take care of the sensitive areas that are often missed at home, ensuring total hygiene.</li>
      </ul>

      <h3>Why Choose a Studio Over Home Grooming?</h3>
      <p>While home washing is good for maintenance, a professional studio offers deep cleaning that removes trapped dirt and loose fur from the undercoat. This significantly reduces shedding around your house. Moreover, our groomers are experts at handling pets gently but firmly, preventing accidental nicks or cuts during nail trimming.</p>

      <p>Give your pet the celebrity treatment they deserve. Visit the Pawwl Studio and see the difference for yourself!</p>
    `,
  },
  {
    id: "choosing-right-pet-products",
    title: "The Ultimate Guide to Premium Pet Products: Quality You Can Trust",
    desc: "From nutrition to accessories, choosing the right products is essential for a long and healthy life. Learn what our experts recommend.",
    date: "April 20, 2026",
    category: "Products",
    mainImage: blogImg2,
    content: `
      <p>Choosing the right products for your pet can be overwhelming with so many options available. At the Pawwl Studio, we curate only the best-in-class products that we personally trust and use on our own pets.</p>
      
      <h3>Nutrition: The Foundation of Health</h3>
      <p>Indian pets have unique nutritional needs due to our tropical climate. We focus on high-protein, easily digestible food that supports a healthy coat and strong immunity. Our studio stocks premium brands that avoid cheap fillers and artificial preservatives, ensuring your pet gets real nutrition in every bite.</p>

      <h3>Comfort Meets Durability</h3>
      <p>A leash or a collar is not just a fashion statement; it's a safety tool. We select accessories that are ergonomically designed to prevent strain on your pet's neck and joints. Our toys are made from non-toxic, durable materials that can withstand even the most enthusiastic chewers.</p>

      <h3>Our Studio's Signature Selection</h3>
      <p>We take pride in our selection of grooming essentials that you can take home. From detangling sprays to organic paw balms, our products help you maintain that "just-groomed" look and feel for weeks.</p>

      <p>Below are some of the top-rated products available at our studio that our regular customers love:</p>
    `,
    highlightImages: [prod1, prod2, prod3, prod4]
  },
];
