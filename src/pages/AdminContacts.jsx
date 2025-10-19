import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { getActiveContactsPaginated, softDeleteContact } from "../data/firebaseService";
import { ShieldCheck, Trash2, Eye, X, Download, ArrowLeft, Archive } from "lucide-react";
import Pagination from "../components/Pagination";
import ContactViewModal from "../components/ContactViewModal";
import ExportContactsModal from "../components/ExportContactsModal";
import ScrollReveal from "../components/ScrollReveal";

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
      <div className="flex min-h-screen items-center justify-center bg-gradient-diagonal-subtle">
        <div className="text-accent">Loading...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-diagonal-subtle">
        <div className="bg-card border border-border/50 p-8 text-center max-w-md">
          <ShieldCheck className="h-16 w-16 text-accent mx-auto mb-4" strokeWidth={1} />
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Access Denied
          </h2>
          <p className="text-foreground/60 mb-6">
            You need admin privileges to access this page.
          </p>
          <button
            onClick={() => navigate("/")}
            className="px-8 py-3 bg-accent text-background text-sm tracking-[0.15em] uppercase hover:bg-accent/90 transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-diagonal-subtle text-foreground">
      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="bg-card border border-border/50 p-8 max-w-md w-full mx-4">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-xl font-bold text-foreground">
                Delete Contact
              </h3>
              <button
                onClick={handleDeleteCancel}
                className="text-foreground/50 hover:text-foreground transition"
                disabled={isDeleting}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="text-foreground/60 mb-6">
              Are you sure you want to delete the contact from{" "}
              <span className="font-semibold text-accent">
                {deleteConfirm.name || deleteConfirm.email}
              </span>
              ? You can restore it from the Trash later.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleDeleteCancel}
                className="flex-1 px-6 py-3 bg-foreground/10 text-sm uppercase tracking-[0.15em] text-foreground transition hover:bg-foreground/20"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 px-6 py-3 bg-red-500 text-sm uppercase tracking-[0.15em] text-white transition hover:bg-red-600"
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
        <div className="relative container px-4 lg:px-8">
          <ScrollReveal animation="fade-in-up">
            <div className="flex items-center gap-4 mb-12">
              <button
                onClick={() => navigate("/admin")}
                className="p-2 text-foreground/70 transition hover:bg-accent/10 hover:text-foreground"
                aria-label="Back to Admin"
              >
                <ArrowLeft className="h-6 w-6" />
              </button>
              <div className="p-4 bg-accent/10 border border-accent/20">
                <ShieldCheck className="h-12 w-12 text-accent" strokeWidth={1} />
              </div>
              <div>
                <div className="text-accent text-xs tracking-[0.3em] mb-2">ADMIN PANEL</div>
                <h1 className="text-5xl lg:text-6xl">Contact Submissions</h1>
                <p className="text-foreground/60 mt-2">
                  View and manage contact form submissions
                </p>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal animation="fade-in-up" delay={200}>
            <div className="bg-card border border-border/50 p-8 mb-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="text-accent text-xs tracking-[0.3em] mb-2">INBOX</div>
                  <h2 className="text-3xl">Contacts</h2>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => navigate("/admin/contacts/trash")}
                    className="flex items-center gap-2 px-6 py-3 bg-foreground/10 text-sm uppercase tracking-[0.15em] text-foreground transition hover:bg-foreground/20"
                    title="View deleted contacts"
                  >
                    <Archive className="h-5 w-5" />
                    Trash
                  </button>
                  <button
                    onClick={handleExportClick}
                    className="flex items-center gap-2 px-6 py-3 bg-accent text-background text-sm uppercase tracking-[0.15em] transition hover:bg-accent/90"
                  >
                    <Download className="h-5 w-5" />
                    Export to Excel/CSV
                  </button>
                </div>
              </div>

              {isLoadingContacts ? (
                <div className="text-center text-foreground/60 py-12">
                  Loading contacts...
                </div>
              ) : contacts.length === 0 ? (
                <div className="text-center text-foreground/60 py-12">
                  No contacts found.
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
                          City
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-accent">
                          Submitted
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-accent">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/30">
                      {contacts.map((contact) => (
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
                            {contact.city || "N/A"}
                          </td>
                          <td className="px-4 py-4 text-sm text-foreground/70">
                            {formatDate(contact.createdAt)}
                          </td>
                          <td className="px-4 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleViewClick(contact)}
                                className="p-2 text-accent transition hover:bg-accent/10"
                                aria-label="View contact"
                                title="View details"
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteClick(contact)}
                                className="p-2 text-red-400 transition hover:bg-red-400/10"
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
          </ScrollReveal>

          <ScrollReveal animation="fade-in-up" delay={400}>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="bg-card border border-border/50 p-8 text-center">
                <div className="text-sm tracking-[0.2em] text-foreground/60 mb-3">TOTAL CONTACTS</div>
                <div className="text-4xl text-accent">{contacts.length}</div>
              </div>
              <div className="bg-card border border-border/50 p-8 text-center">
                <div className="text-sm tracking-[0.2em] text-foreground/60 mb-3">THIS PAGE</div>
                <div className="text-4xl text-accent">{contacts.length}</div>
              </div>
              <div className="bg-card border border-border/50 p-8 text-center">
                <div className="text-sm tracking-[0.2em] text-foreground/60 mb-3">PAGE</div>
                <div className="text-4xl text-accent">{currentPage}</div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
};

export default AdminContacts;
