import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { signUpCustomer } from "../data/firebaseService";
import useAuth from "../hooks/useAuth";

const contactTypes = [
  { value: "email", label: "Email" },
  { value: "phone", label: "Phone" },
];

const Signup = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading } = useAuth();
  const [contactType, setContactType] = useState("email");
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      const redirectTo = location.state?.from ?? "/account";
      navigate(redirectTo, { replace: true });
    }
  }, [user, loading, navigate, location.state]);

  const selectedValue = useMemo(() => (contactType === "email" ? form.email : form.phone), [contactType, form]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSubmitting) return;

    setError("");

    if (!form.fullName.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (!selectedValue.trim()) {
      setError(`Please provide a valid ${contactType === "email" ? "email address" : "phone number"}.`);
      return;
    }

    if (form.password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      await signUpCustomer({
        fullName: form.fullName,
        password: form.password,
        contactType,
        contactValue: selectedValue,
      });
      navigate("/account", { replace: true });
    } catch (err) {
      console.error("Unable to sign up", err);
      setError(err.message ?? "We could not complete your registration. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 py-24">
      <div className="w-full max-w-md">
        <div className="text-center mb-12">
          <div className="text-accent text-xs tracking-[0.3em] mb-4">JOIN PREMIA</div>
          <h1 className="text-5xl mb-4">Create Account</h1>
          <p className="text-foreground/60 font-light">
            Start your journey to finding luxury properties
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="fullName" className="text-sm text-accent tracking-wider mb-2 block">
              FULL NAME
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              required
              value={form.fullName}
              onChange={handleChange}
              placeholder="John Doe"
              className="w-full bg-card border border-border/50 h-12 px-4 text-foreground/90 placeholder:text-foreground/40 focus:outline-none focus:border-accent transition-colors"
            />
          </div>

          <div>
            <label className="text-sm text-accent tracking-wider mb-2 block">
              PREFERRED CONTACT METHOD
            </label>
            <div className="flex gap-3 mb-4">
              {contactTypes.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setContactType(option.value)}
                  className={`flex-1 px-5 py-3 text-sm tracking-[0.15em] transition border ${
                    contactType === option.value
                      ? "border-accent bg-accent text-background"
                      : "border-border/50 text-foreground/70 hover:border-accent hover:text-accent"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>

            {contactType === "email" ? (
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required={contactType === "email"}
                placeholder="you@example.com"
                className="w-full bg-card border border-border/50 h-12 px-4 text-foreground/90 placeholder:text-foreground/40 focus:outline-none focus:border-accent transition-colors"
              />
            ) : (
              <input
                id="phone"
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                required={contactType === "phone"}
                placeholder="+973 XXXX XXXX"
                className="w-full bg-card border border-border/50 h-12 px-4 text-foreground/90 placeholder:text-foreground/40 focus:outline-none focus:border-accent transition-colors"
              />
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="password" className="text-sm text-accent tracking-wider mb-2 block">
                PASSWORD
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                required
                placeholder="Min 8 characters"
                className="w-full bg-card border border-border/50 h-12 px-4 text-foreground/90 placeholder:text-foreground/40 focus:outline-none focus:border-accent transition-colors"
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="text-sm text-accent tracking-wider mb-2 block">
                CONFIRM
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={form.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Confirm password"
                className="w-full bg-card border border-border/50 h-12 px-4 text-foreground/90 placeholder:text-foreground/40 focus:outline-none focus:border-accent transition-colors"
              />
            </div>
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
            {isSubmitting ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-foreground/60">
          Already have an account?{" "}
          <Link to="/login" className="text-accent hover:text-accent/80 transition-colors">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
