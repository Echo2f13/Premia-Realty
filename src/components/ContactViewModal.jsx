import { X } from "lucide-react";

const ContactViewModal = ({ contact, onClose }) => {
  if (!contact) return null;

  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    try {
      // Handle Firestore Timestamp
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleString();
    } catch (error) {
      return "Invalid Date";
    }
  };

  const formatBoolean = (value) => {
    if (value === true) return "Yes";
    if (value === false) return "No";
    return "N/A";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-2xl bg-card border border-border/50 p-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 text-foreground/70 transition hover:bg-accent/10 hover:text-foreground"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-6 border-b border-border/50 pb-4">
          <div className="text-accent text-xs tracking-[0.3em] mb-2">CONTACT DETAILS</div>
          <h2 className="text-3xl text-foreground">View Contact</h2>
        </div>

        {/* Contact Information */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Name */}
            <div>
              <label className="text-sm font-semibold text-accent">Name</label>
              <p className="mt-1 text-foreground">{contact.name || "N/A"}</p>
            </div>

            {/* Email */}
            <div>
              <label className="text-sm font-semibold text-accent">Email</label>
              <p className="mt-1 text-foreground">{contact.email || "N/A"}</p>
            </div>

            {/* Phone */}
            <div>
              <label className="text-sm font-semibold text-accent">Phone</label>
              <p className="mt-1 text-foreground">{contact.phone || "N/A"}</p>
            </div>

            {/* City */}
            <div>
              <label className="text-sm font-semibold text-accent">City</label>
              <p className="mt-1 text-foreground">{contact.city || "N/A"}</p>
            </div>

            {/* Twilight Preview */}
            <div>
              <label className="text-sm font-semibold text-accent">Twilight Preview</label>
              <p className="mt-1 text-foreground">{formatBoolean(contact.twilightPreview)}</p>
            </div>

            {/* Virtual Walkthrough */}
            <div>
              <label className="text-sm font-semibold text-accent">Virtual Walkthrough</label>
              <p className="mt-1 text-foreground">{formatBoolean(contact.virtualWalkthrough)}</p>
            </div>

            {/* Created At */}
            <div className="md:col-span-2">
              <label className="text-sm font-semibold text-accent">Submitted At</label>
              <p className="mt-1 text-foreground/70 text-sm">{formatDate(contact.createdAt)}</p>
            </div>
          </div>

          {/* Message */}
          <div>
            <label className="text-sm font-semibold text-accent">Message</label>
            <div className="mt-2 max-h-40 overflow-y-auto bg-background/50 border border-border/50 p-4">
              <p className="whitespace-pre-wrap text-foreground">
                {contact.message || "No message provided"}
              </p>
            </div>
          </div>
        </div>

        {/* Close Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-8 py-3 bg-accent text-background text-sm uppercase tracking-[0.15em] transition hover:bg-accent/90"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContactViewModal;
