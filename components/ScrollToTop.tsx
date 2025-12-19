
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Disable the browser's default scroll restoration
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    // Scroll to top immediately
    window.scrollTo(0, 0);
    
    // Safety check: sometimes DOM layout shifts happen right after render,
    // pulling the scroll down. A small timeout ensures we stay at the top.
    const timer = setTimeout(() => {
        window.scrollTo(0, 0);
    }, 50);

    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
