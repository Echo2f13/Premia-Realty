import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { getDeletedContactsPaginated, restoreContact, hardDeleteContact } from "../data/firebaseService";
import { ArrowLeft, RotateCcw, Trash2, X, Eye } from "lucide-react";
import Pagination from "../components/Pagination";
import ContactViewModal from "../components/ContactViewModal";
import ScrollReveal from "../components/ScrollReveal";

const AdminContactsTrash = () => {
  const navigate = useNavigate();
  const { user, loading, isAdmin } = useAuth();
  const [deletedContacts, setDeletedContacts] = useState([]);
  const [isLoadingContacts, setIsLoadingContacts] = useState(true);
  const [confirmAction, setConfirmAction] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [viewContact, setViewContact] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);
  const [firstDoc, setFirstDoc] = useState(null);
  const [lastDoc, setLastDoc] = useState(null);
  const [pageStack, setPageStack] = useState([]);
  const pageSize = 10;

  const fetchDeletedContacts = async (direction = 'next') => {
    try {
      setIsLoadingContacts(true);

      const result = await getDeletedContactsPaginated(
        pageSize,
        direction === 'next' ? lastDoc : null,
        direction === 'prev' ? firstDoc : null,
        direction
      );

      setDeletedContacts(result.contacts);
      setHasMore(result.hasMore);
      setHasPrev(result.hasPrev);
      setFirstDoc(result.firstDoc);
      setLastDoc(result.lastDoc);
    } catch (error) {
      console.error("Failed to fetch deleted contacts:", error);
    } finally {
      setIsLoadingContacts(false);
    }
  };

  const handleNextPage = () => {
    if (hasMore) {
      setPageStack([...pageStack, { firstDoc, lastDoc }]);
      setCurrentPage(currentPage + 1);
      fetchDeletedContacts('next');
    }
  };

  const handlePrevPage = () => {
    if (pageStack.length > 0) {
      const prevPage = pageStack[pageStack.length - 1];
      setPageStack(pageStack.slice(0, -1));
      setCurrentPage(currentPage - 1);
      setFirstDoc(prevPage.firstDoc);
      setLastDoc(prevPage.lastDoc);
      fetchDeletedContacts('prev');
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchDeletedContacts();
    }
  }, [isAdmin]);

  const handleViewClick = (contact) => {
    setViewContact(contact);
  };

  const handleRestoreClick = (contact) => {
    setConfirmAction({
      type: "restore",
      contact,
    });
  };

  const handleHardDeleteClick = (contact) => {
    setConfirmAction({
      type: "hardDelete",
      contact,
    });
  };

  const handleConfirmAction = async () => {
    if (!confirmAction) return;

    try {
      setIsProcessing(true);
      const { type, contact } = confirmAction;

      if (type === "restore") {
        await restoreContact(contact.id);
      } else if (type === "hardDelete") {
        await hardDeleteContact(contact.id);
      }

      // Refresh the list
      await fetchDeletedContacts();
      setConfirmAction(null);
    } catch (error) {
      console.error(`Failed to ${confirmAction.type} contact:`, error);
      alert(`Failed to ${confirmAction.type === "restore" ? "restore" : "delete"} contact. Please try again.`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancelAction = () => {
    setConfirmAction(null);
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleDateString();
    } catch (error) {
      return "Invalid Date";
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-diagonal-subtle">
        <div className="text-accent">Loading...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-diagonal-subtle text-foreground">
      {/* Confirmation Modal */}
      {confirmAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-luxury-black/80 backdrop-blur-sm">
          <div className="bg-card border border-border/50 p-8 max-w-md w-full mx-4">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-xl font-serif font-bold text-foreground">
                {confirmAction.type === "restore" ? "Restore Contact" : "Permanently Delete Contact"}
              </h3>
              <button
                onClick={handleCancelAction}
                className="text-foreground/50 hover:text-foreground transition"
                disabled={isProcessing}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="text-foreground/70 mb-6">
              {confirmAction.type === "restore" ? (
                <>
                  Are you sure you want to restore the contact from{" "}
                  <span className="font-semibold text-accent">
                    {confirmAction.contact.name || confirmAction.contact.email}
                  </span>
                  ?
                </>
              ) : (
                <>
                  Are you sure you want to permanently delete the contact from{" "}
                  <span className="font-semibold text-accent">
                    {confirmAction.contact.name || confirmAction.contact.email}
                  </span>
                  ? This action cannot be undone.
                </>
              )}
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleCancelAction}
                className="flex-1 px-6 py-3 bg-foreground/10 text-sm uppercase tracking-[0.15em] text-foreground transition hover:bg-foreground/20"
                disabled={isProcessing}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAction}
                className={`flex-1 px-6 py-3 text-sm uppercase tracking-[0.15em] text-white transition ${
                  confirmAction.type === "restore"
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-red-500 hover:bg-red-600"
                }`}
                disabled={isProcessing}
              >
                {isProcessing
                  ? "Processing..."
                  : confirmAction.type === "restore"
                  ? "Restore"
                  : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Contact Modal */}
      {viewContact && (
        <ContactViewModal
          contact={viewContact}
          onClose={() => setViewContact(null)}
        />
      )}

      <section className="relative isolate overflow-hidden pt-32 pb-20">
        <div className="relative container px-4 lg:px-8">
          <ScrollReveal animation="fade-in-up">
            <div className="flex items-center gap-4 mb-12">
              <button
                onClick={() => navigate("/admin/contacts")}
                className="p-2 text-foreground/70 transition hover:bg-accent/10 hover:text-foreground"
                aria-label="Back to Contacts"
              >
                <ArrowLeft className="h-6 w-6" />
              </button>
              <div>
                <div className="text-accent text-xs tracking-[0.3em] mb-2">ADMIN PANEL</div>
                <h1 className="text-5xl lg:text-6xl">
                  Deleted Contacts
                </h1>
                <p className="text-foreground/60 mt-2">
                  Restore or permanently delete contact submissions
                </p>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal animation="fade-in-up" delay={200}>
            <div className="bg-card border border-border/50 p-8">
              <div>
                <div className="text-accent text-xs tracking-[0.3em] mb-2">TRASH</div>
                <h2 className="text-3xl mb-6">Deleted Contacts</h2>
              </div>

            {isLoadingContacts ? (
              <div className="text-center text-foreground/70 py-12">
                Loading deleted contacts...
              </div>
            ) : deletedContacts.length === 0 ? (
              <div className="text-center text-foreground/70 py-12">
                No deleted contacts found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border/50">
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-accent">
                        Name
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-accent">
                        Email
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-accent">
                        Phone
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-accent">
                        Type
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-accent">
                        Deleted
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-accent">
                        Deleted By
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-accent">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gold-primary/10">
                    {deletedContacts.map((contact) => (
                      <tr
                        key={contact.id}
                        className="transition-colors hover:bg-accent/5"
                      >
                        <td className="px-4 py-4 text-sm text-foreground">
                          {contact.name || "N/A"}
                        </td>
                        <td className="px-4 py-4 text-sm text-foreground/70">
                          {contact.email || "N/A"}
                        </td>
                        <td className="px-4 py-4 text-sm text-foreground/70">
                          {contact.phone || "N/A"}
                        </td>
                        <td className="px-4 py-4 text-sm text-foreground/70">
                          <span className={`inline-block px-3 py-1 text-xs uppercase tracking-wider ${
                            contact.enquiryType === "sell"
                              ? "bg-blue-500/20 text-blue-400"
                              : "bg-green-500/20 text-green-400"
                          }`}>
                            {contact.enquiryType === "sell" ? "Sell" : "Buy"}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-sm text-foreground/70">
                          {formatDate(contact.deletedAt)}
                        </td>
                        <td className="px-4 py-4 text-sm text-foreground/70">
                          {contact.deletedBy?.displayName || "Unknown"}
                        </td>
                        <td className="px-4 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleViewClick(contact)}
                              className="rounded-full p-2 text-accent transition hover:bg-gold-primary/10"
                              aria-label="View contact"
                              title="View details"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleRestoreClick(contact)}
                              className="rounded-full p-2 text-green-400 transition hover:bg-green-400/10"
                              aria-label="Restore contact"
                              title="Restore contact"
                            >
                              <RotateCcw className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleHardDeleteClick(contact)}
                              className="rounded-full p-2 text-red-400 transition hover:bg-red-400/10"
                              aria-label="Delete permanently"
                              title="Delete permanently"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Pagination */}
                {deletedContacts.length > 0 && (
                  <Pagination
                    currentPage={currentPage}
                    hasMore={hasMore}
                    hasPrev={currentPage > 1}
                    onNext={handleNextPage}
                    onPrev={handlePrevPage}
                    isLoading={isLoadingContacts}
                  />
                )}
              </div>
            )}
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
};

export default AdminContactsTrash;
