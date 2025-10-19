import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { getActivePropertiesPaginated, softDeleteProperty } from "../data/firebaseService";
import { ShieldCheck, Plus, Trash2, Edit, X, Archive, Mail } from "lucide-react";
import Pagination from "../components/Pagination";
import ScrollReveal from "../components/ScrollReveal";

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
          <h2 className="text-2xl font-serif font-bold text-platinum-pearl mb-2">
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
    <div className="min-h-screen bg-gradient-diagonal-subtle text-foreground">
      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-luxury-black/80 backdrop-blur-sm">
          <div className="glass-card p-8 max-w-md w-full mx-4">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-xl font-serif font-bold text-platinum-pearl">
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
        <div className="relative container px-4 lg:px-8">
          <ScrollReveal animation="fade-in-up">
            <div className="flex items-center gap-4 mb-12">
              <div className="p-4 bg-accent/10 border border-accent/20">
                <ShieldCheck className="h-12 w-12 text-accent" strokeWidth={1} />
              </div>
              <div>
                <div className="text-accent text-xs tracking-[0.3em] mb-2">ADMIN PANEL</div>
                <h1 className="text-5xl lg:text-6xl">
                  Dashboard
                </h1>
                <p className="text-foreground/60 mt-2 font-light">
                  Manage properties and view analytics
                </p>
              </div>
            </div>
          </ScrollReveal>

          {/* Contacts Section */}
          <ScrollReveal animation="fade-in-up" delay={100}>
            <div className="bg-card border border-border/50 p-8 mb-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="text-accent text-xs tracking-[0.3em] mb-2">COMMUNICATIONS</div>
                  <h2 className="text-3xl">
                    Submitted Contacts
                  </h2>
                  <p className="text-foreground/60 text-sm mt-2 font-light">
                    Manage and view contact form submissions
                  </p>
                </div>
                <button
                  onClick={() => navigate("/admin/contacts")}
                  className="flex items-center gap-2 px-8 py-3 bg-accent text-background text-sm tracking-[0.15em] hover:bg-accent/90 transition-all"
                >
                  <Mail className="h-5 w-5" strokeWidth={1.5} />
                  VIEW CONTACTS
                </button>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal animation="fade-in-up" delay={200}>
            <div className="bg-card border border-border/50 p-8 mb-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="text-accent text-xs tracking-[0.3em] mb-2">PORTFOLIO</div>
                  <h2 className="text-3xl">
                    Properties
                  </h2>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => navigate("/admin/trash")}
                    className="flex items-center gap-2 border border-border/50 px-6 py-3 text-sm tracking-[0.15em] text-foreground/70 hover:border-accent hover:text-accent transition-all"
                  >
                    <Archive className="h-5 w-5" strokeWidth={1.5} />
                    TRASH
                  </button>
                  <button
                    onClick={handleAddProperty}
                    className="flex items-center gap-2 px-8 py-3 bg-accent text-background text-sm tracking-[0.15em] hover:bg-accent/90 transition-all"
                  >
                    <Plus className="h-5 w-5" strokeWidth={1.5} />
                    ADD PROPERTY
                  </button>
                </div>
              </div>

            {isLoadingProperties ? (
              <div className="text-center text-foreground/70 py-12">
                Loading properties...
              </div>
            ) : properties.length === 0 ? (
              <div className="text-center text-foreground/70 py-12">
                No properties found. Add your first property to get started.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border/50">
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-accent">
                        Image
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-accent">
                        Title
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-accent">
                        Type
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-accent">
                        Location
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-accent">
                        Price
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-accent">
                        Beds/Baths
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-accent">
                        Status
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-accent">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30">
                    {properties.map((property) => (
                      <tr
                        key={property.id}
                        className="transition-colors hover:bg-accent/5"
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
                        <td className="px-4 py-4 text-sm text-foreground">
                          <div className="max-w-xs truncate">{property.title}</div>
                          {property.referenceCode && (
                            <div className="text-xs text-foreground/50 mt-1">
                              {property.referenceCode}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-4 text-sm">
                          <span className="inline-flex items-center rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent capitalize">
                            {property.type || 'N/A'}
                          </span>
                          {property.intent && (
                            <div className="text-xs text-foreground/50 mt-1 capitalize">
                              {property.intent}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-4 text-sm text-foreground/70">
                          {typeof property.location === 'object'
                            ? (
                              <>
                                <div>{property.location.area || property.location.city || ''}</div>
                                <div className="text-xs text-foreground/50">{property.location.governorate || ''}</div>
                              </>
                            )
                            : property.location || 'N/A'}
                        </td>
                        <td className="px-4 py-4 text-sm font-semibold text-accent">
                          <div>{property.currency || 'BHD'} {property.price?.toLocaleString() || 'N/A'}</div>
                          {property.priceCadence && (
                            <div className="text-xs text-foreground/50 font-normal">{property.priceCadence}</div>
                          )}
                        </td>
                        <td className="px-4 py-4 text-sm text-foreground/70">
                          {property.specs?.bedrooms || property.beds || 0}BD / {property.specs?.bathrooms || property.baths || 0}BA
                          {property.specs?.areaSqm && (
                            <div className="text-xs text-foreground/50">{property.specs.areaSqm} sqm</div>
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
                            <div className="text-xs text-accent mt-1">★ Featured</div>
                          )}
                        </td>
                        <td className="px-4 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleEditProperty(property.id)}
                              className="p-2 text-accent transition hover:bg-accent/10 border border-transparent hover:border-accent/20"
                              aria-label="Edit property"
                            >
                              <Edit className="h-4 w-4" strokeWidth={1.5} />
                            </button>
                            <button
                              onClick={() => handleDeleteClick(property)}
                              className="p-2 text-red-400 transition hover:bg-red-400/10 border border-transparent hover:border-red-400/20"
                              aria-label="Delete property"
                            >
                              <Trash2 className="h-4 w-4" strokeWidth={1.5} />
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
          </ScrollReveal>

          <ScrollReveal animation="fade-in-up" delay={300}>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="bg-card border border-border/50 p-8 text-center">
                <div className="text-sm tracking-[0.2em] text-foreground/60 mb-3">TOTAL PROPERTIES</div>
                <div className="text-4xl text-accent">{properties.length}</div>
              </div>
              <div className="bg-card border border-border/50 p-8 text-center">
                <div className="text-sm tracking-[0.2em] text-foreground/60 mb-3">ACTIVE LISTINGS</div>
                <div className="text-4xl text-accent">{properties.length}</div>
              </div>
              <div className="bg-card border border-border/50 p-8 text-center">
                <div className="text-sm tracking-[0.2em] text-foreground/60 mb-3">TOTAL INQUIRIES</div>
                <div className="text-4xl text-accent">0</div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
};

export default Admin;
