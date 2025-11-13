import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { signInCustomer, signInWithGoogle, linkPasswordToGoogleAccount } from "../data/firebaseService";
import useAuth from "../hooks/useAuth";
import { useLanguage } from "../contexts/LanguageContext";
import { translations } from "../translations";
import SetPasswordModal from "../components/SetPasswordModal";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading } = useAuth();
  const { t } = useLanguage();
  const [form, setForm] = useState({ identifier: "", password: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [googleUserEmail, setGoogleUserEmail] = useState("");

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

  const handleGoogleSignIn = async () => {
    if (isSubmitting) return;

    setError("");
    setIsSubmitting(true);

    try {
      const result = await signInWithGoogle();

      // If this is a new user, show password setup modal
      if (result.isNewUser) {
        setGoogleUserEmail(result.user.email);
        setShowPasswordModal(true);
        setIsSubmitting(false);
      } else {
        // Existing user, redirect normally
        const redirectTo = location.state?.from ?? "/account";
        navigate(redirectTo, { replace: true });
      }
    } catch (err) {
      console.error("Unable to sign in with Google", err);
      if (err.code === "auth/popup-closed-by-user") {
        setError("Sign-in cancelled. Please try again.");
      } else if (err.code === "auth/popup-blocked") {
        setError("Popup was blocked. Please allow popups for this site.");
      } else {
        setError(err.message ?? "We could not sign you in with Google. Please try again.");
      }
      setIsSubmitting(false);
    }
  };

  const handleSetPassword = async (password) => {
    try {
      await linkPasswordToGoogleAccount(password);
      setShowPasswordModal(false);
      const redirectTo = location.state?.from ?? "/account";
      navigate(redirectTo, { replace: true });
    } catch (err) {
      throw new Error(err.message || "Failed to set password");
    }
  };

  const handleCloseModal = () => {
    setShowPasswordModal(false);
    const redirectTo = location.state?.from ?? "/account";
    navigate(redirectTo, { replace: true });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 py-24">
      <div className="w-full max-w-md">
        <div className="text-center mb-12">
          <div className="text-accent text-xs tracking-[0.3em] mb-4">{t(translations.login.welcomeBack)}</div>
          <h1 className="text-5xl mb-4">{t(translations.login.title)}</h1>
          <p className="text-foreground/60 font-light">
            {t(translations.login.description)}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="identifier" className="text-sm text-accent tracking-wider mb-2 block">
              {t(translations.login.emailOrPhone)}
            </label>
            <input
              id="identifier"
              name="identifier"
              type="text"
              required
              value={form.identifier}
              onChange={handleChange}
              placeholder={t(translations.login.emailPlaceholder)}
              className="w-full bg-card border border-border/50 h-12 px-4 text-foreground/90 placeholder:text-foreground/40 focus:outline-none focus:border-accent transition-colors"
            />
          </div>

          <div>
            <label htmlFor="password" className="text-sm text-accent tracking-wider mb-2 block">
              {t(translations.login.password)}
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={form.password}
              onChange={handleChange}
              placeholder={t(translations.login.passwordPlaceholder)}
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
            {isSubmitting ? t(translations.login.signingIn) : t(translations.login.signIn)}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border/50"></div>
          </div>
          <div className="relative flex justify-center text-xs tracking-[0.2em]">
            <span className="bg-background px-4 text-foreground/40">{t(translations.login.or)}</span>
          </div>
        </div>

        {/* Google Sign-In Button */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isSubmitting}
          className="w-full px-10 py-4 border border-border/50 bg-card text-foreground text-sm tracking-[0.2em] hover:border-accent hover:bg-card/80 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          {isSubmitting ? t(translations.login.signingIn) : t(translations.login.signInWithGoogle)}
        </button>

        <p className="mt-8 text-center text-sm text-foreground/60">
          {t(translations.login.noAccount)}{" "}
          <Link to="/signup" className="text-accent hover:text-accent/80 transition-colors">
            {t(translations.login.createAccount)}
          </Link>
        </p>
      </div>

      <SetPasswordModal
        isOpen={showPasswordModal}
        onClose={handleCloseModal}
        onSubmit={handleSetPassword}
        userEmail={googleUserEmail}
      />
    </div>
  );
};

export default Login;
