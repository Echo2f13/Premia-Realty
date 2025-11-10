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
import ScrollReveal from "../components/ScrollReveal";
import { useLanguage } from "../contexts/LanguageContext";
import { translations } from "../translations";

const Account = () => {
  const navigate = useNavigate();
  const { user, profile, loading, signOut } = useAuth();
  const { t } = useLanguage();
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
          <span className="text-sm tracking-[0.2em] text-foreground/60">{t(translations.account.loading)}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-diagonal-subtle">
      {/* Hero Header with Gradient Background */}
      <section className="relative isolate overflow-hidden">
        {/* Decorative gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-accent/10 via-transparent to-transparent pointer-events-none" />

        <div className="relative container mx-auto px-6 lg:px-12 pt-32 pb-16">
          <ScrollReveal animation="fade-in-up">
            {/* Profile Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-12">
              <div className="flex-1">
                <div className="text-accent text-xs tracking-[0.3em] uppercase mb-3">Account Overview</div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl mb-3">
                  {profileForm.fullName || t(translations.account.defaultName)}
                </h1>
                <p className="text-foreground/60 text-sm font-light">{user.email}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/change-password"
                  className="inline-flex items-center gap-2 px-6 py-3 border border-border/50 text-xs tracking-[0.15em] uppercase text-foreground/70 hover:border-accent hover:text-accent hover:bg-accent/5 transition-all"
                >
                  <KeyRound className="h-4 w-4" />
                  {t(translations.account.changePassword)}
                </Link>
                <button
                  onClick={handleSignOut}
                  className="px-6 py-3 border border-border/50 text-xs tracking-[0.15em] uppercase text-foreground/70 hover:border-red-500 hover:text-red-500 hover:bg-red-500/5 transition-all"
                >
                  Sign Out
                </button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
              <div className="bg-card border border-border/50 p-6 hover-glow transition-all group">
                <div className="text-xs tracking-[0.2em] uppercase text-foreground/60 mb-2">
                  {t(translations.account.savedProperties)}
                </div>
                <div className="text-4xl font-light text-accent group-hover:scale-105 transition-transform">
                  {summary.savedCount}
                </div>
              </div>

              <div className="bg-card border border-border/50 p-6 hover-glow transition-all group">
                <div className="text-xs tracking-[0.2em] uppercase text-foreground/60 mb-2">
                  {t(translations.account.contactRequests)}
                </div>
                <div className="text-4xl font-light text-accent group-hover:scale-105 transition-transform">
                  {summary.contactCount}
                </div>
              </div>

              <div className="bg-card border border-border/50 p-6 hover-glow transition-all group">
                <div className="text-xs tracking-[0.2em] uppercase text-foreground/60 mb-2">Member Since</div>
                <div className="text-lg font-light text-foreground group-hover:text-accent transition-colors">
                  {user.metadata?.creationTime
                    ? new Date(user.metadata.creationTime).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
                    : 'N/A'}
                </div>
              </div>

              <div className="bg-card border border-border/50 p-6 hover-glow transition-all group">
                <div className="text-xs tracking-[0.2em] uppercase text-foreground/60 mb-2">Account Status</div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-lg font-light text-foreground group-hover:text-accent transition-colors">Active</span>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-6 lg:px-12 pb-20">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Left Sidebar - Personal Details */}
          <div className="lg:col-span-4">
            <ScrollReveal animation="fade-in-up" delay={100}>
              <div className="bg-card border border-border/50 overflow-hidden transition-all sticky top-24">
                {/* Card Header */}
                <div className="border-b border-border/30 px-8 py-6 bg-gradient-to-br from-accent/5 to-transparent">
                  <div className="text-accent text-xs tracking-[0.3em] uppercase mb-2">Profile Settings</div>
                  <h2 className="text-2xl">{t(translations.account.personalDetails)}</h2>
                </div>

                {/* Form */}
                <form className="p-8 space-y-6" onSubmit={handleProfileSubmit}>
                  <div>
                    <label htmlFor="profile-fullName" className="text-xs text-accent tracking-[0.15em] uppercase mb-3 block">
                      {t(translations.account.fullName)}
                    </label>
                    <input
                      id="profile-fullName"
                      name="fullName"
                      type="text"
                      value={profileForm.fullName}
                      onChange={handleProfileChange}
                      className="w-full bg-background border border-border/50 h-12 px-4 text-sm text-foreground focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                    />
                  </div>

                  <div>
                    <label htmlFor="profile-phone" className="text-xs text-accent tracking-[0.15em] uppercase mb-3 block">
                      {t(translations.account.phone)}
                    </label>
                    <input
                      id="profile-phone"
                      name="phone"
                      type="tel"
                      value={profileForm.phone}
                      onChange={handleProfileChange}
                      placeholder={t(translations.account.phonePlaceholder)}
                      className="w-full bg-background border border-border/50 h-12 px-4 text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-accent tracking-[0.15em] uppercase mb-3 block">
                      {t(translations.account.email)}
                    </label>
                    <div className="w-full bg-background/50 border border-border/50 h-12 px-4 flex items-center text-sm text-foreground/60">
                      {user.email || t(translations.account.noEmail)}
                    </div>
                    <p className="text-xs text-foreground/40 mt-2 leading-relaxed">{t(translations.account.emailNote)}</p>
                  </div>

                  {status && (
                    <div className="border border-accent/30 bg-accent/10 px-4 py-3 text-center text-xs text-accent tracking-wide">
                      {status}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSaving}
                    className="w-full px-6 py-3.5 bg-accent text-background text-xs tracking-[0.2em] uppercase hover:bg-accent/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                  >
                    <span className="group-hover:tracking-[0.25em] transition-all">
                      {isSaving ? t(translations.account.saving) : t(translations.account.saveChanges)}
                    </span>
                  </button>
                </form>
              </div>
            </ScrollReveal>
          </div>

          {/* Right Content - Saved Properties & Contact History */}
          <div className="lg:col-span-8 space-y-8">
            {/* Saved Properties */}
            <ScrollReveal animation="fade-in-up" delay={150}>
              <div className="bg-card border border-border/50 overflow-hidden transition-all">
                {/* Section Header */}
                <div className="border-b border-border/30 px-8 py-6 bg-gradient-to-br from-accent/5 to-transparent">
                  <div className="flex items-end justify-between">
                    <div>
                      <div className="text-accent text-xs tracking-[0.3em] uppercase mb-2">Your Collection</div>
                      <h2 className="text-2xl">{t(translations.account.savedPropertiesTitle)}</h2>
                    </div>
                    {savedResidences.length > 0 && (
                      <div className="text-sm text-foreground/60">
                        {savedResidences.length} {savedResidences.length === 1 ? 'Property' : 'Properties'}
                      </div>
                    )}
                  </div>
                </div>

                {/* Properties Grid */}
                <div className="p-6">
                  {savedResidences.length === 0 ? (
                    <div className="text-center py-20">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 mb-6">
                        <svg className="w-8 h-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </div>
                      <p className="text-foreground/60 mb-8 text-sm max-w-md mx-auto">
                        {t(translations.account.noSavedProperties)}
                      </p>
                      <Link
                        to="/properties"
                        className="inline-block px-8 py-3 border border-accent text-accent text-xs tracking-[0.15em] uppercase hover:bg-accent hover:text-background transition-all"
                      >
                        {t(translations.account.browseProperties)}
                      </Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {savedResidences.map((residence) => (
                        <Link
                          key={residence.id}
                          to={`/properties/${residence.id}`}
                          className="group border border-border/50 bg-background overflow-hidden hover-glow transition-all h-full flex flex-col"
                        >
                          {residence.image ? (
                            <div className="relative h-48 overflow-hidden">
                              <img
                                src={residence.image}
                                alt={residence.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                            </div>
                          ) : null}
                          <div className="p-5 flex-1 flex flex-col">
                            <div className="flex-1 mb-4">
                              <h3 className="text-base mb-2 text-foreground group-hover:text-accent transition-colors line-clamp-2 leading-snug">
                                {residence.title}
                              </h3>
                              <p className="text-xs text-foreground/60 line-clamp-1">
                                {(() => {
                                  if (residence.location && typeof residence.location === 'object') {
                                    const parts = [
                                      residence.location.area,
                                      residence.location.city,
                                      residence.location.governorate
                                    ].filter(Boolean);
                                    return parts.length > 0 ? parts.join(", ") : "Location not specified";
                                  }
                                  if (typeof residence.location === 'string') {
                                    return residence.location;
                                  }
                                  const parts = [residence.area, residence.city, residence.governorate].filter(Boolean);
                                  return parts.length > 0 ? parts.join(", ") : "Location not specified";
                                })()}
                              </p>
                            </div>
                            <div className="flex items-center justify-between pt-4 border-t border-border/30">
                              {residence.price ? (
                                <span className="text-sm text-accent font-semibold">{residence.price}</span>
                              ) : (
                                <span className="text-xs text-foreground/60 uppercase tracking-wider">Contact for Price</span>
                              )}
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleRemoveSaved(residence.id);
                                }}
                                className="px-3 py-1.5 border border-border/50 text-xs tracking-[0.15em] uppercase text-foreground/70 hover:border-accent hover:text-accent hover:bg-accent/5 transition-all"
                              >
                                {t(translations.account.remove)}
                              </button>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </ScrollReveal>

            {/* Contact History */}
            <ScrollReveal animation="fade-in-up" delay={200}>
              <div className="bg-card border border-border/50 overflow-hidden transition-all">
                {/* Section Header */}
                <div className="border-b border-border/30 px-8 py-6 bg-gradient-to-br from-accent/5 to-transparent">
                  <div className="flex items-end justify-between">
                    <div>
                      <div className="text-accent text-xs tracking-[0.3em] uppercase mb-2">Communication Log</div>
                      <h2 className="text-2xl">{t(translations.account.contactHistoryTitle)}</h2>
                    </div>
                    {contactHistory.length > 0 && (
                      <div className="text-sm text-foreground/60">
                        {contactHistory.length} {contactHistory.length === 1 ? 'Request' : 'Requests'}
                      </div>
                    )}
                  </div>
                </div>

                {/* History List */}
                <div className="p-6">
                  {contactHistory.length === 0 ? (
                    <div className="text-center py-20">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 mb-6">
                        <svg className="w-8 h-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                      </div>
                      <p className="text-sm text-foreground/60 mb-8 max-w-md mx-auto">
                        {t(translations.account.noContactHistory)}
                      </p>
                      <Link
                        to="/contact"
                        className="inline-block px-8 py-3 border border-accent text-accent text-xs tracking-[0.15em] uppercase hover:bg-accent hover:text-background transition-all"
                      >
                        {t(translations.account.contactUs)}
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {contactHistory
                        .slice()
                        .sort((a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0))
                        .map((contact) => (
                          <div key={contact.id} className="border border-border/50 bg-background/50 p-6 hover-glow transition-all group">
                            <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                              <div className="flex-1">
                                <h3 className="text-base text-accent font-semibold mb-1 group-hover:text-accent/80 transition-colors">
                                  {contact.propertyTitle ?? "General Enquiry"}
                                </h3>
                                {contact.createdAt?.seconds ? (
                                  <div className="flex items-center gap-2 text-xs text-foreground/40">
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    {new Date(contact.createdAt.seconds * 1000).toLocaleDateString('en-US', {
                                      year: 'numeric',
                                      month: 'long',
                                      day: 'numeric'
                                    })}
                                  </div>
                                ) : null}
                              </div>
                            </div>
                            {contact.message ? (
                              <p className="text-sm text-foreground/70 leading-relaxed pl-1 border-l-2 border-accent/20">
                                <span className="block pl-4">{contact.message}</span>
                              </p>
                            ) : null}
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Account;
