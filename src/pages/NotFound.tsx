import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-purple-50 dark:from-background dark:to-purple-950/20">
      <div className="text-center space-y-8 p-8 max-w-2xl">
        {/* 404 Text */}
        <div className="relative">
          <h1 className="text-9xl font-bold text-purple-200 dark:text-purple-900">404</h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <h2 className="text-4xl font-bold text-purple-800 dark:text-purple-300">
              Page Not Found
            </h2>
          </div>
        </div>

        {/* Illustration */}
        <div className="py-8">
          <div className="w-64 h-64 mx-auto relative">
            <div className="absolute inset-0 bg-purple-200 dark:bg-purple-800/20 rounded-full animate-pulse"></div>
            <div className="absolute inset-4 bg-purple-100 dark:bg-purple-900/20 rounded-full animate-pulse animation-delay-200"></div>
            <div className="absolute inset-8 bg-purple-50 dark:bg-purple-950/20 rounded-full animate-pulse animation-delay-400"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-7xl">🔍</span>
            </div>
          </div>
        </div>

        {/* Message */}
        <div className="space-y-4">
          <p className="text-xl text-purple-700 dark:text-purple-400">
            Oops! It seems like you've wandered into uncharted territory.
          </p>
          <p className="text-purple-600 dark:text-purple-500">
            The page you're looking for might have been moved, deleted, or never existed.
          </p>
        </div>

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="group hover:bg-purple-50 dark:hover:bg-purple-900/20"
          >
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Go Back
          </Button>
          <Button
            onClick={() => navigate('/')}
            className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white"
          >
            <Home className="mr-2 h-4 w-4" />
            Return to Home
          </Button>
        </div>

        {/* Help Text */}
        <p className="text-sm text-purple-500 dark:text-purple-600 pt-8">
          If you believe this is a mistake, please contact our support team.
        </p>
      </div>
    </div>
  );
};

export default NotFound;
