import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
}

const SEO: React.FC<SEOProps> = ({ 
  title = "Pawwl | One Stop Pet Care - Best Pet Clinic & Shop in Mumbai",
  description = "Pawwl is Mumbai's premier one-stop pet care destination in Bhandup West. Offering expert vet care, professional grooming, pet day care, boarding, and high-quality pet supplies.",
  keywords = "pet care Mumbai, vet clinic Bhandup, pet shop Bhandup, dog grooming Mumbai, pet boarding Mumbai, pet supplies Online, Pawwl Mumbai",
  image = "https://pawwl.com/pawwl-logo-main.webp",
  url = "https://pawwl.com",
  type = "website"
}) => {
  const siteTitle = title.includes("Pawwl") ? title : `${title} | Pawwl Pet Care`;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{siteTitle}</title>
      <meta name="title" content={siteTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={siteTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />

      {/* Canonical Link */}
      <link rel="canonical" href={url} />
    </Helmet>
  );
};

export default SEO;
