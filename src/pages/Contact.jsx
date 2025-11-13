import { useEffect, useState } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import { addContactForm } from "../data/firebaseService";
import useAuth from "../hooks/useAuth";
import { useToast } from "../components/Toast";
import ScrollReveal from "../components/ScrollReveal";
import { useLanguage } from "../contexts/LanguageContext";
import { translations } from "../translations";

const initialFormState = {
  name: "",
  email: "",
  phone: "",
  enquiryType: "buy",
  requirements: "",
};

const Contact = () => {
  const { t } = useLanguage();
  const { user, profile, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (!isAuthenticated) return;

    setFormData((prev) => ({
      ...prev,
      name: prev.name || profile?.fullName || user?.displayName || "",
      email: prev.email || profile?.email || user?.email || "",
      phone: prev.phone || profile?.phone || "",
    }));
  }, [isAuthenticated, profile, user]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      await addContactForm({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        enquiryType: formData.enquiryType,
        message: formData.requirements,
      }, {
        userId: user?.uid ?? null,
      });

      toast.success("Form submitted successfully! We'll be in touch soon.");
      setFormData(initialFormState);
    } catch (error) {
      console.error("Failed to submit contact form", error);
      toast.error("We were unable to submit your request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-diagonal-subtle">
      <div className="pt-24">
        <section className="py-20 border-b border-border/50">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="text-center max-w-3xl mx-auto animate-fade-in">
              <div className="text-accent text-base font-semibold tracking-[0.3em] mb-4">{t(translations.contact.subtitle)}</div>
              <h1 className="text-6xl md:text-7xl mb-6">{t(translations.contact.title)}</h1>
              <p className="text-xl text-foreground/60 font-light leading-relaxed">
                {t(translations.contact.description)}
              </p>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="grid md:grid-cols-2 gap-16 max-w-6xl mx-auto">
              <ScrollReveal animation="fade-in-up" delay={100}>
                <div className="space-y-12">
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <Phone className="w-6 h-6 text-accent mt-1" strokeWidth={1} />
                      <div>
                        <div className="text-sm text-accent tracking-wider mb-1">{t(translations.contact.info.phone)}</div>
                        <div className="text-lg">+973 33709005</div>
                        <div className="text-lg">+973 34020266</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <Mail className="w-6 h-6 text-accent mt-1" strokeWidth={1} />
                      <div>
                        <div className="text-sm text-accent tracking-wider mb-1">{t(translations.contact.info.email)}</div>
                        <div className="text-lg">vv.premiarealty@gmail.com</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <MapPin className="w-6 h-6 text-accent mt-1" strokeWidth={1} />
                      <div>
                        <div className="text-sm text-accent tracking-wider mb-1">{t(translations.contact.info.address)}</div>
                        <div className="text-lg">Office 3020, Building 2004, Road 1527 Hidd</div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-border/50">
                    <div className="text-sm text-accent tracking-wider mb-3">{t(translations.contact.info.hours)}</div>
                    <div className="space-y-2 text-foreground/60">
                      <p>{t(translations.contact.info.weekdays)}</p>
                      <p>{t(translations.contact.info.weekend)}</p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal animation="fade-in-up" delay={200}>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="text-sm text-accent tracking-wider mb-2 block">{t(translations.contact.form.name)}</label>
                    <input
                      type="text"
                      name="name"
                      placeholder={t(translations.contact.form.namePlaceholder)}
                      className="w-full bg-card border border-border/50 h-12 px-4 text-foreground/90 placeholder:text-foreground/40 focus:outline-none focus:border-accent transition-colors"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div>
                    <label className="text-sm text-accent tracking-wider mb-2 block">{t(translations.contact.form.email)}</label>
                    <input
                      type="email"
                      name="email"
                      placeholder={t(translations.contact.form.emailPlaceholder)}
                      className="w-full bg-card border border-border/50 h-12 px-4 text-foreground/90 placeholder:text-foreground/40 focus:outline-none focus:border-accent transition-colors"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div>
                    <label className="text-sm text-accent tracking-wider mb-2 block">{t(translations.contact.form.phone)}</label>
                    <input
                      type="tel"
                      name="phone"
                      placeholder={t(translations.contact.form.phonePlaceholder)}
                      className="w-full bg-card border border-border/50 h-12 px-4 text-foreground/90 placeholder:text-foreground/40 focus:outline-none focus:border-accent transition-colors"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div>
                    <label className="text-sm text-accent tracking-wider mb-3 block">{t(translations.contact.form.enquiryType)}</label>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, enquiryType: "buy" }))}
                        className={`flex-1 px-6 py-3 border transition-all ${
                          formData.enquiryType === "buy"
                            ? "bg-accent text-background border-accent"
                            : "bg-card text-foreground/70 border-border/50 hover:border-accent/50"
                        }`}
                      >
                        {t(translations.contact.form.buy)}
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, enquiryType: "sell" }))}
                        className={`flex-1 px-6 py-3 border transition-all ${
                          formData.enquiryType === "sell"
                            ? "bg-accent text-background border-accent"
                            : "bg-card text-foreground/70 border-border/50 hover:border-accent/50"
                        }`}
                      >
                        {t(translations.contact.form.sell)}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-accent tracking-wider mb-2 block">{t(translations.contact.form.message)}</label>
                    <textarea
                      name="requirements"
                      placeholder={t(translations.contact.form.messagePlaceholder)}
                      className="w-full bg-card border border-border/50 min-h-32 px-4 py-3 text-foreground/90 placeholder:text-foreground/40 focus:outline-none focus:border-accent transition-colors resize-none"
                      value={formData.requirements}
                      onChange={handleInputChange}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full px-10 py-4 bg-accent text-background text-sm tracking-[0.2em] hover:bg-accent/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? t(translations.contact.form.sending) : t(translations.contact.form.submit)}
                  </button>
                </form>
              </ScrollReveal>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Contact;
