import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { ShieldCheck } from "lucide-react";

const RequireAdmin = ({ children }) => {
  const { user, loading, isAuthenticated, isAdmin } = useAuth();

  // Show loading state
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-gold-primary">Loading...</div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: window.location.pathname }} replace />;
  }

  // Show access denied if not admin
  if (!isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="glass-card p-8 text-center max-w-md">
          <ShieldCheck className="h-16 w-16 text-gold-primary mx-auto mb-4" />
          <h2 className="text-2xl font-serif font-bold text-platinum-pearl mb-2">
            Access Denied
          </h2>
          <p className="text-platinum-pearl/70 mb-6">
            You need admin privileges to access this page.
          </p>
          <button
            onClick={() => (window.location.href = "/")}
            className="rounded-full bg-gradient-gold px-6 py-3 text-sm font-semibold uppercase tracking-[0.4em] text-luxury-black shadow-gold transition hover:shadow-luxury"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  // Render children if admin
  return children;
};

export default RequireAdmin;
