import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import About from "./pages/About.tsx";
import Services from "./pages/Services.tsx";
import Products from "./pages/Products.tsx";
import ProductDetails from "./pages/ProductDetails.tsx";
import { Navigate } from "react-router-dom";
import Careers from "./pages/Careers.tsx";
import CareerDetails from "./pages/CareerDetails.tsx";
import Contact from "./pages/Contact.tsx";
import Gallery from "./pages/Gallery.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

import { CartProvider, useCart } from "./context/CartContext";
import SideDrawer from "./components/SideDrawer";
import { HelmetProvider } from "react-helmet-async";
import ScrollToTop from "./components/ScrollToTop";

const AppContent = () => {
  const { isCartOpen, isFavoritesOpen, setCartOpen, setFavoritesOpen } = useCart();
  
  return (
    <HelmetProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            {/* Products routes temporarily disabled — redirect to home. Restore the original elements to re-enable. */}
            <Route path="/products" element={<Navigate to="/" replace />} />
            <Route path="/products/:id" element={<Navigate to="/" replace />} />
            {/* <Route path="/products" element={<Products />} /> */}
            {/* <Route path="/products/:id" element={<ProductDetails />} /> */}
            <Route path="/careers" element={<Careers />} />
            <Route path="/careers/:id" element={<CareerDetails />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="*" element={<NotFound />} />
          </Routes>

          {/* Side Drawers nested inside BrowserRouter */}
          <SideDrawer 
            type="cart" 
            isOpen={isCartOpen} 
            onClose={() => setCartOpen(false)} 
          />
          <SideDrawer 
            type="favorites" 
            isOpen={isFavoritesOpen} 
            onClose={() => setFavoritesOpen(false)} 
          />
        </BrowserRouter>
      </TooltipProvider>
    </HelmetProvider>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <CartProvider>
      <AppContent />
    </CartProvider>
  </QueryClientProvider>
);

export default App;
