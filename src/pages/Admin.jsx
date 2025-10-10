import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { getAllProperties, deleteProperty } from "../data/firebaseService";
import { ShieldCheck, Plus, Trash2, Edit, X } from "lucide-react";

const Admin = () => {
  const navigate = useNavigate();
  const { user, loading, isAuthenticated, isAdmin } = useAuth();
  const [properties, setProperties] = useState([]);
  const [isLoadingProperties, setIsLoadingProperties] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const hasCheckedAuth = useRef(false);

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

  const fetchProperties = async () => {
    try {
      setIsLoadingProperties(true);
      const fetchedProperties = await getAllProperties();
      setProperties(fetchedProperties);
    } catch (error) {
      console.error("Failed to fetch properties:", error);
    } finally {
      setIsLoadingProperties(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchProperties();
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
      await deleteProperty(deleteConfirm.id);

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
    <div className="min-h-screen bg-background text-platinum-pearl">
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
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-background via-luxury-black/70 to-luxury-black/40" />
          <div className="absolute right-0 top-1/3 h-96 w-96 translate-x-1/3 rounded-full bg-gold-primary/20 blur-[160px]" />
        </div>

        <div className="relative container px-4 lg:px-8">
          <div className="flex items-center gap-4 mb-8">
            <ShieldCheck className="h-12 w-12 text-gold-primary" />
            <div>
              <h1 className="text-4xl font-serif font-bold text-platinum-pearl">
                Admin Dashboard
              </h1>
              <p className="text-platinum-pearl/70 mt-2">
                Manage properties and view analytics
              </p>
            </div>
          </div>

          <div className="glass-card p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-serif font-bold text-platinum-pearl">
                Properties
              </h2>
              <button
                onClick={handleAddProperty}
                className="flex items-center gap-2 rounded-full bg-gradient-gold px-6 py-3 text-sm font-semibold uppercase tracking-[0.4em] text-luxury-black shadow-gold transition hover:shadow-luxury"
              >
                <Plus className="h-5 w-5" />
                Add Property
              </button>
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
                        Title
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
                        <td className="px-4 py-4 text-sm text-platinum-pearl">
                          {property.title}
                        </td>
                        <td className="px-4 py-4 text-sm text-platinum-pearl/70">
                          {typeof property.location === 'object'
                            ? `${property.location.area || ''}, ${property.location.governorate || ''}`.trim().replace(/^,\s*|,\s*$/g, '')
                            : property.location || 'N/A'}
                        </td>
                        <td className="px-4 py-4 text-sm font-semibold text-gold-primary">
                          {property.price || 'N/A'}
                        </td>
                        <td className="px-4 py-4 text-sm text-platinum-pearl/70">
                          {property.specs?.bedrooms || property.beds || 0}BD / {property.specs?.bathrooms || property.baths || 0}BA
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
