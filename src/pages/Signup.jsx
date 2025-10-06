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
      setError("Please share your full name so we can personalise your experience.");
      return;
    }

    if (!selectedValue.trim()) {
      setError(`Please provide a valid ${contactType === "email" ? "email address" : "phone number"}.`);
      return;
    }

    if (form.password.length < 8) {
      setError("For security, please choose a password with at least 8 characters.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("The passwords you entered do not match. Kindly verify and try again.");
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
    <div className="relative min-h-screen bg-background">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(205,168,94,0.2),_transparent_60%)]" />
        <div className="absolute inset-0 bg-gradient-to-br from-luxury-black via-background to-luxury-black/90" />
        <div className="absolute -right-20 top-24 hidden h-[520px] w-[520px] rounded-full bg-gold-primary/14 blur-[200px] xl:block" />
        <div className="absolute -left-16 bottom-10 hidden h-[440px] w-[440px] rounded-full bg-gold-primary/10 blur-[200px] md:block" />
      </div>

      <div className="relative flex min-h-screen items-center justify-center px-4 py-20 lg:px-8">
        <div className="grid w-full max-w-6xl gap-12 lg:grid-cols-[1.05fr,0.95fr]">
          <div className="glass-card hidden flex-col justify-between border border-gold-primary/15 bg-luxury-black/55 p-12 shadow-glass lg:flex">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.45em] text-gold-primary/75">Premia Privé</span>
              <h1 className="mt-6 text-4xl font-serif text-platinum-pearl">Create your privileged access</h1>
              <p className="mt-6 text-sm leading-relaxed text-platinum-pearl/65">
                Register to curate bespoke property selections, reserve private previews, and maintain an ongoing dialogue with our concierge team.
              </p>
            </div>
            <div className="space-y-4">
              <div className="rounded-3xl border border-gold-primary/15 bg-luxury-black/45 p-6">
                <p className="text-xs uppercase tracking-[0.4em] text-gold-primary/75">Personal Curation</p>
                <p className="mt-3 text-sm text-platinum-pearl/70">
                  Save residences you love, and we&apos;ll refine recommendations that mirror your lifestyle aspirations.
                </p>
              </div>
              <div className="rounded-3xl border border-gold-primary/15 bg-luxury-black/45 p-6">
                <p className="text-xs uppercase tracking-[0.4em] text-gold-primary/75">Concierge Liaison</p>
                <p className="mt-3 text-sm text-platinum-pearl/70">
                  Seamlessly track conversations, preview schedules, and private invitations from your dashboard.
                </p>
              </div>
            </div>
          </div>

          <div className="glass-card w-full max-w-xl border border-gold-primary/20 bg-luxury-black/75 p-10 shadow-glass">
            <div className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-[0.45em] text-gold-primary/75">Join Premia</span>
              <h2 className="text-3xl font-serif text-platinum-pearl">Let&apos;s tailor your sanctuary</h2>
              <p className="text-sm text-platinum-pearl/60">
                Share your details to unlock the curated property experience designed exclusively for you.
              </p>
            </div>

            <form className="mt-10 space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label htmlFor="fullName" className="text-xs uppercase tracking-[0.4em] text-platinum-pearl/60">
                  Full Name
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="John & Jane Smith"
                  className="w-full rounded-full border border-gold-primary/30 bg-luxury-charcoal/70 px-5 py-3 text-sm text-platinum-pearl placeholder:text-platinum-pearl/40 focus:border-gold-primary focus:outline-none"
                />
              </div>

              <div className="space-y-4">
                <span className="text-xs font-semibold uppercase tracking-[0.4em] text-platinum-pearl/60">
                  Preferred Contact
                </span>
                <div className="flex gap-3">
                  {contactTypes.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setContactType(option.value)}
                      className={`flex-1 rounded-full border px-5 py-3 text-xs font-semibold uppercase tracking-[0.35em] transition ${
                        contactType === option.value
                          ? "border-gold-primary bg-gradient-gold text-luxury-black shadow-gold"
                          : "border-gold-primary/30 text-platinum-pearl/70 hover:border-gold-primary hover:text-gold-primary"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>

                {contactType === "email" ? (
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-xs uppercase tracking-[0.4em] text-platinum-pearl/60">
                      Email Address
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      required={contactType === "email"}
                      placeholder="you@example.com"
                      className="w-full rounded-full border border-gold-primary/30 bg-luxury-charcoal/70 px-5 py-3 text-sm text-platinum-pearl placeholder:text-platinum-pearl/40 focus:border-gold-primary focus:outline-none"
                    />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-xs uppercase tracking-[0.4em] text-platinum-pearl/60">
                      Phone Number
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={form.phone}
                      onChange={handleChange}
                      required={contactType === "phone"}
                      placeholder="+1 555 000 0000"
                      className="w-full rounded-full border border-gold-primary/30 bg-luxury-charcoal/70 px-5 py-3 text-sm text-platinum-pearl placeholder:text-platinum-pearl/40 focus:border-gold-primary focus:outline-none"
                    />
                  </div>
                )}
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="password" className="text-xs uppercase tracking-[0.4em] text-platinum-pearl/60">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    placeholder="Create a secure password"
                    className="w-full rounded-full border border-gold-primary/30 bg-luxury-charcoal/70 px-5 py-3 text-sm text-platinum-pearl placeholder:text-platinum-pearl/40 focus:border-gold-primary focus:outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="text-xs uppercase tracking-[0.4em] text-platinum-pearl/60">
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    required
                    placeholder="Confirm your password"
                    className="w-full rounded-full border border-gold-primary/30 bg-luxury-charcoal/70 px-5 py-3 text-sm text-platinum-pearl placeholder:text-platinum-pearl/40 focus:border-gold-primary focus:outline-none"
                  />
                </div>
              </div>

              {error ? (
                <p className="rounded-3xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-center text-xs font-semibold uppercase tracking-[0.35em] text-red-200">
                  {error}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-full bg-gradient-gold px-8 py-3 text-sm font-semibold uppercase tracking-[0.45em] text-luxury-black shadow-gold transition hover:shadow-luxury disabled:opacity-70"
              >
                {isSubmitting ? "Creating Access" : "Create Account"}
              </button>
            </form>

            <p className="mt-8 text-center text-xs text-platinum-pearl/60">
              Already part of Premia?{" "}
              <Link to="/login" className="text-gold-primary transition hover:text-gold-accent">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
