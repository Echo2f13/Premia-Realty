import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { getActiveContactsPaginated, softDeleteContact } from "../data/firebaseService";
import { ShieldCheck, Trash2, Eye, X, Download, ArrowLeft, Archive } from "lucide-react";
import Pagination from "../components/Pagination";
import ContactViewModal from "../components/ContactViewModal";
import ExportContactsModal from "../components/ExportContactsModal";

const AdminContacts = () => {
  const navigate = useNavigate();
  const { user, loading, isAuthenticated, isAdmin } = useAuth();
  const [contacts, setContacts] = useState([]);
  const [isLoadingContacts, setIsLoadingContacts] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [viewContact, setViewContact] = useState(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const hasCheckedAuth = useRef(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);
  const [firstDoc, setFirstDoc] = useState(null);
  const [lastDoc, setLastDoc] = useState(null);
  const [pageStack, setPageStack] = useState([]);
  const pageSize = 10;

  // Auth check
  useEffect(() => {
    if (loading) return;
    if (hasCheckedAuth.current) return;

    hasCheckedAuth.current = true;

    if (!isAuthenticated) {
      console.log("❌ Not authenticated - redirecting to login");
      navigate("/login", { state: { from: "/admin/contacts" } });
      return;
    }

    if (!isAdmin) {
      console.log("❌ Not admin - redirecting to home");
      navigate("/");
      return;
    }

    console.log("✅ Admin access granted!");
  }, [loading, isAuthenticated, isAdmin, navigate]);

  const fetchContacts = async (direction = 'next') => {
    try {
      setIsLoadingContacts(true);

      const result = await getActiveContactsPaginated(
        pageSize,
        direction === 'next' ? lastDoc : null,
        direction === 'prev' ? firstDoc : null,
        direction
      );

      setContacts(result.contacts);
      setHasMore(result.hasMore);
      setHasPrev(result.hasPrev);
      setFirstDoc(result.firstDoc);
      setLastDoc(result.lastDoc);
    } catch (error) {
      console.error("Failed to fetch contacts:", error);
    } finally {
      setIsLoadingContacts(false);
    }
  };

  const handleNextPage = () => {
    if (hasMore) {
      setPageStack([...pageStack, { firstDoc, lastDoc }]);
      setCurrentPage(currentPage + 1);
      fetchContacts('next');
    }
  };

  const handlePrevPage = () => {
    if (pageStack.length > 0) {
      const prevPage = pageStack[pageStack.length - 1];
      setPageStack(pageStack.slice(0, -1));
      setCurrentPage(currentPage - 1);
      setFirstDoc(prevPage.firstDoc);
      setLastDoc(prevPage.lastDoc);
      fetchContacts('prev');
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchContacts('next');
    }
  }, [isAdmin]);

  const handleViewClick = (contact) => {
    setViewContact(contact);
  };

  const handleDeleteClick = (contact) => {
    setDeleteConfirm(contact);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm) return;

    try {
      setIsDeleting(true);
      await softDeleteContact(deleteConfirm.id, user);

      // Refresh the contacts list
      await fetchContacts();

      setDeleteConfirm(null);
    } catch (error) {
      console.error("Failed to delete contact:", error);
      alert("Failed to delete contact. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirm(null);
  };

  const handleExportClick = () => {
    setShowExportModal(true);
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
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="glass-card p-8 text-center max-w-md">
          <ShieldCheck className="h-16 w-16 text-gold-primary mx-auto mb-4" />
          <h2 className="text-2xl font-heading font-bold text-platinum-pearl mb-2">
            Access Denied
          </h2>
          <p className="text-platinum-pearl/70 mb-6">
            You need admin privileges to access this page.
          </p>
          <button
            onClick={() => navigate("/")}
            className="rounded-full bg-gradient-gold px-6 py-3 text-sm font-semibold uppercase tracking-[0.4em] text-luxury-black shadow-gold transition hover:shadow-luxury"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-platinum-pearl">
      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-luxury-black/80 backdrop-blur-sm">
          <div className="glass-card p-8 max-w-md w-full mx-4">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-xl font-heading font-bold text-platinum-pearl">
                Delete Contact
              </h3>
              <button
                onClick={handleDeleteCancel}
                className="text-platinum-pearl/50 hover:text-platinum-pearl transition"
                disabled={isDeleting}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="text-platinum-pearl/70 mb-6">
              Are you sure you want to delete the contact from{" "}
              <span className="font-semibold text-gold-primary">
                {deleteConfirm.name || deleteConfirm.email}
              </span>
              ? You can restore it from the Trash later.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleDeleteCancel}
                className="flex-1 rounded-full bg-platinum-pearl/10 px-6 py-3 text-sm font-semibold uppercase tracking-[0.4em] text-platinum-pearl transition hover:bg-platinum-pearl/20"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 rounded-full bg-red-500 px-6 py-3 text-sm font-semibold uppercase tracking-[0.4em] text-white shadow-lg transition hover:bg-red-600"
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
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

      {/* Export Contacts Modal */}
      {showExportModal && (
        <ExportContactsModal
          onClose={() => setShowExportModal(false)}
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
              onClick={() => navigate("/admin")}
              className="rounded-full p-2 text-platinum-pearl/70 transition hover:bg-platinum-pearl/10 hover:text-platinum-pearl"
              aria-label="Back to Admin"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <ShieldCheck className="h-12 w-12 text-gold-primary" />
            <div>
              <h1 className="text-4xl font-heading font-bold text-platinum-pearl">
                Contact Submissions
              </h1>
              <p className="text-platinum-pearl/70 mt-2">
                View and manage contact form submissions
              </p>
            </div>
          </div>

          <div className="glass-card p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-heading font-bold text-platinum-pearl">
                Contacts
              </h2>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate("/admin/contacts/trash")}
                  className="flex items-center gap-2 rounded-full bg-platinum-pearl/10 px-6 py-3 text-sm font-semibold uppercase tracking-[0.4em] text-platinum-pearl transition hover:bg-platinum-pearl/20"
                  title="View deleted contacts"
                >
                  <Archive className="h-5 w-5" />
                  Trash
                </button>
                <button
                  onClick={handleExportClick}
                  className="flex items-center gap-2 rounded-full bg-platinum-pearl/10 px-6 py-3 text-sm font-semibold uppercase tracking-[0.4em] text-platinum-pearl transition hover:bg-platinum-pearl/20"
                >
                  <Download className="h-5 w-5" />
                  Export to Excel/CSV
                </button>
              </div>
            </div>

            {isLoadingContacts ? (
              <div className="text-center text-platinum-pearl/70 py-12">
                Loading contacts...
              </div>
            ) : contacts.length === 0 ? (
              <div className="text-center text-platinum-pearl/70 py-12">
                No contacts found.
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
                        City
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gold-primary">
                        Submitted
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gold-primary">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gold-primary/10">
                    {contacts.map((contact) => (
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
                          {contact.city || "N/A"}
                        </td>
                        <td className="px-4 py-4 text-sm text-platinum-pearl/70">
                          {formatDate(contact.createdAt)}
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
                              onClick={() => handleDeleteClick(contact)}
                              className="rounded-full p-2 text-red-400 transition hover:bg-red-400/10"
                              aria-label="Delete contact"
                              title="Delete contact"
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
                {contacts.length > 0 && (
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

          <div className="grid gap-6 md:grid-cols-3">
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold text-gold-primary mb-2">
                Total Contacts
              </h3>
              <p className="text-4xl font-bold text-platinum-pearl">
                {contacts.length}
              </p>
            </div>
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold text-gold-primary mb-2">
                This Page
              </h3>
              <p className="text-4xl font-bold text-platinum-pearl">
                {contacts.length}
              </p>
            </div>
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold text-gold-primary mb-2">
                Page
              </h3>
              <p className="text-4xl font-bold text-platinum-pearl">{currentPage}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminContacts;
