import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { getActivePropertiesPaginated, softDeleteProperty } from "../data/firebaseService";
import { ShieldCheck, Plus, Trash2, Edit, X, Archive, Mail } from "lucide-react";
import Pagination from "../components/Pagination";

const Admin = () => {
  const navigate = useNavigate();
  const { user, loading, isAuthenticated, isAdmin } = useAuth();
  const [properties, setProperties] = useState([]);
  const [isLoadingProperties, setIsLoadingProperties] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const hasCheckedAuth = useRef(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);
  const [firstDoc, setFirstDoc] = useState(null);
  const [lastDoc, setLastDoc] = useState(null);
  const [pageStack, setPageStack] = useState([]); // Stack to track page cursors
  const pageSize = 10;

  // Debug logging
  useEffect(() => {
    console.log("🔐 Admin Page - Auth State:", {
      loading,
      isAuthenticated,
      isAdmin,
      user: user?.email,
      hasCheckedAuth: hasCheckedAuth.current,
    });
  }, [loading, isAuthenticated, isAdmin, user]);

  useEffect(() => {
    // Only check once when loading is done
    if (loading) return;
    if (hasCheckedAuth.current) return;

    hasCheckedAuth.current = true;

    if (!isAuthenticated) {
      console.log("❌ Not authenticated - redirecting to login");
      navigate("/login", { state: { from: "/admin" } });
      return;
    }

    // Check if user is admin (using custom claim)
    if (!isAdmin) {
      console.log("❌ Not admin - redirecting to home");
      navigate("/");
      return;
    }

    console.log("✅ Admin access granted!");
  }, [loading, isAuthenticated, isAdmin, navigate]);

  const fetchProperties = async (direction = 'next', cursor = null) => {
    try {
      setIsLoadingProperties(true);

      const result = await getActivePropertiesPaginated(
        pageSize,
        direction === 'next' ? lastDoc : null,
        direction === 'prev' ? firstDoc : null,
        direction
      );

      setProperties(result.properties);
      setHasMore(result.hasMore);
      setHasPrev(result.hasPrev);
      setFirstDoc(result.firstDoc);
      setLastDoc(result.lastDoc);
    } catch (error) {
      console.error("Failed to fetch properties:", error);
    } finally {
      setIsLoadingProperties(false);
    }
  };

  const handleNextPage = () => {
    if (hasMore) {
      setPageStack([...pageStack, { firstDoc, lastDoc }]);
      setCurrentPage(currentPage + 1);
      fetchProperties('next');
    }
  };

  const handlePrevPage = () => {
    if (pageStack.length > 0) {
      const prevPage = pageStack[pageStack.length - 1];
      setPageStack(pageStack.slice(0, -1));
      setCurrentPage(currentPage - 1);
      setFirstDoc(prevPage.firstDoc);
      setLastDoc(prevPage.lastDoc);
      fetchProperties('prev');
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchProperties('next');
    }
  }, [isAdmin]);

  const handleAddProperty = () => {
    navigate("/admin/properties/add");
  };

  const handleEditProperty = (propertyId) => {
    navigate(`/admin/properties/edit/${propertyId}`);
  };

  const handleDeleteClick = (property) => {
    setDeleteConfirm(property);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm) return;

    try {
      setIsDeleting(true);
      await softDeleteProperty(deleteConfirm.id, user);

      // Refresh the properties list
      await fetchProperties();

      setDeleteConfirm(null);
    } catch (error) {
      console.error("Failed to delete property:", error);
      alert("Failed to delete property. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirm(null);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-gold-primary">Loading...</div>
      </div>
    );
  }

  // If not admin, show access denied message instead of blank loading
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
                Delete Property
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
              Are you sure you want to delete{" "}
              <span className="font-semibold text-gold-primary">
                {deleteConfirm.title}
              </span>
              ? This action cannot be undone and will delete all associated images.
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

      <section className="relative isolate overflow-hidden pt-32 pb-20">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-background via-luxury-black/70 to-luxury-black/40" />
          <div className="absolute right-0 top-1/3 h-96 w-96 translate-x-1/3 rounded-full bg-gold-primary/20 blur-[160px]" />
        </div>

        <div className="relative container px-4 lg:px-8">
          <div className="flex items-center gap-4 mb-8">
            <ShieldCheck className="h-12 w-12 text-gold-primary" />
            <div>
              <h1 className="text-4xl font-heading font-bold text-platinum-pearl">
                Admin Dashboard
              </h1>
              <p className="text-platinum-pearl/70 mt-2">
                Manage properties and view analytics
              </p>
            </div>
          </div>

          {/* Contacts Section */}
          <div className="glass-card p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-heading font-bold text-platinum-pearl">
                  Submitted Contacts
                </h2>
                <p className="text-platinum-pearl/50 text-sm mt-1">
                  Manage and view contact form submissions
                </p>
              </div>
              <button
                onClick={() => navigate("/admin/contacts")}
                className="flex items-center gap-2 rounded-full bg-gradient-gold px-6 py-3 text-sm font-semibold uppercase tracking-[0.4em] text-luxury-black shadow-gold transition hover:shadow-luxury"
              >
                <Mail className="h-5 w-5" />
                View Contacts
              </button>
            </div>
          </div>

          <div className="glass-card p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-heading font-bold text-platinum-pearl">
                Properties
              </h2>
              <div className="flex gap-3">
                <button
                  onClick={() => navigate("/admin/trash")}
                  className="flex items-center gap-2 rounded-full bg-platinum-pearl/10 px-6 py-3 text-sm font-semibold uppercase tracking-[0.4em] text-platinum-pearl transition hover:bg-platinum-pearl/20"
                >
                  <Archive className="h-5 w-5" />
                  Trash
                </button>
                <button
                  onClick={handleAddProperty}
                  className="flex items-center gap-2 rounded-full bg-gradient-gold px-6 py-3 text-sm font-semibold uppercase tracking-[0.4em] text-luxury-black shadow-gold transition hover:shadow-luxury"
                >
                  <Plus className="h-5 w-5" />
                  Add Property
                </button>
              </div>
            </div>

            {isLoadingProperties ? (
              <div className="text-center text-platinum-pearl/70 py-12">
                Loading properties...
              </div>
            ) : properties.length === 0 ? (
              <div className="text-center text-platinum-pearl/70 py-12">
                No properties found. Add your first property to get started.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gold-primary/20">
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gold-primary">
                        Image
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gold-primary">
                        Title
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gold-primary">
                        Type
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gold-primary">
                        Location
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gold-primary">
                        Price
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gold-primary">
                        Beds/Baths
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gold-primary">
                        Status
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gold-primary">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gold-primary/10">
                    {properties.map((property) => (
                      <tr
                        key={property.id}
                        className="transition-colors hover:bg-gold-primary/5"
                      >
                        <td className="px-4 py-4">
                          {property.images && property.images.length > 0 ? (
                            <img
                              src={property.images.find(url => url.includes('thumb_')) || property.images[0]}
                              alt={property.title}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                          ) : (
                            <div className="w-16 h-16 bg-luxury-black/50 rounded-lg flex items-center justify-center">
                              <span className="text-platinum-pearl/30 text-xs">No image</span>
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-4 text-sm text-platinum-pearl">
                          <div className="max-w-xs truncate">{property.title}</div>
                          {property.referenceCode && (
                            <div className="text-xs text-platinum-pearl/50 mt-1">
                              {property.referenceCode}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-4 text-sm">
                          <span className="inline-flex items-center rounded-full bg-gold-primary/10 px-2.5 py-0.5 text-xs font-medium text-gold-primary capitalize">
                            {property.type || 'N/A'}
                          </span>
                          {property.intent && (
                            <div className="text-xs text-platinum-pearl/50 mt-1 capitalize">
                              {property.intent}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-4 text-sm text-platinum-pearl/70">
                          {typeof property.location === 'object'
                            ? (
                              <>
                                <div>{property.location.area || property.location.city || ''}</div>
                                <div className="text-xs text-platinum-pearl/50">{property.location.governorate || ''}</div>
                              </>
                            )
                            : property.location || 'N/A'}
                        </td>
                        <td className="px-4 py-4 text-sm font-semibold text-gold-primary">
                          <div>{property.currency || 'BHD'} {property.price?.toLocaleString() || 'N/A'}</div>
                          {property.priceCadence && (
                            <div className="text-xs text-platinum-pearl/50 font-normal">{property.priceCadence}</div>
                          )}
                        </td>
                        <td className="px-4 py-4 text-sm text-platinum-pearl/70">
                          {property.specs?.bedrooms || property.beds || 0}BD / {property.specs?.bathrooms || property.baths || 0}BA
                          {property.specs?.areaSqm && (
                            <div className="text-xs text-platinum-pearl/50">{property.specs.areaSqm} sqm</div>
                          )}
                        </td>
                        <td className="px-4 py-4 text-sm">
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            property.status === 'published'
                              ? 'bg-green-500/10 text-green-500'
                              : 'bg-yellow-500/10 text-yellow-500'
                          }`}>
                            {property.status || 'draft'}
                          </span>
                          {property.featured && (
                            <div className="text-xs text-gold-primary mt-1">★ Featured</div>
                          )}
                        </td>
                        <td className="px-4 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleEditProperty(property.id)}
                              className="rounded-full p-2 text-gold-primary transition hover:bg-gold-primary/10"
                              aria-label="Edit property"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteClick(property)}
                              className="rounded-full p-2 text-red-400 transition hover:bg-red-400/10"
                              aria-label="Delete property"
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
                {properties.length > 0 && (
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

          <div className="grid gap-6 md:grid-cols-3">
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold text-gold-primary mb-2">
                Total Properties
              </h3>
              <p className="text-4xl font-bold text-platinum-pearl">
                {properties.length}
              </p>
            </div>
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold text-gold-primary mb-2">
                Active Listings
              </h3>
              <p className="text-4xl font-bold text-platinum-pearl">
                {properties.length}
              </p>
            </div>
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold text-gold-primary mb-2">
                Total Inquiries
              </h3>
              <p className="text-4xl font-bold text-platinum-pearl">0</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Admin;
