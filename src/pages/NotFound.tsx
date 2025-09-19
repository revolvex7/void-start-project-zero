import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center space-y-6">
        <h1 className="text-6xl font-bold text-brand-primary">404</h1>
        <h2 className="text-2xl font-semibold text-foreground">Page Not Found</h2>
        <p className="text-xl text-muted-foreground max-w-md mx-auto">
          Sorry, we couldn't find the page you're looking for. It might have been moved or deleted.
        </p>
        <div className="space-y-3">
          <a 
            href="/" 
            className="inline-flex items-center justify-center px-6 py-3 bg-brand-primary text-white rounded-lg hover:bg-brand-primary-light transition-smooth font-medium"
          >
            Return to Home
          </a>
          <div>
            <a 
              href="/explore" 
              className="text-brand-primary hover:text-brand-primary-light transition-smooth font-medium"
            >
              Or explore creators
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
