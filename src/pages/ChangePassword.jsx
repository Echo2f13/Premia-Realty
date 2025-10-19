import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { changeUserPassword } from "../data/firebaseService";
import useAuth from "../hooks/useAuth";
import { Lock } from "lucide-react";

const ChangePassword = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordStatus, setPasswordStatus] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login", { replace: true, state: { from: "/change-password" } });
    }
  }, [user, loading, navigate]);

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();
    if (!user) return;

    setPasswordStatus("");

    // Validate passwords match
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordStatus("New passwords do not match.");
      return;
    }

    // Validate password length
    if (passwordForm.newPassword.length < 6) {
      setPasswordStatus("New password must be at least 6 characters.");
      return;
    }

    setIsChangingPassword(true);

    try {
      await changeUserPassword(user, passwordForm.currentPassword, passwordForm.newPassword);
      setPasswordStatus("Password changed successfully.");

      // Clear form
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      // Redirect to account page after 2 seconds
      setTimeout(() => {
        navigate("/account");
      }, 2000);
    } catch (error) {
      console.error("Failed to change password", error);
      setPasswordStatus(error.message || "Failed to change password. Please try again.");
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-platinum-pearl">
        <div className="rounded-full border border-gold-primary/30 px-6 py-3 text-xs uppercase tracking-[0.4em] text-platinum-pearl/70">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background text-platinum-pearl min-h-screen">
      <section className="relative isolate overflow-hidden pt-32 pb-20">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-background via-luxury-black/80 to-luxury-black/50" />
          <div className="absolute -left-24 top-6 h-[520px] w-[520px] rounded-full bg-gold-primary/20 blur-[200px]" />
          <div className="absolute -right-20 bottom-[-18%] h-[480px] w-[480px] rounded-full bg-gold-primary/15 blur-[220px]" />
        </div>

        <div className="relative container px-4 lg:px-8">
          <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <div className="flex justify-center mb-6">
                <div className="p-4 rounded-full bg-gold-primary/10 border border-gold-primary/30">
                  <Lock className="w-8 h-8 text-gold-primary" />
                </div>
              </div>
              <span className="text-xs font-semibold uppercase tracking-[0.45em] text-gold-primary/75">
                Security
              </span>
              <h1 className="mt-6 text-4xl font-heading text-platinum-pearl">
                Change Your Password
              </h1>
              <p className="mt-4 text-sm leading-relaxed text-platinum-pearl/65">
                Update your password to keep your account secure. You'll need your current password to confirm.
              </p>
            </div>

            {/* Change Password Form */}
            <div className="glass-card border border-gold-primary/20 bg-luxury-black/70 p-10 shadow-glass">
              <form className="space-y-6" onSubmit={handlePasswordSubmit}>
                <div className="space-y-2">
                  <label htmlFor="password-current" className="text-xs uppercase tracking-[0.4em] text-platinum-pearl/60">
                    Current Password
                  </label>
                  <input
                    id="password-current"
                    name="currentPassword"
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={handlePasswordChange}
                    required
                    className="w-full rounded-full border border-gold-primary/30 bg-luxury-charcoal/70 px-5 py-3 text-sm text-platinum-pearl focus:border-gold-primary focus:outline-none"
                    placeholder="Enter your current password"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="password-new" className="text-xs uppercase tracking-[0.4em] text-platinum-pearl/60">
                    New Password
                  </label>
                  <input
                    id="password-new"
                    name="newPassword"
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={handlePasswordChange}
                    required
                    minLength={6}
                    className="w-full rounded-full border border-gold-primary/30 bg-luxury-charcoal/70 px-5 py-3 text-sm text-platinum-pearl focus:border-gold-primary focus:outline-none"
                    placeholder="Enter new password (min 6 characters)"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="password-confirm" className="text-xs uppercase tracking-[0.4em] text-platinum-pearl/60">
                    Confirm New Password
                  </label>
                  <input
                    id="password-confirm"
                    name="confirmPassword"
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={handlePasswordChange}
                    required
                    minLength={6}
                    className="w-full rounded-full border border-gold-primary/30 bg-luxury-charcoal/70 px-5 py-3 text-sm text-platinum-pearl focus:border-gold-primary focus:outline-none"
                    placeholder="Confirm your new password"
                  />
                </div>

                {passwordStatus ? (
                  <p className={`rounded-full border px-4 py-2 text-center text-xs font-semibold uppercase tracking-[0.35em] ${
                    passwordStatus.includes("successfully")
                      ? "border-gold-primary/30 bg-gold-primary/10 text-gold-primary/90"
                      : "border-red-500/30 bg-red-500/10 text-red-400"
                  }`}>
                    {passwordStatus}
                  </p>
                ) : null}

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => navigate("/account")}
                    className="flex-1 rounded-full border border-gold-primary/30 bg-luxury-charcoal/70 px-8 py-3 text-sm font-semibold uppercase tracking-[0.45em] text-platinum-pearl transition hover:border-gold-primary hover:bg-luxury-charcoal"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isChangingPassword}
                    className="flex-1 rounded-full bg-gradient-gold px-8 py-3 text-sm font-semibold uppercase tracking-[0.45em] text-luxury-black shadow-gold transition hover:shadow-luxury disabled:opacity-70"
                  >
                    {isChangingPassword ? "Changing..." : "Change Password"}
                  </button>
                </div>
              </form>

              <div className="mt-8 pt-8 border-t border-gold-primary/20">
                <p className="text-xs text-platinum-pearl/50 text-center">
                  For security reasons, you may be logged out after changing your password.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ChangePassword;
