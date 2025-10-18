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
import { KeyRound, Loader2 } from "lucide-react";

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
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex items-center gap-3">
          <Loader2 className="w-6 h-6 text-accent animate-spin" />
          <span className="text-sm tracking-[0.2em] text-foreground/60">Loading your account...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="pt-24">
        {/* Header */}
        <section className="py-20 border-b border-border/50">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="max-w-5xl">
              <div className="text-accent text-xs tracking-[0.3em] mb-4">YOUR ACCOUNT</div>
              <h1 className="text-5xl md:text-6xl mb-6">Welcome back, {profileForm.fullName || "Estate Connoisseur"}</h1>
              <p className="text-xl text-foreground/60 font-light leading-relaxed max-w-3xl">
                Review your personal details, curated residences, and ongoing conversations in one refined dashboard.
              </p>

              <div className="grid md:grid-cols-2 gap-6 mt-12">
                <div className="border border-border/50 bg-card p-8 text-center">
                  <div className="text-sm tracking-[0.2em] text-foreground/60 mb-3">SAVED PROPERTIES</div>
                  <div className="text-4xl text-accent">{summary.savedCount}</div>
                </div>
                <div className="border border-border/50 bg-card p-8 text-center">
                  <div className="text-sm tracking-[0.2em] text-foreground/60 mb-3">CONTACT REQUESTS</div>
                  <div className="text-4xl text-accent">{summary.contactCount}</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Profile Details */}
        <section className="py-20 border-b border-border/50">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="max-w-2xl">
              <h2 className="text-3xl mb-4">Personal Details</h2>
              <p className="text-foreground/60 mb-8 font-light">
                Update your information so our concierge can tailor recommendations to your preferences.
              </p>

              <form className="space-y-6" onSubmit={handleProfileSubmit}>
                <div>
                  <label htmlFor="profile-fullName" className="text-sm text-accent tracking-wider mb-2 block">
                    FULL NAME
                  </label>
                  <input
                    id="profile-fullName"
                    name="fullName"
                    type="text"
                    value={profileForm.fullName}
                    onChange={handleProfileChange}
                    className="w-full bg-card border border-border/50 h-12 px-4 text-foreground/90 focus:outline-none focus:border-accent transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="profile-phone" className="text-sm text-accent tracking-wider mb-2 block">
                    PHONE
                  </label>
                  <input
                    id="profile-phone"
                    name="phone"
                    type="tel"
                    value={profileForm.phone}
                    onChange={handleProfileChange}
                    placeholder="+973 XXXX XXXX"
                    className="w-full bg-card border border-border/50 h-12 px-4 text-foreground/90 placeholder:text-foreground/40 focus:outline-none focus:border-accent transition-colors"
                  />
                </div>

                <div>
                  <label className="text-sm text-accent tracking-wider mb-2 block">
                    EMAIL
                  </label>
                  <div className="w-full bg-card border border-border/50 h-12 px-4 flex items-center text-foreground/60">
                    {user.email || "No email associated"}
                  </div>
                  <p className="text-xs text-foreground/40 mt-1">Email cannot be changed</p>
                </div>

                {status && (
                  <p className="border border-accent/30 bg-accent/5 px-4 py-3 text-center text-sm text-accent">
                    {status}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isSaving}
                  className="w-full px-10 py-4 bg-accent text-background text-sm tracking-[0.2em] hover:bg-accent/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? "SAVING..." : "SAVE CHANGES"}
                </button>
              </form>

              <div className="mt-8">
                <Link
                  to="/change-password"
                  className="inline-flex items-center gap-2 text-sm tracking-[0.15em] text-foreground/70 hover:text-accent transition-colors"
                >
                  <KeyRound className="h-4 w-4" />
                  Change Password
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Saved Properties */}
        <section className="py-20 border-b border-border/50">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="mb-12">
              <h2 className="text-3xl mb-4">Saved Properties</h2>
              <p className="text-foreground/60 font-light">
                Your curated shortlist of properties awaiting private preview.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {savedResidences.length === 0 ? (
                <div className="col-span-full border border-border/50 bg-card px-6 py-20 text-center">
                  <p className="text-foreground/60">
                    You haven't saved any properties yet. Explore the portfolio to begin curating.
                  </p>
                  <Link
                    to="/properties"
                    className="inline-block mt-6 px-8 py-3 border border-accent text-accent text-sm tracking-[0.15em] hover:bg-accent hover:text-background transition-all"
                  >
                    BROWSE PROPERTIES
                  </Link>
                </div>
              ) : (
                savedResidences.map((residence) => (
                  <article key={residence.id} className="group border border-border/50 bg-card overflow-hidden">
                    {residence.image ? (
                      <div className="relative h-64 overflow-hidden">
                        <img
                          src={residence.image}
                          alt={residence.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent opacity-60" />
                      </div>
                    ) : null}
                    <div className="p-6 space-y-4">
                      <div>
                        <h3 className="text-xl mb-2">{residence.title}</h3>
                        <p className="text-sm text-accent tracking-wider">
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
                      <div className="flex items-center justify-between pt-4 border-t border-border/50">
                        {residence.price ? (
                          <span className="text-lg text-accent">{residence.price}</span>
                        ) : (
                          <span />
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveSaved(residence.id)}
                          className="px-4 py-2 border border-border/50 text-xs tracking-[0.15em] text-foreground/70 hover:border-accent hover:text-accent transition-all"
                        >
                          REMOVE
                        </button>
                      </div>
                    </div>
                  </article>
                ))
              )}
            </div>
          </div>
        </section>

        {/* Contact History */}
        <section className="py-20">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="max-w-4xl">
              <div className="mb-12">
                <h2 className="text-3xl mb-4">Contact History</h2>
                <p className="text-foreground/60 font-light">
                  Keep track of properties you've enquired about and follow up with your concierge.
                </p>
              </div>

              <div className="space-y-4">
                {contactHistory.length === 0 ? (
                  <div className="border border-border/50 bg-card px-6 py-20 text-center">
                    <p className="text-foreground/60 mb-6">
                      Submit a contact request to begin your personalised consultation.
                    </p>
                    <Link
                      to="/contact"
                      className="inline-block px-8 py-3 border border-accent text-accent text-sm tracking-[0.15em] hover:bg-accent hover:text-background transition-all"
                    >
                      CONTACT US
                    </Link>
                  </div>
                ) : (
                  contactHistory
                    .slice()
                    .sort((a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0))
                    .map((contact) => (
                      <div key={contact.id} className="border border-border/50 bg-card p-6 space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                          <span className="text-sm tracking-wider text-accent">
                            {contact.propertyTitle ?? "General Enquiry"}
                          </span>
                          {contact.createdAt?.seconds ? (
                            <span className="text-xs text-foreground/40">
                              {new Date(contact.createdAt.seconds * 1000).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </span>
                          ) : null}
                        </div>
                        {contact.message ? (
                          <p className="text-sm text-foreground/70 leading-relaxed">{contact.message}</p>
                        ) : null}
                      </div>
                    ))
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Account;
