import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Smoothly scroll to top on route change
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant", // "instant" is usually preferred for route changes to avoid seeing the scroll, but "smooth" can be used if requested.
    });
  }, [pathname]);

  return null;
};

export default ScrollToTop;
