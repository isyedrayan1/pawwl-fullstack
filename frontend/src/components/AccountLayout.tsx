import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { apiRequest, ApiUser } from "@/lib/api";
import { toast } from "sonner";
import {
  User,
  ShoppingBag,
  MapPin,
  Lock,
  LogOut,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useCart } from "@/context/CartContext";

interface AccountLayoutProps {
  children: React.ReactNode;
}

const AccountLayout: React.FC<AccountLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { clearCart, clearFavorites } = useCart();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["me"],
    queryFn: () => apiRequest<{ user: ApiUser }>("/api/auth/me"),
    retry: false,
  });

  const logout = async () => {
    try {
      await apiRequest("/api/auth/logout", { method: "POST" });
      // Aggressively clear auth cache so UI updates everywhere
      try {
        // Cancel any in-flight fetches for "me"
        await queryClient.cancelQueries(["me"]);
      } catch (e) {
        // ignore
      }
      // Set cached value to null user so consumers re-render
      queryClient.setQueryData(["me"], { user: null });
      // Remove queries entirely to avoid stale cached data
      queryClient.removeQueries(["me"]);

      // Clear client-side cart/favorites state
      clearCart();
      clearFavorites();

      // Broadcast auth change for components that may not rely on react-query
      try {
        window.dispatchEvent(new Event("pawwl:auth-changed"));
      } catch (e) {
        // ignore in non-browser env
      }

      toast.success("Logged out");
      navigate("/");
    } catch (err) {
      toast.error("Logout failed");
    }
  };

  const menuItems = [
    {
      label: "My Account",
      icon: User,
      path: "/account",
      id: "account",
    },
    {
      label: "My Orders",
      icon: ShoppingBag,
      path: "/account/orders",
      id: "orders",
    },
    {
      label: "My Addresses",
      icon: MapPin,
      path: "/account/addresses",
      id: "addresses",
    },
    {
      label: "Profile Settings",
      icon: Lock,
      path: "/account/profile",
      id: "profile",
    },
  ];

  const isActive = (path: string) => {
    if (path === "/account") {
      return location.pathname === "/account";
    }
    return location.pathname.startsWith(path);
  };

  const getCurrentPageLabel = () => {
    for (const item of menuItems) {
      if (isActive(item.path)) {
        return item.label;
      }
    }
    if (isActive("/account/change-password")) {
      return "Change Password";
    }
    return "My Account";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="section-container py-16">
          <p className="text-center">Loading...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!data?.user) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="section-container py-16">
          <p className="mb-4">Please login to access your account.</p>
          <Button asChild className="bg-brand-blue">
            <Link to="/login">Login</Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      {/* Mobile Sticky Header + Dropdown */}
      <div className="lg:hidden sticky top-16 z-40 bg-white border-b border-border-design">
        {/* Profile Info - Static */}
        <div className="section-container py-4 flex items-center gap-3 border-b border-border-design">
          <div className="w-12 h-12 bg-brand-light rounded-full flex items-center justify-center flex-shrink-0">
            <User size={24} className="text-brand-blue" />
          </div>
          <div className="text-left">
            <p className="text-xs uppercase tracking-wide text-[#888] font-semibold">
              Hi, {data.user.name.split(" ")[0]}
            </p>
            <h2 className="text-lg font-bold text-brand-dark">
              {data.user.name}
            </h2>
          </div>
        </div>

        {/* Dropdown Toggle Button */}
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="w-full section-container py-3 flex items-center justify-between gap-3 hover:bg-gray-50 transition-colors border-b border-border-design"
        >
          <span className="text-sm font-medium text-brand-dark">{getCurrentPageLabel()}</span>
          {dropdownOpen ? (
            <ChevronUp size={20} className="text-brand-blue flex-shrink-0" />
          ) : (
            <ChevronDown size={20} className="text-[#666] flex-shrink-0" />
          )}
        </button>

        {/* Dropdown Menu */}
        {dropdownOpen && (
          <div className="bg-white">
            <nav className="section-container py-2 space-y-1 flex flex-col">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      navigate(item.path);
                      setDropdownOpen(false);
                    }}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left ${
                      active
                        ? "bg-brand-light text-brand-dark font-semibold"
                        : "text-[#666] hover:bg-gray-50"
                    }`}
                  >
                    <Icon size={20} />
                    <span>{item.label}</span>
                  </button>
                );
              })}

              {/* Divider */}
              <div className="h-px bg-border-design my-2"></div>

              {/* Security Options */}
              <button
                onClick={() => {
                  navigate("/account/change-password");
                  setDropdownOpen(false);
                }}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left ${
                  isActive("/account/change-password")
                    ? "bg-brand-light text-brand-dark font-semibold"
                    : "text-[#666] hover:bg-gray-50"
                }`}
              >
                <Lock size={20} />
                <span>Change Password</span>
              </button>

              <button
                onClick={() => {
                  logout();
                  setDropdownOpen(false);
                }}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#d32f2f] hover:bg-red-50 transition-colors text-left"
              >
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </nav>
          </div>
        )}
      </div>

      <main className="flex-1 section-container py-8 lg:py-16">
        <div className="flex gap-6 lg:gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:flex lg:w-64 bg-white rounded-lg p-6 border border-border-design flex-col gap-6">
            {/* User Info Card */}
            <div className="border-b border-border-design pb-6">
              <p className="text-xs uppercase tracking-wide text-[#888] font-semibold">
                Hi, {data.user.name.split(" ")[0]}
              </p>
              <h2 className="text-lg font-bold text-brand-dark mt-2">
                {data.user.name}
              </h2>
              <p className="text-sm text-[#666] mt-1">{data.user.email}</p>
              {data.user.phone && (
                <p className="text-sm text-[#666]">{data.user.phone}</p>
              )}
            </div>

            {/* Menu Items */}
            <nav className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.id}
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      active
                        ? "bg-brand-light text-brand-dark font-semibold border-l-4 border-brand-blue"
                        : "text-[#666] hover:bg-gray-50"
                    }`}
                  >
                    <Icon size={20} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Security Section */}
            <div className="space-y-2 border-t border-border-design pt-4">
              <Link
                to="/account/change-password"
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive("/account/change-password")
                    ? "bg-brand-light text-brand-dark font-semibold border-l-4 border-brand-blue"
                    : "text-[#666] hover:bg-gray-50"
                }`}
              >
                <Lock size={20} />
                <span>Change Password</span>
              </Link>

              <button
                onClick={logout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-[#d32f2f] hover:bg-red-50 transition-colors text-left"
              >
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </div>
          </aside>

          {/* Content Area */}
          <div className="flex-1 w-full lg:w-auto">
            {children}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AccountLayout;
