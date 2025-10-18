import { useEffect, useState } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import { addContactForm } from "../data/firebaseService";
import useAuth from "../hooks/useAuth";
import { useToast } from "../components/Toast";
import ScrollReveal from "../components/ScrollReveal";

const initialFormState = {
  name: "",
  email: "",
  phone: "",
  requirements: "",
};

const Contact = () => {
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
              <div className="text-accent text-base font-semibold tracking-[0.3em] mb-4">GET IN TOUCH</div>
              <h1 className="text-6xl md:text-7xl mb-6">Contact Us</h1>
              <p className="text-xl text-foreground/60 font-light leading-relaxed">
                Let us help you find your perfect luxury property
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
                        <div className="text-sm text-accent tracking-wider mb-1">PHONE</div>
                        <div className="text-lg">+973 1234 5678</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <Mail className="w-6 h-6 text-accent mt-1" strokeWidth={1} />
                      <div>
                        <div className="text-sm text-accent tracking-wider mb-1">EMAIL</div>
                        <div className="text-lg">concierge@premiarealty.com</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <MapPin className="w-6 h-6 text-accent mt-1" strokeWidth={1} />
                      <div>
                        <div className="text-sm text-accent tracking-wider mb-1">ADDRESS</div>
                        <div className="text-lg">Manama, Kingdom of Bahrain</div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-border/50">
                    <div className="text-sm text-accent tracking-wider mb-3">HOURS</div>
                    <div className="space-y-2 text-foreground/60">
                      <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                      <p>Private viewings by appointment</p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal animation="fade-in-up" delay={200}>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="text-sm text-accent tracking-wider mb-2 block">FULL NAME</label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Your name"
                      className="w-full bg-card border border-border/50 h-12 px-4 text-foreground/90 placeholder:text-foreground/40 focus:outline-none focus:border-accent transition-colors"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div>
                    <label className="text-sm text-accent tracking-wider mb-2 block">EMAIL</label>
                    <input
                      type="email"
                      name="email"
                      placeholder="your@email.com"
                      className="w-full bg-card border border-border/50 h-12 px-4 text-foreground/90 placeholder:text-foreground/40 focus:outline-none focus:border-accent transition-colors"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div>
                    <label className="text-sm text-accent tracking-wider mb-2 block">PHONE</label>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="+973 XXXX XXXX"
                      className="w-full bg-card border border-border/50 h-12 px-4 text-foreground/90 placeholder:text-foreground/40 focus:outline-none focus:border-accent transition-colors"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div>
                    <label className="text-sm text-accent tracking-wider mb-2 block">MESSAGE</label>
                    <textarea
                      name="requirements"
                      placeholder="Your requirements..."
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
                    {isSubmitting ? "SENDING..." : "SEND MESSAGE"}
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
