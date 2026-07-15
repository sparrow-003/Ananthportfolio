import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, memo } from "react";
import { Helmet } from "react-helmet-async";


const NotFound = memo(() => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.log(
      "Route not found, redirecting to home:",
      location.pathname
    );
    // Auto-redirect to home page after a brief moment
    const timer = setTimeout(() => {
      navigate("/", { replace: true });
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [location.pathname, navigate]);

  // Show a brief loading state while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <Helmet>
        <title>Page Not Found | ANANTH.DEV</title>
        <meta name="description" content="The page you are looking for does not exist. Redirecting to the homepage of ANANTH.DEV — Full-Stack Developer & AI Engineer." />
        <meta name="robots" content="noindex,follow" />
        <meta property="og:title" content="Page Not Found | ANANTH.DEV" />
        <meta property="og:description" content="The page you are looking for does not exist. Redirecting to the homepage of ANANTH.DEV." />
      </Helmet>
      <div className="fixed inset-0 bg-gradient-to-br from-emerald-950/20 via-black to-teal-950/20 -z-10" />
      <div className="text-center max-w-md mx-auto px-6">
        <h1 className="text-6xl md:text-8xl font-bold text-emerald-500/30 mb-4">404</h1>
        <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-3">Page Not Found</h2>
        <p className="text-muted-foreground mb-6">
          The page you're looking for doesn't exist or has been moved.
          Redirecting you to the homepage...
        </p>
        <div className="relative w-12 h-12 mx-auto mb-4">
          <div className="absolute inset-0 rounded-full border-2 border-emerald-500/30" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-emerald-500 animate-spin" />
        </div>
        <button
          onClick={() => navigate("/", { replace: true })}
          className="px-6 py-2.5 rounded-full bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
        >
          Go Home Now
        </button>
      </div>
    </div>
  );
});

NotFound.displayName = 'NotFound';

export default NotFound;