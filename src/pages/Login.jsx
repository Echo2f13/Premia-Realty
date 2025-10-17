import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { signInCustomer } from "../data/firebaseService";
import useAuth from "../hooks/useAuth";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading } = useAuth();
  const [form, setForm] = useState({ identifier: "", password: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      const redirectTo = location.state?.from ?? "/account";
      navigate(redirectTo, { replace: true });
    }
  }, [user, loading, navigate, location.state]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSubmitting) return;

    setError("");
    setIsSubmitting(true);

    try {
      await signInCustomer({ contactValue: form.identifier, password: form.password });
      navigate("/account", { replace: true });
    } catch (err) {
      console.error("Unable to sign in", err);
      setError(err.message ?? "We could not sign you in. Please verify your details and try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 py-24">
      <div className="w-full max-w-md">
        <div className="text-center mb-12">
          <div className="text-accent text-xs tracking-[0.3em] mb-4">WELCOME BACK</div>
          <h1 className="text-5xl mb-4">Sign In</h1>
          <p className="text-foreground/60 font-light">
            Access your saved properties and account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="identifier" className="text-sm text-accent tracking-wider mb-2 block">
              EMAIL OR PHONE
            </label>
            <input
              id="identifier"
              name="identifier"
              type="text"
              required
              value={form.identifier}
              onChange={handleChange}
              placeholder="you@example.com or +973 XXXX XXXX"
              className="w-full bg-card border border-border/50 h-12 px-4 text-foreground/90 placeholder:text-foreground/40 focus:outline-none focus:border-accent transition-colors"
            />
          </div>

          <div>
            <label htmlFor="password" className="text-sm text-accent tracking-wider mb-2 block">
              PASSWORD
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full bg-card border border-border/50 h-12 px-4 text-foreground/90 placeholder:text-foreground/40 focus:outline-none focus:border-accent transition-colors"
            />
          </div>

          {error && (
            <p className="border border-destructive/30 bg-destructive/5 px-4 py-3 text-center text-sm text-destructive">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-10 py-4 bg-accent text-background text-sm tracking-[0.2em] hover:bg-accent/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "SIGNING IN..." : "SIGN IN"}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-foreground/60">
          Don't have an account?{" "}
          <Link to="/signup" className="text-accent hover:text-accent/80 transition-colors">
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
