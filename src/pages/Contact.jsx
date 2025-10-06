import { useEffect, useState } from "react";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { addContactForm } from "../data/firebaseService";
import useAuth from "../hooks/useAuth";

const contacts = [
  { icon: Phone, title: "Phone", detail: "+1 (555) 123-4567", link: "tel:+15551234567" },
  { icon: Mail, title: "Email", detail: "info@premiarealty.com", link: "mailto:info@premiarealty.com" },
  { icon: MapPin, title: "Office", detail: "123 Luxury Avenue, Downtown" },
  { icon: Clock, title: "Hours", detail: "Mon - Fri: 9AM - 6PM" },
];

const initialFormState = {
  name: "",
  email: "",
  phone: "",
  city: "",
  requirements: "",
  virtualWalkthrough: false,
  twilightPreview: false,
};

const Contact = () => {
  const { user, profile, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      await addContactForm({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        city: formData.city,
        message: formData.requirements,
        virtualWalkthrough: formData.virtualWalkthrough,
        twilightPreview: formData.twilightPreview,
      }, {
        userId: user?.uid ?? null,
        propertyTitle: formData.city || null,
      });

      alert("Form submitted successfully!");
      setFormData(initialFormState);
    } catch (error) {
      console.error("Failed to submit contact form", error);
      alert("We were unable to submit your request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-background text-platinum-pearl">
      <section className="relative isolate overflow-hidden pt-32 pb-24">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-luxury-black/70 to-luxury-black/40" />
        <div className="absolute -left-20 top-[-10%] h-[520px] w-[520px] rounded-full bg-gold-primary/20 blur-[200px]" />
        <div className="absolute bottom-[-25%] right-[-10%] h-[480px] w-[480px] rounded-full bg-gold-primary/15 blur-[200px]" />

        <div className="relative container px-4 lg:px-8">
          <div className="grid gap-14 lg:grid-cols-[1.1fr,0.9fr]">
            <div className="space-y-8 animate-fade-in">
              <span className="text-xs font-medium uppercase tracking-[0.45em] text-gold-primary/75">Bespoke Consultation</span>
              <h1 className="text-4xl font-serif md:text-5xl">Initiate a private conversation</h1>
              <p className="max-w-xl text-base leading-relaxed text-platinum-pearl/70">
                Share your preferences and our concierge will choreograph a bespoke discovery experience: twilight penthouse previews, private villa walkthroughs, or immersive digital twin tours.
              </p>

              <div className="glass-card grid gap-6 bg-luxury-black/60 p-10 text-sm text-platinum-pearl/70 sm:grid-cols-2">
                <div>
                  <p className="text-xs uppercase tracking-[0.4em] text-platinum-pearl/50">Call</p>
                  <a href="tel:+15551234567" className="mt-2 block text-lg text-platinum-pearl transition hover:text-gold-primary">
                    +1 (555) 123-4567
                  </a>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.4em] text-platinum-pearl/50">Email</p>
                  <a href="mailto:info@premiarealty.com" className="mt-2 block text-lg text-platinum-pearl transition hover:text-gold-primary">
                    info@premiarealty.com
                  </a>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-xs uppercase tracking-[0.4em] text-platinum-pearl/50">Address</p>
                  <p className="mt-2 text-lg text-platinum-pearl/70">123 Luxury Avenue, Downtown, NY 10001</p>
                </div>
                <div className="sm:col-span-2 rounded-3xl border border-gold-primary/20 bg-luxury-black/40 px-6 py-4 text-xs uppercase tracking-[0.4em] text-platinum-pearl/55">
                  Concierge Hours: 9 AM - 6 PM | Private preview slots available Thu-Sun evenings
                </div>
              </div>

              <div className="glass-card space-y-3 bg-luxury-black/60 p-8 text-sm text-platinum-pearl/70">
                <p className="text-xs uppercase tracking-[0.4em] text-gold-primary/75">Virtual First</p>
                <h2 className="text-2xl font-serif">Metaverse Twin Tours</h2>
                <p>
                  Explore residences via immersive digital twin showcasing lighting, finishes, and furniture layouts before your private visit.
                </p>
                <span className="inline-flex w-fit items-center rounded-full border border-gold-primary/20 px-4 py-2 text-xs uppercase tracking-[0.4em] text-gold-primary">
                  Request access code
                </span>
              </div>
            </div>

            <form className="glass-card space-y-6 bg-luxury-black/70 p-10 shadow-glass animate-slide-up" onSubmit={handleSubmit}>
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-[0.4em] text-platinum-pearl/60">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full rounded-full border border-gold-primary/30 bg-luxury-charcoal/60 px-5 py-3 text-sm text-platinum-pearl placeholder:text-platinum-pearl/35 focus:border-gold-primary focus:outline-none"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-[0.4em] text-platinum-pearl/60">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full rounded-full border border-gold-primary/30 bg-luxury-charcoal/60 px-5 py-3 text-sm text-platinum-pearl placeholder:text-platinum-pearl/35 focus:border-gold-primary focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-[0.4em] text-platinum-pearl/60">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="+1 (555) 000-0000"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full rounded-full border border-gold-primary/30 bg-luxury-charcoal/60 px-5 py-3 text-sm text-platinum-pearl placeholder:text-platinum-pearl/35 focus:border-gold-primary focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-[0.4em] text-platinum-pearl/60">Preferred City</label>
                <select
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full rounded-full border border-gold-primary/30 bg-luxury-charcoal/60 px-5 py-3 text-sm text-platinum-pearl focus:border-gold-primary focus:outline-none"
                >
                  <option value="" hidden>
                    Select city of interest
                  </option>
                  <option value="mumbai">Mumbai</option>
                  <option value="gurgaon">Gurgaon</option>
                  <option value="goa">Goa</option>
                  <option value="hyderabad">Hyderabad</option>
                  <option value="bengaluru">Bengaluru</option>
                  <option value="international">International Portfolio</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-[0.4em] text-platinum-pearl/60">Bespoke Requirements</label>
                <textarea
                  rows={6}
                  name="requirements"
                  placeholder="Tell us about your dream residence, preferred amenities, or lifestyle expectations."
                  value={formData.requirements}
                  onChange={handleInputChange}
                  className="w-full rounded-3xl border border-gold-primary/30 bg-luxury-charcoal/60 px-5 py-4 text-sm text-platinum-pearl placeholder:text-platinum-pearl/35 focus:border-gold-primary focus:outline-none"
                />
              </div>

              <div className="grid gap-3 text-xs uppercase tracking-[0.35em] text-platinum-pearl/55 sm:grid-cols-2">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    name="virtualWalkthrough"
                    checked={formData.virtualWalkthrough}
                    onChange={handleCheckboxChange}
                    className="h-4 w-4 rounded border-gold-primary/40 bg-luxury-charcoal/70"
                  />
                  Virtual walkthrough request
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    name="twilightPreview"
                    checked={formData.twilightPreview}
                    onChange={handleCheckboxChange}
                    className="h-4 w-4 rounded border-gold-primary/40 bg-luxury-charcoal/70"
                  />
                  Twilight preview slot
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-full bg-gradient-gold px-8 py-3 text-sm font-semibold uppercase tracking-[0.4em] text-luxury-black shadow-gold transition hover:shadow-luxury disabled:opacity-75"
              >
                Submit Request
              </button>
              <p className="text-xs text-platinum-pearl/45">
                By submitting, you consent to a private liaison with our concierge team. Your preferences remain strictly confidential.
              </p>
            </form>
          </div>
        </div>
      </section>

      <section className="container grid gap-10 px-4 pb-24 lg:grid-cols-3 lg:px-8">
        {contacts.map((contact) => (
          <div key={contact.title} className="glass-card flex items-start gap-4 bg-luxury-black/60 p-8">
            <div className="rounded-lg bg-gold-primary/10 p-3 text-gold-primary">
              <contact.icon className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-platinum-pearl">{contact.title}</h3>
              {contact.link ? (
                <a href={contact.link} className="text-sm text-platinum-pearl/70 transition hover:text-gold-primary">
                  {contact.detail}
                </a>
              ) : (
                <p className="text-sm text-platinum-pearl/70">{contact.detail}</p>
              )}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default Contact;


