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
    <div className="relative min-h-screen bg-background">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(205,168,94,0.18),_transparent_55%)]" />
        <div className="absolute inset-0 bg-gradient-to-br from-luxury-black via-background to-luxury-black/90" />
        <div className="absolute -left-32 top-20 hidden h-[540px] w-[540px] rounded-full bg-gold-primary/15 blur-[180px] lg:block" />
        <div className="absolute -right-24 bottom-6 hidden h-[420px] w-[420px] rounded-full bg-gold-primary/12 blur-[200px] md:block" />
      </div>

      <div className="relative flex min-h-screen items-center justify-center px-4 py-20 lg:px-8">
        <div className="grid w-full max-w-6xl gap-12 lg:grid-cols-[0.9fr,1.1fr]">
          <div className="hidden flex-col justify-between rounded-3xl border border-gold-primary/15 bg-luxury-black/40 p-10 shadow-glass lg:flex">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.45em] text-gold-primary/75">Premia Privé</span>
              <h1 className="mt-6 text-4xl font-serif text-platinum-pearl">Welcome back to your private collection</h1>
              <p className="mt-6 text-sm leading-relaxed text-platinum-pearl/65">
                Enter your credentials to access curated residences, saved selections, and personalised concierge updates.
              </p>
            </div>
            <div className="space-y-4">
              <div className="rounded-3xl border border-gold-primary/15 bg-luxury-black/50 p-6">
                <p className="text-xs uppercase tracking-[0.4em] text-gold-primary/75">Concierge Access</p>
                <p className="mt-3 text-sm text-platinum-pearl/70">
                  Secure access powered by Firebase Auth ensures your portfolio remains confidential and exclusive.
                </p>
              </div>
              <div className="rounded-3xl border border-gold-primary/15 bg-luxury-black/50 p-6">
                <p className="text-xs uppercase tracking-[0.4em] text-gold-primary/75">Preferential Insights</p>
                <p className="mt-3 text-sm text-platinum-pearl/70">
                  Save favoured residences and receive bespoke alerts tailored to your acquisition strategy.
                </p>
              </div>
            </div>
          </div>

          <div className="glass-card ml-auto w-full max-w-xl border border-gold-primary/20 bg-luxury-black/75 p-10 shadow-glass">
            <div className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-[0.45em] text-gold-primary/75">Sign In</span>
              <h2 className="text-3xl font-serif text-platinum-pearl">Access your Premia suite</h2>
              <p className="text-sm text-platinum-pearl/60">
                Enter your registered email address or phone number along with your password.
              </p>
            </div>

            <form className="mt-10 space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label htmlFor="identifier" className="text-xs uppercase tracking-[0.4em] text-platinum-pearl/60">
                  Email or Phone
                </label>
                <input
                  id="identifier"
                  name="identifier"
                  type="text"
                  required
                  value={form.identifier}
                  onChange={handleChange}
                  placeholder="you@example.com or +1 555 000 0000"
                  className="w-full rounded-full border border-gold-primary/30 bg-luxury-charcoal/70 px-5 py-3 text-sm text-platinum-pearl placeholder:text-platinum-pearl/40 focus:border-gold-primary focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-xs uppercase tracking-[0.4em] text-platinum-pearl/60">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full rounded-full border border-gold-primary/30 bg-luxury-charcoal/70 px-5 py-3 text-sm text-platinum-pearl placeholder:text-platinum-pearl/40 focus:border-gold-primary focus:outline-none"
                />
              </div>

              {error ? (
                <p className="rounded-full border border-red-500/40 bg-red-500/10 px-4 py-2 text-center text-xs font-semibold uppercase tracking-[0.35em] text-red-200">
                  {error}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-full bg-gradient-gold px-8 py-3 text-sm font-semibold uppercase tracking-[0.45em] text-luxury-black shadow-gold transition hover:shadow-luxury disabled:opacity-70"
              >
                {isSubmitting ? "Signing In" : "Sign In"}
              </button>
            </form>

            <p className="mt-8 text-center text-xs text-platinum-pearl/60">
              Don&apos;t have an account yet?{" "}
              <Link to="/signup" className="text-gold-primary transition hover:text-gold-accent">
                Create your access
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
