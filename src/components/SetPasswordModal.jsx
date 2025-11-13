import { useState } from "react";
import { X } from "lucide-react";

const SetPasswordModal = ({ isOpen, onClose, onSubmit, userEmail }) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(password);
    } catch (err) {
      setError(err.message || "Failed to set password. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md mx-6 bg-card border border-border/50 p-8">
        {/* Close button - disabled during submission */}
        <button
          onClick={onClose}
          disabled={isSubmitting}
          className="absolute top-4 right-4 text-foreground/60 hover:text-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <div className="text-accent text-xs tracking-[0.3em] mb-3">SECURE YOUR ACCOUNT</div>
          <h2 className="text-3xl mb-3">Set Your Password</h2>
          <p className="text-sm text-foreground/60 font-light">
            You signed in with Google ({userEmail}). Please set a password to secure your account.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="new-password" className="text-sm text-accent tracking-wider mb-2 block">
              New Password
            </label>
            <input
              id="new-password"
              name="password"
              type="password"
              required
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full bg-background border border-border/50 h-12 px-4 text-foreground/90 placeholder:text-foreground/40 focus:outline-none focus:border-accent transition-colors"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label htmlFor="confirm-password" className="text-sm text-accent tracking-wider mb-2 block">
              Confirm Password
            </label>
            <input
              id="confirm-password"
              name="confirmPassword"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              className="w-full bg-background border border-border/50 h-12 px-4 text-foreground/90 placeholder:text-foreground/40 focus:outline-none focus:border-accent transition-colors"
              disabled={isSubmitting}
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
            {isSubmitting ? "SETTING PASSWORD..." : "SET PASSWORD"}
          </button>
        </form>

        <p className="mt-4 text-xs text-center text-foreground/50">
          Password must be at least 6 characters long
        </p>
      </div>
    </div>
  );
};

export default SetPasswordModal;
