import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { getDeletedPropertiesPaginated, restoreProperty, hardDeleteProperty } from "../data/firebaseService";
import { ArrowLeft, RotateCcw, Trash2, X } from "lucide-react";
import Pagination from "../components/Pagination";

const AdminPropertiesTrash = () => {
  const navigate = useNavigate();
  const { user, loading, isAdmin } = useAuth();
  const [deletedProperties, setDeletedProperties] = useState([]);
  const [isLoadingProperties, setIsLoadingProperties] = useState(true);
  const [confirmAction, setConfirmAction] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);
  const [firstDoc, setFirstDoc] = useState(null);
  const [lastDoc, setLastDoc] = useState(null);
  const [pageStack, setPageStack] = useState([]);
  const pageSize = 10;

  const fetchDeletedProperties = async (direction = 'next') => {
    try {
      setIsLoadingProperties(true);

      const result = await getDeletedPropertiesPaginated(
        pageSize,
        direction === 'next' ? lastDoc : null,
        direction === 'prev' ? firstDoc : null,
        direction
      );

      setDeletedProperties(result.properties);
      setHasMore(result.hasMore);
      setHasPrev(result.hasPrev);
      setFirstDoc(result.firstDoc);
      setLastDoc(result.lastDoc);
    } catch (error) {
      console.error("Failed to fetch deleted properties:", error);
    } finally {
      setIsLoadingProperties(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchDeletedProperties();
    }
  }, [isAdmin]);

  const handleRestoreClick = (property) => {
    setConfirmAction({ type: "restore", property });
  };

  const handleHardDeleteClick = (property) => {
    setConfirmAction({ type: "hardDelete", property });
  };

  const handleConfirmAction = async () => {
    if (!confirmAction) return;

    try {
      setIsProcessing(true);

      if (confirmAction.type === "restore") {
        await restoreProperty(confirmAction.property.id);
      } else if (confirmAction.type === "hardDelete") {
        await hardDeleteProperty(confirmAction.property.id);
      }

      // Refresh the list
      await fetchDeletedProperties();
      setConfirmAction(null);
    } catch (error) {
      console.error(`Failed to ${confirmAction.type} property:`, error);
      alert(`Failed to ${confirmAction.type} property. Please try again.`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancelAction = () => {
    setConfirmAction(null);
  };

  const handleNextPage = () => {
    if (hasMore) {
      setPageStack([...pageStack, { firstDoc, lastDoc }]);
      setCurrentPage(currentPage + 1);
      fetchDeletedProperties('next');
    }
  };

  const handlePrevPage = () => {
    if (pageStack.length > 0) {
      const prevPage = pageStack[pageStack.length - 1];
      setPageStack(pageStack.slice(0, -1));
      setCurrentPage(currentPage - 1);
      setFirstDoc(prevPage.firstDoc);
      setLastDoc(prevPage.lastDoc);
      fetchDeletedProperties('prev');
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
        <div className="text-platinum-pearl">Access Denied</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-platinum-pearl">
      {/* Confirmation Modal */}
      {confirmAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-luxury-black/80 backdrop-blur-sm">
          <div className="glass-card p-8 max-w-md w-full mx-4">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-xl font-heading font-bold text-platinum-pearl">
                {confirmAction.type === "restore" ? "Restore Property" : "Permanently Delete Property"}
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
                  Are you sure you want to restore{" "}
                  <span className="font-semibold text-gold-primary">
                    {confirmAction.property.title}
                  </span>
                  ? It will be moved back to active properties.
                </>
              ) : (
                <>
                  Are you sure you want to permanently delete{" "}
                  <span className="font-semibold text-gold-primary">
                    {confirmAction.property.title}
                  </span>
                  ? This action cannot be undone and will delete all associated images from storage.
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
                  : "Delete Permanently"}
              </button>
            </div>
          </div>
        </div>
      )}

      <section className="relative isolate overflow-hidden pt-32 pb-20">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-background via-luxury-black/70 to-luxury-black/40" />
          <div className="absolute right-0 top-1/3 h-96 w-96 translate-x-1/3 rounded-full bg-gold-primary/20 blur-[160px]" />
        </div>

        <div className="relative container px-4 lg:px-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => navigate("/admin")}
              className="rounded-full p-2 text-gold-primary transition hover:bg-gold-primary/10"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <div>
              <h1 className="text-4xl font-heading font-bold text-platinum-pearl">
                Deleted Properties
              </h1>
              <p className="text-platinum-pearl/70 mt-2">
                Restore or permanently delete properties
              </p>
            </div>
          </div>

          {/* Properties List */}
          <div className="glass-card p-8">
            {isLoadingProperties ? (
              <div className="text-center text-platinum-pearl/70 py-12">
                Loading deleted properties...
              </div>
            ) : deletedProperties.length === 0 ? (
              <div className="text-center text-platinum-pearl/70 py-12">
                No deleted properties. Trash is empty.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gold-primary/20">
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gold-primary">
                        Title
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gold-primary">
                        Location
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gold-primary">
                        Deleted At
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
                    {deletedProperties.map((property) => (
                      <tr
                        key={property.id}
                        className="transition-colors hover:bg-gold-primary/5"
                      >
                        <td className="px-4 py-4 text-sm text-platinum-pearl">
                          {property.title}
                        </td>
                        <td className="px-4 py-4 text-sm text-platinum-pearl/70">
                          {typeof property.location === "object"
                            ? `${property.location.area || ""}, ${
                                property.location.governorate || ""
                              }`
                                .trim()
                                .replace(/^,\s*|,\s*$/g, "")
                            : property.location || "N/A"}
                        </td>
                        <td className="px-4 py-4 text-sm text-platinum-pearl/70">
                          {property.deletedAt
                            ? new Date(
                                property.deletedAt.seconds * 1000
                              ).toLocaleDateString()
                            : "N/A"}
                        </td>
                        <td className="px-4 py-4 text-sm text-platinum-pearl/70">
                          {property.deletedBy?.displayName || "Unknown"}
                        </td>
                        <td className="px-4 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleRestoreClick(property)}
                              className="rounded-full p-2 text-green-400 transition hover:bg-green-400/10"
                              aria-label="Restore property"
                              title="Restore property"
                            >
                              <RotateCcw className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleHardDeleteClick(property)}
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
                {deletedProperties.length > 0 && (
                  <Pagination
                    currentPage={currentPage}
                    hasMore={hasMore}
                    hasPrev={currentPage > 1}
                    onNext={handleNextPage}
                    onPrev={handlePrevPage}
                    isLoading={isLoadingProperties}
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

export default AdminPropertiesTrash;
