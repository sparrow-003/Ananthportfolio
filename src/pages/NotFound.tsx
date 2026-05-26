import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, memo } from "react";

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
    }, 100);
    
    return () => clearTimeout(timer);
  }, [location.pathname, navigate]);

  // Show a brief loading state while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="fixed inset-0 bg-gradient-to-br from-emerald-950/20 via-black to-teal-950/20 -z-10" />
      <div className="text-center">
        <div className="relative w-12 h-12 mx-auto mb-4">
          <div className="absolute inset-0 rounded-full border-2 border-emerald-500/30" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-emerald-500 animate-spin" />
        </div>
        <p className="text-emerald-400/60 text-sm">Redirecting to home...</p>
      </div>
    </div>
  );
});

NotFound.displayName = 'NotFound';

export default NotFound;