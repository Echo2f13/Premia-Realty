import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { getDeletedContactsPaginated, restoreContact, hardDeleteContact } from "../data/firebaseService";
import { ArrowLeft, RotateCcw, Trash2, X, Eye } from "lucide-react";
import Pagination from "../components/Pagination";
import ContactViewModal from "../components/ContactViewModal";

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
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-gold-primary">Loading...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background text-platinum-pearl">
      {/* Confirmation Modal */}
      {confirmAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-luxury-black/80 backdrop-blur-sm">
          <div className="glass-card p-8 max-w-md w-full mx-4">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-xl font-heading font-bold text-platinum-pearl">
                {confirmAction.type === "restore" ? "Restore Contact" : "Permanently Delete Contact"}
              </h3>
              <button
                onClick={handleCancelAction}
                className="text-platinum-pearl/50 hover:text-platinum-pearl transition"
                disabled={isProcessing}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="text-platinum-pearl/70 mb-6">
              {confirmAction.type === "restore" ? (
                <>
                  Are you sure you want to restore the contact from{" "}
                  <span className="font-semibold text-gold-primary">
                    {confirmAction.contact.name || confirmAction.contact.email}
                  </span>
                  ?
                </>
              ) : (
                <>
                  Are you sure you want to permanently delete the contact from{" "}
                  <span className="font-semibold text-gold-primary">
                    {confirmAction.contact.name || confirmAction.contact.email}
                  </span>
                  ? This action cannot be undone.
                </>
              )}
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleCancelAction}
                className="flex-1 rounded-full bg-platinum-pearl/10 px-6 py-3 text-sm font-semibold uppercase tracking-[0.4em] text-platinum-pearl transition hover:bg-platinum-pearl/20"
                disabled={isProcessing}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAction}
                className={`flex-1 rounded-full px-6 py-3 text-sm font-semibold uppercase tracking-[0.4em] text-white shadow-lg transition ${
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
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-background via-luxury-black/70 to-luxury-black/40" />
          <div className="absolute right-0 top-1/3 h-96 w-96 translate-x-1/3 rounded-full bg-gold-primary/20 blur-[160px]" />
        </div>

        <div className="relative container px-4 lg:px-8">
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => navigate("/admin/contacts")}
              className="rounded-full p-2 text-platinum-pearl/70 transition hover:bg-platinum-pearl/10 hover:text-platinum-pearl"
              aria-label="Back to Contacts"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <div>
              <h1 className="text-4xl font-heading font-bold text-platinum-pearl">
                Deleted Contacts
              </h1>
              <p className="text-platinum-pearl/70 mt-2">
                Restore or permanently delete contact submissions
              </p>
            </div>
          </div>

          <div className="glass-card p-8">
            <h2 className="text-2xl font-heading font-bold text-platinum-pearl mb-6">
              Trash
            </h2>

            {isLoadingContacts ? (
              <div className="text-center text-platinum-pearl/70 py-12">
                Loading deleted contacts...
              </div>
            ) : deletedContacts.length === 0 ? (
              <div className="text-center text-platinum-pearl/70 py-12">
                No deleted contacts found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gold-primary/20">
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gold-primary">
                        Name
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gold-primary">
                        Email
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gold-primary">
                        Phone
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gold-primary">
                        Deleted
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gold-primary">
                        Deleted By
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gold-primary">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gold-primary/10">
                    {deletedContacts.map((contact) => (
                      <tr
                        key={contact.id}
                        className="transition-colors hover:bg-gold-primary/5"
                      >
                        <td className="px-4 py-4 text-sm text-platinum-pearl">
                          {contact.name || "N/A"}
                        </td>
                        <td className="px-4 py-4 text-sm text-platinum-pearl/70">
                          {contact.email || "N/A"}
                        </td>
                        <td className="px-4 py-4 text-sm text-platinum-pearl/70">
                          {contact.phone || "N/A"}
                        </td>
                        <td className="px-4 py-4 text-sm text-platinum-pearl/70">
                          {formatDate(contact.deletedAt)}
                        </td>
                        <td className="px-4 py-4 text-sm text-platinum-pearl/70">
                          {contact.deletedBy?.displayName || "Unknown"}
                        </td>
                        <td className="px-4 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleViewClick(contact)}
                              className="rounded-full p-2 text-gold-primary transition hover:bg-gold-primary/10"
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
        </div>
      </section>
    </div>
  );
};

export default AdminContactsTrash;
