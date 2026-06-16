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
import Careers from "./pages/Careers.tsx";
import CareerDetails from "./pages/CareerDetails.tsx";
import Contact from "./pages/Contact.tsx";
import Gallery from "./pages/Gallery.tsx";
import Blogs from "./pages/Blogs.tsx";
import BlogDetail from "./pages/BlogDetail.tsx";
import Login from "./pages/Login.tsx";
import Register from "./pages/Register.tsx";
import ForgotPassword from "./pages/ForgotPassword.tsx";
import Account from "./pages/Account.tsx";
import AccountAddresses from "./pages/AccountAddresses.tsx";
import AccountAddressForm from "./pages/AccountAddressForm.tsx";
import AccountOrders from "./pages/AccountOrders.tsx";
import AccountOrderDetail from "./pages/AccountOrderDetail.tsx";
import AccountProfile from "./pages/AccountProfile.tsx";
import AccountChangePassword from "./pages/AccountChangePassword.tsx";
import Checkout from "./pages/Checkout.tsx";
import OrderSuccess from "./pages/OrderSuccess.tsx";
import OrderFailure from "./pages/OrderFailure.tsx";
import Admin from "./pages/Admin.tsx";
import AdminProducts from "./pages/AdminProducts.tsx";
import AdminOrders from "./pages/AdminOrders.tsx";
import AdminUsers from "./pages/AdminUsers.tsx";
import AdminAdmins from "./pages/AdminAdmins.tsx";
import AdminCoupons from "./pages/AdminCoupons.tsx";
import AdminReturns from "./pages/AdminReturns.tsx";
import AdminReviews from "./pages/AdminReviews.tsx";
import NotFound from "./pages/NotFound.tsx";

import AdminServiceLeads from "./pages/AdminServiceLeads";
import AdminJobApplications from "./pages/AdminJobApplications";

const queryClient = new QueryClient();

import AdminReports from "./pages/AdminReports";
import AdminLogin from "./pages/AdminLogin";
import AdminFulfillmentQueue from "./pages/AdminFulfillmentQueue";
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
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetails />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/careers/:id" element={<CareerDetails />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/blog" element={<Blogs />} />
            <Route path="/blog/:id" element={<BlogDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/account" element={<Account />} />
            <Route path="/account/orders" element={<AccountOrders />} />
            <Route path="/account/orders/:id" element={<AccountOrderDetail />} />
            <Route path="/account/addresses" element={<AccountAddresses />} />
            <Route path="/account/addresses/new" element={<AccountAddressForm />} />
            <Route path="/account/addresses/edit/:id" element={<AccountAddressForm />} />
            <Route path="/account/profile" element={<AccountProfile />} />
            <Route path="/account/change-password" element={<AccountChangePassword />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-success" element={<OrderSuccess />} />
            <Route path="/order-failure" element={<OrderFailure />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/fulfillment" element={<AdminFulfillmentQueue />} />
            <Route path="/admin/products" element={<AdminProducts />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
            <Route path="/admin/coupons" element={<AdminCoupons />} />
            <Route path="/admin/returns" element={<AdminReturns />} />
            <Route path="/admin/reports" element={<AdminReports />} />
            <Route path="/product/:slug" element={<ProductDetails />} />
            <Route path="/admin/reviews" element={<AdminReviews />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/admins" element={<AdminAdmins />} />
            <Route path="/admin/service-leads" element={<AdminServiceLeads />} />
            <Route path="/admin/job-applications" element={<AdminJobApplications />} />
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
