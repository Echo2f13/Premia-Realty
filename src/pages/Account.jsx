import { useEffect, useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  removeSavedProperty,
  subscribeToContactRequests,
  subscribeToSavedProperties,
  updateUserProfile,
} from "../data/firebaseService";
import useAuth from "../hooks/useAuth";
import { saveSavedPropertiesToCookies } from "../utils/savedPropertiesCookies";
import { KeyRound } from "lucide-react";

const Account = () => {
  const navigate = useNavigate();
  const { user, profile, loading, signOut } = useAuth();
  const [savedResidences, setSavedResidences] = useState([]);
  const [contactHistory, setContactHistory] = useState([]);
  const [status, setStatus] = useState("");
  const [profileForm, setProfileForm] = useState({ fullName: "", phone: "" });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login", { replace: true, state: { from: "/account" } });
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (profile) {
      setProfileForm({
        fullName: profile.fullName ?? profile.displayName ?? "",
        phone: profile.phone ?? "",
      });
    }
  }, [profile]);

  // Sync saved properties with cookies
  useEffect(() => {
    if (!user) return undefined;

    const unsubscribeSaved = subscribeToSavedProperties(user.uid, (properties) => {
      setSavedResidences(properties);

      // Save property IDs to cookies (specific to this user)
      const propertyIds = properties.map(p => p.id);
      saveSavedPropertiesToCookies(user.uid, propertyIds);
    });

    const unsubscribeContact = subscribeToContactRequests(user.uid, setContactHistory);

    return () => {
      unsubscribeSaved?.();
      unsubscribeContact?.();
    };
  }, [user]);

  const summary = useMemo(
    () => ({
      savedCount: savedResidences.length,
      contactCount: contactHistory.length,
    }),
    [savedResidences, contactHistory],
  );

  const handleProfileChange = (event) => {
    const { name, value } = event.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = async (event) => {
    event.preventDefault();
    if (!user) return;

    setStatus("");
    setIsSaving(true);

    try {
      await updateUserProfile(user.uid, {
        fullName: profileForm.fullName,
        phone: profileForm.phone,
      });
      setStatus("Profile updated successfully.");
    } catch (error) {
      console.error("Failed to update profile", error);
      setStatus("We were unable to update your details. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemoveSaved = async (propertyId) => {
    if (!user) return;

    try {
      await removeSavedProperty(user.uid, propertyId);

      // Update cookies after removal
      const updatedResidences = savedResidences.filter(r => r.id !== propertyId);
      const propertyIds = updatedResidences.map(p => p.id);
      saveSavedPropertiesToCookies(user.uid, propertyIds);
    } catch (error) {
      console.error("Failed to remove saved property", error);
      setStatus("We were unable to update your saved residences. Please try again.");
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/", { replace: true });
  };

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-platinum-pearl">
        <div className="rounded-full border border-gold-primary/30 px-6 py-3 text-xs uppercase tracking-[0.4em] text-platinum-pearl/70">
          Preparing your private suite…
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background text-platinum-pearl">
      <section className="relative isolate overflow-hidden pt-32 pb-20">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-background via-luxury-black/80 to-luxury-black/50" />
          <div className="absolute -left-24 top-6 h-[520px] w-[520px] rounded-full bg-gold-primary/20 blur-[200px]" />
          <div className="absolute -right-20 bottom-[-18%] h-[480px] w-[480px] rounded-full bg-gold-primary/15 blur-[220px]" />
        </div>
        <div className="relative container px-4 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1.1fr,0.9fr]">
            <div className="glass-card border border-gold-primary/20 bg-luxury-black/60 p-10 shadow-glass">
              <span className="text-xs font-semibold uppercase tracking-[0.45em] text-gold-primary/75">Client Suite</span>
              <h1 className="mt-6 text-4xl font-serif text-platinum-pearl">Welcome back, {profileForm.fullName || "Estate Connoisseur"}</h1>
              <p className="mt-4 text-sm leading-relaxed text-platinum-pearl/65">
                Review your personal details, curated residences, and ongoing concierge conversations in one refined dashboard.
              </p>
              <dl className="mt-10 grid gap-6 sm:grid-cols-2">
                <div className="rounded-3xl border border-gold-primary/20 bg-luxury-charcoal/70 p-6 text-center">
                  <dt className="text-xs uppercase tracking-[0.4em] text-platinum-pearl/60">Saved Residences</dt>
                  <dd className="mt-4 text-3xl font-serif text-gold-primary">{summary.savedCount}</dd>
                </div>
                <div className="rounded-3xl border border-gold-primary/20 bg-luxury-charcoal/70 p-6 text-center">
                  <dt className="text-xs uppercase tracking-[0.4em] text-platinum-pearl/60">Concierge Threads</dt>
                  <dd className="mt-4 text-3xl font-serif text-gold-primary">{summary.contactCount}</dd>
                </div>
              </dl>
            </div>

            <div className="glass-card border border-gold-primary/20 bg-luxury-black/70 p-10 shadow-glass">
              <h2 className="text-2xl font-serif text-platinum-pearl">Personal details</h2>
              <p className="mt-2 text-sm text-platinum-pearl/60">
                Update your information so our concierge can tailor recommendations to your preferences.
              </p>

              <form className="mt-8 space-y-6" onSubmit={handleProfileSubmit}>
                <div className="space-y-2">
                  <label htmlFor="profile-fullName" className="text-xs uppercase tracking-[0.4em] text-platinum-pearl/60">
                    Full Name
                  </label>
                  <input
                    id="profile-fullName"
                    name="fullName"
                    type="text"
                    value={profileForm.fullName}
                    onChange={handleProfileChange}
                    className="w-full rounded-full border border-gold-primary/30 bg-luxury-charcoal/70 px-5 py-3 text-sm text-platinum-pearl focus:border-gold-primary focus:outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="profile-phone" className="text-xs uppercase tracking-[0.4em] text-platinum-pearl/60">
                    Phone
                  </label>
                  <input
                    id="profile-phone"
                    name="phone"
                    type="tel"
                    value={profileForm.phone}
                    onChange={handleProfileChange}
                    className="w-full rounded-full border border-gold-primary/30 bg-luxury-charcoal/70 px-5 py-3 text-sm text-platinum-pearl focus:border-gold-primary focus:outline-none"
                  />
                </div>

                {status ? (
                  <p className="rounded-full border border-gold-primary/30 bg-gold-primary/10 px-4 py-2 text-center text-xs font-semibold uppercase tracking-[0.35em] text-gold-primary/90">
                    {status}
                  </p>
                ) : null}

                <button
                  type="submit"
                  disabled={isSaving}
                  className="w-full rounded-full bg-gradient-gold px-8 py-3 text-sm font-semibold uppercase tracking-[0.45em] text-luxury-black shadow-gold transition hover:shadow-luxury disabled:opacity-70"
                >
                  {isSaving ? "Saving" : "Save Changes"}
                </button>
              </form>

              <div className="mt-8 flex items-center gap-4">
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="inline-flex items-center text-xs font-semibold uppercase tracking-[0.35em] text-gold-primary transition hover:text-gold-accent"
                >
                  Sign out
                </button>
                <span className="text-platinum-pearl/30">|</span>
                <Link
                  to="/change-password"
                  className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.35em] text-gold-primary transition hover:text-gold-accent"
                >
                  <KeyRound className="h-3 w-3" />
                  Change Password
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container grid gap-10 px-4 pb-24 lg:grid-cols-[1.1fr,0.9fr] lg:px-8">
        <div className="glass-card border border-gold-primary/20 bg-luxury-black/65 p-10 shadow-glass">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-serif text-platinum-pearl">Saved residences</h2>
              <p className="mt-2 text-sm text-platinum-pearl/60">
                Your curated shortlist of properties awaiting private preview.
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {savedResidences.length === 0 ? (
              <p className="col-span-full rounded-3xl border border-gold-primary/20 bg-luxury-charcoal/60 px-6 py-10 text-center text-sm text-platinum-pearl/60">
                You haven&apos;t saved any residences yet. Explore the portfolio to begin curating.
              </p>
            ) : (
              savedResidences.map((residence) => (
                <article key={residence.id} className="group overflow-hidden rounded-3xl border border-gold-primary/20 bg-luxury-black/70">
                  {residence.image ? (
                    <img
                      src={residence.image}
                      alt={residence.title}
                      className="h-44 w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : null}
                  <div className="space-y-3 p-6">
                    <div>
                      <h3 className="text-lg font-serif text-platinum-pearl">{residence.title}</h3>
                      <p className="text-sm text-platinum-pearl/60">
                        {(() => {
                          // Handle nested location object
                          if (residence.location && typeof residence.location === 'object') {
                            const parts = [
                              residence.location.area,
                              residence.location.city,
                              residence.location.governorate
                            ].filter(Boolean);
                            return parts.length > 0 ? parts.join(", ") : "Location not specified";
                          }
                          // Handle flat structure or string
                          if (typeof residence.location === 'string') {
                            return residence.location;
                          }
                          const parts = [residence.area, residence.city, residence.governorate].filter(Boolean);
                          return parts.length > 0 ? parts.join(", ") : "Location not specified";
                        })()}
                      </p>
                    </div>
                    <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-platinum-pearl/55">
                      {residence.price ? <span>{residence.price}</span> : <span />}
                      <button
                        type="button"
                        onClick={() => handleRemoveSaved(residence.id)}
                        className="rounded-full border border-gold-primary/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-gold-primary transition hover:border-gold-primary hover:bg-gold-primary/10"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>

        <div className="glass-card border border-gold-primary/20 bg-luxury-black/65 p-10 shadow-glass">
          <h2 className="text-2xl font-serif text-platinum-pearl">Concierge conversations</h2>
          <p className="mt-2 text-sm text-platinum-pearl/60">
            Keep track of residences you&apos;ve enquired about and follow up with your concierge.
          </p>

          <div className="mt-6 space-y-4">
            {contactHistory.length === 0 ? (
              <p className="rounded-3xl border border-gold-primary/20 bg-luxury-charcoal/60 px-6 py-10 text-center text-sm text-platinum-pearl/60">
                Submit a contact request to begin your personalised consultation.
              </p>
            ) : (
              contactHistory
                .slice()
                .sort((a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0))
                .map((contact) => (
                  <div key={contact.id} className="space-y-2 rounded-3xl border border-gold-primary/20 bg-luxury-black/60 p-6">
                    <div className="flex items-center justify-between text-xs uppercase tracking-[0.35em] text-gold-primary/80">
                      <span>{contact.propertyTitle ?? "General enquiry"}</span>
                      {contact.createdAt?.seconds ? (
                        <span className="text-platinum-pearl/45">
                          {new Date(contact.createdAt.seconds * 1000).toLocaleDateString()}
                        </span>
                      ) : null}
                    </div>
                    {contact.message ? (
                      <p className="text-sm text-platinum-pearl/70">{contact.message}</p>
                    ) : null}
                  </div>
                ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Account;
