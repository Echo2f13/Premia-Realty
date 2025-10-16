import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit as firestoreLimit,
  startAfter,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  listAll,
} from "firebase/storage";
import { db, storage } from "../firebase";

const propertiesCollection = collection(db, "properties");

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Generate URL-friendly slug from title
 * @param {string} title - Property title
 * @returns {string} URL-friendly slug
 */
export const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
};

/**
 * Convert square feet to square meters
 * @param {number} sqft - Area in square feet
 * @returns {number|null} Area in square meters
 */
export const sqftToSqm = (sqft) => (sqft ? Math.round(sqft * 0.092903) : null);

/**
 * Convert square meters to square feet
 * @param {number} sqm - Area in square meters
 * @returns {number|null} Area in square feet
 */
export const sqmToSqft = (sqm) => (sqm ? Math.round(sqm * 10.7639) : null);

// ============================================
// PROPERTY LISTING & FILTERING
// ============================================

/**
 * List properties with advanced filtering, search, sorting, and pagination
 * @param {Object} options - Query options
 * @param {string} options.search - Search term for title, location, or reference code
 * @param {Object} options.filters - Filter criteria
 * @param {string} options.filters.governorate - Filter by governorate
 * @param {string} options.filters.area - Filter by area
 * @param {string} options.filters.city - Filter by city
 * @param {string} options.filters.type - Filter by property type
 * @param {string} options.filters.intent - Filter by intent (rent/sale)
 * @param {string} options.filters.status - Filter by status
 * @param {boolean} options.filters.featured - Filter by featured status
 * @param {boolean} options.filters.priceInclusive - Filter by price inclusive
 * @param {Object} options.sort - Sort configuration
 * @param {string} options.sort.field - Field to sort by (default: 'createdAt')
 * @param {string} options.sort.direction - Sort direction 'asc' or 'desc' (default: 'desc')
 * @param {number} options.limit - Maximum number of results (default: 20)
 * @param {Object} options.cursor - Pagination cursor from previous query
 * @param {boolean} options.includeDeleted - Include soft-deleted properties (default: false)
 * @returns {Promise<Object>} Object containing items array and nextCursor
 */
export const listProperties = async ({
  search = "",
  filters = {},
  sort = { field: "createdAt", direction: "desc" },
  limit = 20,
  cursor = null,
  includeDeleted = false,
}) => {
  try {
    let q = query(propertiesCollection);

    // Filter deleted properties
    if (!includeDeleted) {
      q = query(q, where("deletedAt", "==", null));
    }

    // Apply location filters
    if (filters.governorate) {
      q = query(q, where("location.governorate", "==", filters.governorate));
    }
    if (filters.area) {
      q = query(q, where("location.area", "==", filters.area));
    }
    if (filters.city) {
      q = query(q, where("location.city", "==", filters.city));
    }

    // Apply property type and intent filters
    if (filters.type) {
      q = query(q, where("type", "==", filters.type));
    }
    if (filters.intent) {
      q = query(q, where("intent", "==", filters.intent));
    }

    // Apply status filter
    if (filters.status) {
      q = query(q, where("status", "==", filters.status));
    }

    // Apply boolean filters
    if (filters.featured !== undefined) {
      q = query(q, where("featured", "==", filters.featured));
    }
    if (filters.priceInclusive !== undefined) {
      q = query(q, where("priceInclusive", "==", filters.priceInclusive));
    }

    // Apply sorting
    q = query(q, orderBy(sort.field, sort.direction));

    // Apply pagination
    if (cursor) {
      q = query(q, startAfter(cursor));
    }
    q = query(q, firestoreLimit(limit));

    const snapshot = await getDocs(q);
    const items = snapshot.docs.map((propertyDoc) => ({
      id: propertyDoc.id,
      ...propertyDoc.data(),
    }));

    // Apply client-side search filter
    let filtered = items;
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = items.filter(
        (item) =>
          item.title?.toLowerCase().includes(searchLower) ||
          item.location?.area?.toLowerCase().includes(searchLower) ||
          item.location?.city?.toLowerCase().includes(searchLower) ||
          item.referenceCode?.toLowerCase().includes(searchLower)
      );
    }

    return {
      items: filtered,
      nextCursor:
        snapshot.docs.length > 0
          ? snapshot.docs[snapshot.docs.length - 1]
          : null,
    };
  } catch (error) {
    console.error("Error listing properties:", error);
    throw error;
  }
};

// ============================================
// PROPERTY RETRIEVAL
// ============================================

/**
 * Get a single property by ID
 * @param {string} id - Property ID
 * @returns {Promise<Object|null>} Property data or null if not found
 */
export const getPropertyById = async (id) => {
  try {
    const docRef = doc(propertiesCollection, id);
    const snapshot = await getDoc(docRef);

    if (!snapshot.exists()) {
      return null;
    }

    return { id: snapshot.id, ...snapshot.data() };
  } catch (error) {
    console.error("Error getting property by ID:", error);
    throw error;
  }
};

// ============================================
// PROPERTY CREATION
// ============================================

/**
 * Create a new property
 * @param {Object} data - Property data
 * @param {Object} user - Current user object (optional)
 * @returns {Promise<string>} The created property ID
 */
export const createProperty = async (data, user = null) => {
  try {
    console.log("📝 Creating property:", data.title);

    // Prepare user metadata
    const userMeta = user
      ? {
          uid: user.uid,
          displayName: user.displayName || user.email || "Unknown",
        }
      : null;

    const propertyData = {
      ...data,
      slug: data.slug || generateSlug(data.title),
      currency: data.currency || "BHD",
      deletedAt: null,
      createdBy: userMeta,
      updatedBy: userMeta,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(propertiesCollection, propertyData);

    console.log("✅ Property created with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("❌ Error creating property:", error);
    console.error("Error details:", {
      code: error.code,
      message: error.message,
      propertyTitle: data.title,
    });
    throw new Error(`Failed to create property: ${error.message}`);
  }
};

// ============================================
// PROPERTY UPDATE
// ============================================

/**
 * Update an existing property
 * @param {string} id - Property ID
 * @param {Object} data - Updated property data
 * @param {Object} user - Current user object (optional)
 * @returns {Promise<void>}
 */
export const updateProperty = async (id, data, user = null) => {
  try {
    console.log("📝 Updating property:", id);

    const docRef = doc(propertiesCollection, id);

    // Prepare user metadata
    const userMeta = user
      ? {
          uid: user.uid,
          displayName: user.displayName || user.email || "Unknown",
        }
      : null;

    await updateDoc(docRef, {
      ...data,
      updatedBy: userMeta,
      updatedAt: serverTimestamp(),
    });

    console.log("✅ Property updated successfully");
  } catch (error) {
    console.error("❌ Error updating property:", error);
    console.error("Error details:", {
      code: error.code,
      message: error.message,
      propertyId: id,
    });
    throw new Error(`Failed to update property: ${error.message}`);
  }
};

// ============================================
// IMAGE MANAGEMENT
// ============================================

/**
 * Upload multiple images for a property
 * @param {string} propertyId - Property ID
 * @param {File[]} files - Array of image files
 * @returns {Promise<string[]>} Array of download URLs
 */
export const uploadPropertyImages = async (propertyId, files) => {
  try {
    if (!files || files.length === 0) {
      return [];
    }

    console.log("📷 Uploading", files.length, "images for property:", propertyId);

    const uploadPromises = files.map(async (file, index) => {
      const timestamp = Date.now();
      const fileName = `properties/${propertyId}/${timestamp}_${index}_${file.name}`;
      const storageRef = ref(storage, fileName);

      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      return downloadURL;
    });

    const urls = await Promise.all(uploadPromises);

    console.log("✅ Images uploaded:", urls.length);
    return urls;
  } catch (error) {
    console.error("❌ Error uploading property images:", error);
    throw error;
  }
};

/**
 * Reorder property images
 * @param {string} propertyId - Property ID
 * @param {string[]} orderedUrls - Array of image URLs in desired order
 * @returns {Promise<void>}
 */
export const reorderImages = async (propertyId, orderedUrls) => {
  try {
    console.log("🔄 Reordering images for property:", propertyId);

    const docRef = doc(propertiesCollection, propertyId);
    await updateDoc(docRef, {
      images: orderedUrls,
      updatedAt: serverTimestamp(),
    });

    console.log("✅ Images reordered successfully");
  } catch (error) {
    console.error("❌ Error reordering images:", error);
    throw error;
  }
};

// ============================================
// PROPERTY DELETION
// ============================================

/**
 * Soft delete a property (sets deletedAt timestamp)
 * @param {string} id - Property ID
 * @param {Object} user - Current user object (optional)
 * @returns {Promise<void>}
 */
export const softDeleteProperty = async (id, user = null) => {
  try {
    console.log("🗑️ Soft deleting property:", id);

    const docRef = doc(propertiesCollection, id);

    // Prepare user metadata
    const userMeta = user
      ? {
          uid: user.uid,
          displayName: user.displayName || user.email || "Unknown",
        }
      : null;

    await updateDoc(docRef, {
      deletedAt: serverTimestamp(),
      deletedBy: userMeta,
      updatedAt: serverTimestamp(),
    });

    console.log("✅ Property soft deleted successfully");
  } catch (error) {
    console.error("❌ Error soft deleting property:", error);
    throw error;
  }
};

/**
 * Restore a soft-deleted property
 * @param {string} id - Property ID
 * @returns {Promise<void>}
 */
export const restoreProperty = async (id) => {
  try {
    console.log("♻️ Restoring property:", id);

    const docRef = doc(propertiesCollection, id);

    await updateDoc(docRef, {
      deletedAt: null,
      deletedBy: null,
      updatedAt: serverTimestamp(),
    });

    console.log("✅ Property restored successfully");
  } catch (error) {
    console.error("❌ Error restoring property:", error);
    throw error;
  }
};

/**
 * Hard delete a property and all its storage files (permanent deletion)
 * @param {string} id - Property ID
 * @returns {Promise<void>}
 */
export const hardDeleteProperty = async (id) => {
  try {
    console.log("🗑️ Hard deleting property:", id);

    // Delete all files in the property's storage folder
    const folderRef = ref(storage, `properties/${id}/`);

    try {
      const listResult = await listAll(folderRef);

      if (listResult.items.length > 0) {
        console.log(
          "🗑️ Deleting",
          listResult.items.length,
          "files from storage..."
        );
        const deletePromises = listResult.items.map((itemRef) =>
          deleteObject(itemRef)
        );
        await Promise.all(deletePromises);
        console.log("✅ All storage files deleted");
      }
    } catch (error) {
      console.error("Error deleting storage folder:", error);
      // Continue even if storage deletion fails
    }

    // Delete the Firestore document
    const docRef = doc(propertiesCollection, id);
    await deleteDoc(docRef);

    console.log("✅ Property hard deleted successfully");
  } catch (error) {
    console.error("❌ Error hard deleting property:", error);
    console.error("Error details:", {
      code: error.code,
      message: error.message,
      propertyId: id,
    });
    throw new Error(`Failed to permanently delete property: ${error.message}`);
  }
};
