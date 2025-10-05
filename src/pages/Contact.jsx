const Contact = () => {
  return (
    <div className="pb-24">
      <section className="mx-auto max-w-content px-4 pt-20 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.1fr,0.9fr]">
          <div className="space-y-6">
            <p className="text-xs uppercase tracking-[0.35em] text-accent/70">BESPOKE CONSULTATION</p>
            <h1 className="font-display text-4xl text-white sm:text-5xl">
              Initiate a Private Conversation
            </h1>
            <p className="text-base leading-relaxed text-white/65">
              Share your preferences and our concierge will design a bespoke discovery experience—whether it is a twilight penthouse preview or a personalised walkthrough of our upcoming residences.
            </p>

            <div className="grid gap-6 rounded-[2.5rem] border border-border/40 bg-surface/50 p-8 sm:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-white/50">Call</p>
                <a href="tel:+91-9876543210" className="mt-2 block text-lg text-white transition hover:text-accent">
                  +91 98765 43210
                </a>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-white/50">Email</p>
                <a
                  href="mailto:concierge@premiagoldclass.com"
                  className="mt-2 block text-lg text-white transition hover:text-accent"
                >
                  concierge@premiagoldclass.com
                </a>
              </div>
              <div className="sm:col-span-2">
                <p className="text-xs uppercase tracking-[0.35em] text-white/50">Address</p>
                <p className="mt-2 text-lg text-white/70">
                  9th Avenue, Sector 62, Gurgaon, NCR 122102
                </p>
              </div>
            </div>
          </div>

          <form className="space-y-6 rounded-[2.5rem] border border-border/40 bg-background/70 p-8 shadow-card">
            <div className="space-y-2">
              <label htmlFor="name" className="text-xs uppercase tracking-[0.35em] text-white/60">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Your full name"
                className="w-full rounded-full border border-border/50 bg-background/60 px-5 py-3 text-sm text-white placeholder:text-white/30 focus:border-accent focus:outline-none focus:ring-0"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-xs uppercase tracking-[0.35em] text-white/60">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="your@email.com"
                className="w-full rounded-full border border-border/50 bg-background/60 px-5 py-3 text-sm text-white placeholder:text-white/30 focus:border-accent focus:outline-none focus:ring-0"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="message" className="text-xs uppercase tracking-[0.35em] text-white/60">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows="5"
                placeholder="Tell us about your dream residence, preferred city, or any bespoke requirements."
                className="w-full rounded-3xl border border-border/50 bg-background/60 px-5 py-4 text-sm text-white placeholder:text-white/30 focus:border-accent focus:outline-none focus:ring-0"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-full bg-accent px-8 py-3 text-sm font-semibold uppercase tracking-[0.35em] text-background shadow-glow transition hover:brightness-110"
            >
              Submit Request
            </button>
            <p className="text-xs text-white/40">
              By submitting, you consent to a private liaison with our concierge team. Your data remains confidential.
            </p>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Contact;