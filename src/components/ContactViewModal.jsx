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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="relative w-full max-w-2xl rounded-2xl bg-gradient-to-br from-background to-background-dark p-8 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-platinum-pearl/70 transition hover:bg-platinum-pearl/10 hover:text-platinum-pearl"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-6 border-b border-gold-primary/20 pb-4">
          <h2 className="text-2xl font-bold text-platinum-pearl">Contact Details</h2>
        </div>

        {/* Contact Information */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Name */}
            <div>
              <label className="text-sm font-semibold text-gold-primary">Name</label>
              <p className="mt-1 text-platinum-pearl">{contact.name || "N/A"}</p>
            </div>

            {/* Email */}
            <div>
              <label className="text-sm font-semibold text-gold-primary">Email</label>
              <p className="mt-1 text-platinum-pearl">{contact.email || "N/A"}</p>
            </div>

            {/* Phone */}
            <div>
              <label className="text-sm font-semibold text-gold-primary">Phone</label>
              <p className="mt-1 text-platinum-pearl">{contact.phone || "N/A"}</p>
            </div>

            {/* City */}
            <div>
              <label className="text-sm font-semibold text-gold-primary">City</label>
              <p className="mt-1 text-platinum-pearl">{contact.city || "N/A"}</p>
            </div>

            {/* Twilight Preview */}
            <div>
              <label className="text-sm font-semibold text-gold-primary">Twilight Preview</label>
              <p className="mt-1 text-platinum-pearl">{formatBoolean(contact.twilightPreview)}</p>
            </div>

            {/* Virtual Walkthrough */}
            <div>
              <label className="text-sm font-semibold text-gold-primary">Virtual Walkthrough</label>
              <p className="mt-1 text-platinum-pearl">{formatBoolean(contact.virtualWalkthrough)}</p>
            </div>

            {/* Created At */}
            <div className="md:col-span-2">
              <label className="text-sm font-semibold text-gold-primary">Submitted At</label>
              <p className="mt-1 text-platinum-pearl/70 text-sm">{formatDate(contact.createdAt)}</p>
            </div>
          </div>

          {/* Message */}
          <div>
            <label className="text-sm font-semibold text-gold-primary">Message</label>
            <div className="mt-2 max-h-40 overflow-y-auto rounded-lg bg-platinum-pearl/5 p-4">
              <p className="whitespace-pre-wrap text-platinum-pearl">
                {contact.message || "No message provided"}
              </p>
            </div>
          </div>
        </div>

        {/* Close Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-full bg-gold-primary px-6 py-2 font-semibold text-background transition hover:bg-gold-primary/90"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContactViewModal;
