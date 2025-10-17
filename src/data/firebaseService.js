import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  serverTimestamp,
  setDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  endBefore,
  limitToLast,
} from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { auth, db, storage } from "../firebase";

const propertiesCollection = collection(db, "properties");
const contactsCollection = collection(db, "contacts");
const userDocRef = (uid) => doc(db, "users", uid);
const userSavedCollection = (uid) => collection(db, "users", uid, "savedProperties");
const userContactsCollection = (uid) => collection(db, "users", uid, "contactRequests");

const sanitizePhone = (value) => value.replace(/[^\d+]/g, "");
const phoneToEmail = (value) => {
  const cleaned = sanitizePhone(value);
  if (!cleaned) {
    throw new Error("Phone number is required");
  }
  return `phone_${cleaned}@premia-users.local`;
};

const createRandomId = () => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2, 10);
};

const resolvePropertyId = (property) => {
  if (property?.id) return String(property.id);
  if (property?.slug) return property.slug;
  if (property?.title) {
    return property.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }
  return createRandomId();
};

export const addProperty = async (propertyData) => {
  const docRef = await addDoc(propertiesCollection, {
    ...propertyData,
    createdAt: serverTimestamp(),
  });

  return docRef.id;
};

export const getAllProperties = async () => {
  const snapshot = await getDocs(propertiesCollection);
  return snapshot.docs.map((propertyDoc) => ({ id: propertyDoc.id, ...propertyDoc.data() }));
};

export const addContactForm = async (contactData, options = {}) => {
  const docRef = await addDoc(contactsCollection, {
    ...contactData,
    createdAt: serverTimestamp(),
  });

  if (options.userId) {
    await addDoc(userContactsCollection(options.userId), {
      contactId: docRef.id,
      message: contactData.message ?? "",
      propertyId: options.propertyId ?? null,
      propertyTitle: options.propertyTitle ?? null,
      createdAt: serverTimestamp(),
    });
  }

  return docRef.id;
};

export const signInAdmin = async (email, password) => {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return credential.user;
};

export const signUpCustomer = async ({
  fullName,
  password,
  contactValue,
  contactType = "email",
}) => {
  const value = contactValue.trim();
  const isEmail = contactType === "email" || value.includes("@");
  const email = isEmail ? value.toLowerCase() : phoneToEmail(value);

  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  if (fullName) {
    await updateProfile(user, { displayName: fullName });
  }

  await setDoc(
    userDocRef(user.uid),
    {
      fullName: fullName || user.displayName || "",
      email: isEmail ? value.toLowerCase() : null,
      phone: isEmail ? null : value,
      contactType: isEmail ? "email" : "phone",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );

  return user;
};

export const signInCustomer = async ({ contactValue, password }) => {
  const value = contactValue.trim();
  const email = value.includes("@") ? value.toLowerCase() : phoneToEmail(value);
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return credential.user;
};

export const signOutCustomer = () => signOut(auth);

export const getUserProfile = async (uid) => {
  const snapshot = await getDoc(userDocRef(uid));
  if (!snapshot.exists()) return null;
  return { id: snapshot.id, ...snapshot.data() };
};

export const subscribeToUserProfile = (uid, callback) =>
  onSnapshot(userDocRef(uid), (snapshot) => {
    callback(snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null);
  });

export const updateUserProfile = async (uid, data) => {
  await setDoc(
    userDocRef(uid),
    {
      ...data,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
};

/**
 * Change user password (requires current password for reauthentication)
 * @param {Object} user - Current Firebase user
 * @param {string} currentPassword - Current password for reauthentication
 * @param {string} newPassword - New password
 * @returns {Promise<void>}
 */
export const changeUserPassword = async (user, currentPassword, newPassword) => {
  try {
    // Get the user's email (or phone-based email)
    const email = user.email;

    // Create credential with current password
    const credential = EmailAuthProvider.credential(email, currentPassword);

    // Reauthenticate user
    await reauthenticateWithCredential(user, credential);

    // Update to new password
    await updatePassword(user, newPassword);

    console.log("✅ Password changed successfully");
  } catch (error) {
    console.error("❌ Error changing password:", error);

    // Provide user-friendly error messages
    if (error.code === "auth/wrong-password") {
      throw new Error("Current password is incorrect");
    } else if (error.code === "auth/weak-password") {
      throw new Error("New password is too weak (minimum 6 characters)");
    } else if (error.code === "auth/requires-recent-login") {
      throw new Error("For security, please log out and log back in before changing your password");
    } else {
      throw new Error(`Failed to change password: ${error.message}`);
    }
  }
};

export const subscribeToSavedProperties = (uid, callback) => {
  const collectionRef = userSavedCollection(uid);
  return onSnapshot(collectionRef, (snapshot) => {
    const items = snapshot.docs.map((savedDoc) => ({ id: savedDoc.id, ...savedDoc.data() }));
    callback(items);
  });
};

export const savePropertyForUser = async (uid, property) => {
  const propertyId = resolvePropertyId(property);
  const docRef = doc(userSavedCollection(uid), propertyId);
  await setDoc(docRef, {
    propertyId,
    title: property.title ?? "",
    location: property.location ?? "",
    price: property.price ?? "",
    beds: property.beds ?? null,
    baths: property.baths ?? null,
    area: property.area ?? "",
    image: property.image ?? property.image_url ?? "",
    sourceId: property.id ?? null,
    savedAt: serverTimestamp(),
  });
  return propertyId;
};

export const removeSavedProperty = (uid, propertyId) => {
  const docRef = doc(userSavedCollection(uid), propertyId);
  return deleteDoc(docRef);
};

export const subscribeToContactRequests = (uid, callback) => {
  const collectionRef = userContactsCollection(uid);
  return onSnapshot(collectionRef, (snapshot) => {
    const items = snapshot.docs.map((contactDoc) => ({ id: contactDoc.id, ...contactDoc.data() }));
    callback(items);
  });
};

// ============================================
// ADMIN PROPERTY CRUD OPERATIONS
// ============================================

/**
 * Upload multiple images to Firebase Storage
 * @param {File[]} files - Array of image files
 * @param {string} propertyId - Property ID for organizing images
 * @returns {Promise<string[]>} Array of download URLs
 */
export const uploadPropertyImages = async (files, propertyId) => {
  if (!files || files.length === 0) return [];

  const uploadPromises = files.map(async (file, index) => {
    const timestamp = Date.now();
    const fileName = `properties/${propertyId}/${timestamp}_${index}_${file.name}`;
    const storageRef = ref(storage, fileName);

    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);

    return downloadURL;
  });

  return Promise.all(uploadPromises);
};

/**
 * Delete an image from Firebase Storage
 * @param {string} imageUrl - The download URL of the image
 */
export const deletePropertyImage = async (imageUrl) => {
  try {
    if (!imageUrl) return;

    // Extract the storage path from the Firebase Storage URL
    // URL format: https://firebasestorage.googleapis.com/v0/b/{bucket}/o/{path}?alt=media&token={token}
    const urlObj = new URL(imageUrl);
    const pathMatch = urlObj.pathname.match(/\/o\/(.+?)(\?|$)/);

    if (!pathMatch) {
      console.error("Could not extract path from URL:", imageUrl);
      return;
    }

    // Decode the path (it's URL-encoded in the Firebase URL)
    const filePath = decodeURIComponent(pathMatch[1]);

    // Create storage reference using the extracted path
    const imageRef = ref(storage, filePath);
    await deleteObject(imageRef);

    console.log("✅ Successfully deleted image:", filePath);
  } catch (error) {
    console.error("Error deleting image:", error);
    console.error("Image URL:", imageUrl);
    // Don't throw - continue even if image delete fails
  }
};

/**
 * Create a new property with images
 * @param {Object} propertyData - Property data including images
 * @param {File[]} imageFiles - Array of image files
 * @param {Object} user - Current user object
 * @returns {Promise<string>} The created property ID
 */
export const createProperty = async (propertyData, imageFiles = [], user = null) => {
  try {
    console.log("📝 Creating property:", propertyData.title);
    console.log("📷 Uploading", imageFiles.length, "images...");

    // Generate a unique ID for the property
    const tempId = createRandomId();

    // Upload images first
    const imageUrls = await uploadPropertyImages(imageFiles, tempId);
    console.log("✅ Images uploaded:", imageUrls.length);

    // Prepare user metadata
    const userMeta = user ? {
      uid: user.uid,
      displayName: user.displayName || user.email || 'Unknown',
    } : null;

    // Create the property document
    const docRef = await addDoc(propertiesCollection, {
      ...propertyData,
      images: imageUrls,
      status: propertyData.status || "draft",
      deletedAt: null,
      createdBy: userMeta,
      updatedBy: userMeta,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    console.log("✅ Property created with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("❌ Error creating property:", error);
    console.error("Error details:", {
      code: error.code,
      message: error.message,
      propertyTitle: propertyData.title,
      imageCount: imageFiles.length,
    });
    throw new Error(`Failed to create property: ${error.message}`);
  }
};

/**
 * Get a single property by ID
 * @param {string} propertyId - Property ID
 * @returns {Promise<Object|null>} Property data or null
 */
export const getProperty = async (propertyId) => {
  const docRef = doc(propertiesCollection, propertyId);
  const snapshot = await getDoc(docRef);

  if (!snapshot.exists()) return null;

  return { id: snapshot.id, ...snapshot.data() };
};

/**
 * Update an existing property
 * @param {string} propertyId - Property ID
 * @param {Object} propertyData - Updated property data
 * @param {File[]} newImageFiles - New images to add
 * @param {string[]} imagesToDelete - URLs of images to delete
 * @param {Object} user - Current user object
 * @returns {Promise<void>}
 */
export const updateProperty = async (
  propertyId,
  propertyData,
  newImageFiles = [],
  imagesToDelete = [],
  user = null
) => {
  try {
    console.log("📝 Updating property:", propertyId);
    console.log("🗑️ Deleting", imagesToDelete.length, "images...");
    console.log("📷 Uploading", newImageFiles.length, "new images...");

    const docRef = doc(propertiesCollection, propertyId);

    // Delete removed images from storage
    if (imagesToDelete.length > 0) {
      await Promise.all(imagesToDelete.map(deletePropertyImage));
      console.log("✅ Deleted images from storage");
    }

    // Upload new images
    const newImageUrls = await uploadPropertyImages(newImageFiles, propertyId);
    if (newImageUrls.length > 0) {
      console.log("✅ New images uploaded:", newImageUrls.length);
    }

    // Get current images and filter out deleted ones
    const currentProperty = await getProperty(propertyId);
    const currentImages = currentProperty?.images || [];
    const remainingImages = currentImages.filter(
      (url) => !imagesToDelete.includes(url)
    );

    // Merge existing and new images
    const updatedImages = [...remainingImages, ...newImageUrls];

    // Prepare user metadata
    const userMeta = user ? {
      uid: user.uid,
      displayName: user.displayName || user.email || 'Unknown',
    } : null;

    // Update the document
    await updateDoc(docRef, {
      ...propertyData,
      images: updatedImages,
      updatedBy: userMeta,
      updatedAt: serverTimestamp(),
    });

    console.log("✅ Property updated successfully");
  } catch (error) {
    console.error("❌ Error updating property:", error);
    console.error("Error details:", {
      code: error.code,
      message: error.message,
      propertyId,
      newImagesCount: newImageFiles.length,
      imagesToDeleteCount: imagesToDelete.length,
    });
    throw new Error(`Failed to update property: ${error.message}`);
  }
};

/**
 * Soft delete a property (sets deletedAt timestamp)
 * @param {string} propertyId - Property ID
 * @param {Object} user - Current user object
 * @returns {Promise<void>}
 */
export const softDeleteProperty = async (propertyId, user = null) => {
  const docRef = doc(propertiesCollection, propertyId);

  // Prepare user metadata
  const userMeta = user ? {
    uid: user.uid,
    displayName: user.displayName || user.email || 'Unknown',
  } : null;

  await updateDoc(docRef, {
    deletedAt: serverTimestamp(),
    deletedBy: userMeta,
    updatedAt: serverTimestamp(),
  });
};

/**
 * Restore a soft-deleted property
 * @param {string} propertyId - Property ID
 * @returns {Promise<void>}
 */
export const restoreProperty = async (propertyId) => {
  const docRef = doc(propertiesCollection, propertyId);

  await updateDoc(docRef, {
    deletedAt: null,
    deletedBy: null,
    updatedAt: serverTimestamp(),
  });
};

/**
 * Hard delete a property and all its images (permanent)
 * @param {string} propertyId - Property ID
 * @returns {Promise<void>}
 */
export const hardDeleteProperty = async (propertyId) => {
  try {
    console.log("🗑️ Hard deleting property:", propertyId);

    const docRef = doc(propertiesCollection, propertyId);

    // Get the property to access its images
    const property = await getProperty(propertyId);

    if (!property) {
      throw new Error("Property not found");
    }

    // Delete all images from storage
    if (property?.images && property.images.length > 0) {
      console.log("🗑️ Deleting", property.images.length, "images from storage...");
      await Promise.all(property.images.map(deletePropertyImage));
      console.log("✅ All images deleted");
    }

    // Delete the Firestore document
    await deleteDoc(docRef);
    console.log("✅ Property document deleted");
  } catch (error) {
    console.error("❌ Error hard deleting property:", error);
    console.error("Error details:", {
      code: error.code,
      message: error.message,
      propertyId,
    });
    throw new Error(`Failed to permanently delete property: ${error.message}`);
  }
};

/**
 * Get all active properties (not soft-deleted)
 * @returns {Promise<Array>} Array of active properties
 */
export const getActiveProperties = async () => {
  const snapshot = await getDocs(propertiesCollection);
  return snapshot.docs
    .map((propertyDoc) => ({ id: propertyDoc.id, ...propertyDoc.data() }))
    .filter((property) => !property.deletedAt);
};

/**
 * Get all soft-deleted properties
 * @returns {Promise<Array>} Array of deleted properties
 */
export const getDeletedProperties = async () => {
  const snapshot = await getDocs(propertiesCollection);
  return snapshot.docs
    .map((propertyDoc) => ({ id: propertyDoc.id, ...propertyDoc.data() }))
    .filter((property) => property.deletedAt);
};

/**
 * Get paginated active properties with cursor-based pagination
 * @param {number} pageSize - Number of items per page (default: 10)
 * @param {Object} lastDoc - Last document from previous page (for next page)
 * @param {Object} firstDoc - First document from current page (for previous page)
 * @param {string} direction - 'next' or 'prev'
 * @returns {Promise<{properties: Array, hasMore: boolean, hasPrev: boolean, firstDoc: Object, lastDoc: Object}>}
 */
export const getActivePropertiesPaginated = async (
  pageSize = 10,
  lastDoc = null,
  firstDoc = null,
  direction = 'next'
) => {
  try {
    let q;

    if (direction === 'next' && lastDoc) {
      // Get next page
      q = query(
        propertiesCollection,
        orderBy('createdAt', 'desc'),
        startAfter(lastDoc),
        limit(pageSize + 1) // +1 to check if there's more
      );
    } else if (direction === 'prev' && firstDoc) {
      // Get previous page
      q = query(
        propertiesCollection,
        orderBy('createdAt', 'desc'),
        endBefore(firstDoc),
        limitToLast(pageSize + 1) // +1 to check if there's more
      );
    } else {
      // Get first page
      q = query(
        propertiesCollection,
        orderBy('createdAt', 'desc'),
        limit(pageSize + 1)
      );
    }

    const snapshot = await getDocs(q);
    const allDocs = snapshot.docs;

    // Filter out soft-deleted properties
    const activeDocs = allDocs.filter(doc => !doc.data().deletedAt);

    // Check if there are more results
    const hasMore = activeDocs.length > pageSize;
    const hasPrev = direction === 'prev' ? activeDocs.length > pageSize : !!lastDoc;

    // Get the actual page (without the extra item)
    const pageDocs = hasMore ? activeDocs.slice(0, pageSize) : activeDocs;

    const properties = pageDocs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return {
      properties,
      hasMore: direction === 'next' ? hasMore : !!lastDoc,
      hasPrev: direction === 'prev' ? !!firstDoc : (lastDoc !== null),
      firstDoc: pageDocs.length > 0 ? pageDocs[0] : null,
      lastDoc: pageDocs.length > 0 ? pageDocs[pageDocs.length - 1] : null,
    };
  } catch (error) {
    console.error('Error fetching paginated active properties:', error);
    throw error;
  }
};

/**
 * Get paginated deleted properties with cursor-based pagination
 * @param {number} pageSize - Number of items per page (default: 10)
 * @param {Object} lastDoc - Last document from previous page (for next page)
 * @param {Object} firstDoc - First document from current page (for previous page)
 * @param {string} direction - 'next' or 'prev'
 * @returns {Promise<{properties: Array, hasMore: boolean, hasPrev: boolean, firstDoc: Object, lastDoc: Object}>}
 */
export const getDeletedPropertiesPaginated = async (
  pageSize = 10,
  lastDoc = null,
  firstDoc = null,
  direction = 'next'
) => {
  try {
    let q;

    if (direction === 'next' && lastDoc) {
      // Get next page
      q = query(
        propertiesCollection,
        orderBy('deletedAt', 'desc'),
        startAfter(lastDoc),
        limit(pageSize + 1)
      );
    } else if (direction === 'prev' && firstDoc) {
      // Get previous page
      q = query(
        propertiesCollection,
        orderBy('deletedAt', 'desc'),
        endBefore(firstDoc),
        limitToLast(pageSize + 1)
      );
    } else {
      // Get first page
      q = query(
        propertiesCollection,
        orderBy('deletedAt', 'desc'),
        limit(pageSize + 1)
      );
    }

    const snapshot = await getDocs(q);
    const allDocs = snapshot.docs;

    // Filter for only deleted properties
    const deletedDocs = allDocs.filter(doc => doc.data().deletedAt);

    // Check if there are more results
    const hasMore = deletedDocs.length > pageSize;
    const hasPrev = direction === 'prev' ? deletedDocs.length > pageSize : !!lastDoc;

    // Get the actual page
    const pageDocs = hasMore ? deletedDocs.slice(0, pageSize) : deletedDocs;

    const properties = pageDocs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return {
      properties,
      hasMore: direction === 'next' ? hasMore : !!lastDoc,
      hasPrev: direction === 'prev' ? !!firstDoc : (lastDoc !== null),
      firstDoc: pageDocs.length > 0 ? pageDocs[0] : null,
      lastDoc: pageDocs.length > 0 ? pageDocs[pageDocs.length - 1] : null,
    };
  } catch (error) {
    console.error('Error fetching paginated deleted properties:', error);
    throw error;
  }
};

// Keep old deleteProperty for backward compatibility (now uses soft delete)
export const deleteProperty = softDeleteProperty;

// ============================================
// ADMIN CONTACT OPERATIONS
// ============================================

/**
 * Get paginated active contacts (not soft-deleted) with cursor-based pagination
 * @param {number} pageSize - Number of items per page (default: 10)
 * @param {Object} lastDoc - Last document from previous page (for next page)
 * @param {Object} firstDoc - First document from current page (for previous page)
 * @param {string} direction - 'next' or 'prev'
 * @returns {Promise<{contacts: Array, hasMore: boolean, hasPrev: boolean, firstDoc: Object, lastDoc: Object}>}
 */
export const getActiveContactsPaginated = async (
  pageSize = 10,
  lastDoc = null,
  firstDoc = null,
  direction = 'next'
) => {
  try {
    let q;

    if (direction === 'next' && lastDoc) {
      // Get next page
      q = query(
        contactsCollection,
        orderBy('createdAt', 'desc'),
        startAfter(lastDoc),
        limit(pageSize + 1) // +1 to check if there's more
      );
    } else if (direction === 'prev' && firstDoc) {
      // Get previous page
      q = query(
        contactsCollection,
        orderBy('createdAt', 'desc'),
        endBefore(firstDoc),
        limitToLast(pageSize + 1) // +1 to check if there's more
      );
    } else {
      // Get first page
      q = query(
        contactsCollection,
        orderBy('createdAt', 'desc'),
        limit(pageSize + 1)
      );
    }

    const snapshot = await getDocs(q);
    const allDocs = snapshot.docs;

    // Filter out soft-deleted contacts
    const activeDocs = allDocs.filter(doc => !doc.data().deletedAt);

    // Check if there are more results
    const hasMore = activeDocs.length > pageSize;

    // Get the actual page (without the extra item)
    const pageDocs = hasMore ? activeDocs.slice(0, pageSize) : activeDocs;

    const contacts = pageDocs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return {
      contacts,
      hasMore: direction === 'next' ? hasMore : !!lastDoc,
      hasPrev: direction === 'prev' ? !!firstDoc : (lastDoc !== null),
      firstDoc: pageDocs.length > 0 ? pageDocs[0] : null,
      lastDoc: pageDocs.length > 0 ? pageDocs[pageDocs.length - 1] : null,
    };
  } catch (error) {
    console.error('Error fetching paginated active contacts:', error);
    throw error;
  }
};

/**
 * Get paginated deleted contacts with cursor-based pagination
 * @param {number} pageSize - Number of items per page (default: 10)
 * @param {Object} lastDoc - Last document from previous page (for next page)
 * @param {Object} firstDoc - First document from current page (for previous page)
 * @param {string} direction - 'next' or 'prev'
 * @returns {Promise<{contacts: Array, hasMore: boolean, hasPrev: boolean, firstDoc: Object, lastDoc: Object}>}
 */
export const getDeletedContactsPaginated = async (
  pageSize = 10,
  lastDoc = null,
  firstDoc = null,
  direction = 'next'
) => {
  try {
    let q;

    if (direction === 'next' && lastDoc) {
      // Get next page
      q = query(
        contactsCollection,
        orderBy('deletedAt', 'desc'),
        startAfter(lastDoc),
        limit(pageSize + 1)
      );
    } else if (direction === 'prev' && firstDoc) {
      // Get previous page
      q = query(
        contactsCollection,
        orderBy('deletedAt', 'desc'),
        endBefore(firstDoc),
        limitToLast(pageSize + 1)
      );
    } else {
      // Get first page
      q = query(
        contactsCollection,
        orderBy('deletedAt', 'desc'),
        limit(pageSize + 1)
      );
    }

    const snapshot = await getDocs(q);
    const allDocs = snapshot.docs;

    // Filter for only deleted contacts
    const deletedDocs = allDocs.filter(doc => doc.data().deletedAt);

    // Check if there are more results
    const hasMore = deletedDocs.length > pageSize;

    // Get the actual page
    const pageDocs = hasMore ? deletedDocs.slice(0, pageSize) : deletedDocs;

    const contacts = pageDocs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return {
      contacts,
      hasMore: direction === 'next' ? hasMore : !!lastDoc,
      hasPrev: direction === 'prev' ? !!firstDoc : (lastDoc !== null),
      firstDoc: pageDocs.length > 0 ? pageDocs[0] : null,
      lastDoc: pageDocs.length > 0 ? pageDocs[pageDocs.length - 1] : null,
    };
  } catch (error) {
    console.error('Error fetching paginated deleted contacts:', error);
    throw error;
  }
};

/**
 * Soft delete a contact (sets deletedAt timestamp)
 * @param {string} contactId - Contact ID
 * @param {Object} user - Current user object
 * @returns {Promise<void>}
 */
export const softDeleteContact = async (contactId, user = null) => {
  try {
    console.log("🗑️ Soft deleting contact:", contactId);
    const docRef = doc(contactsCollection, contactId);

    // Prepare user metadata
    const userMeta = user ? {
      uid: user.uid,
      displayName: user.displayName || user.email || 'Unknown',
    } : null;

    await updateDoc(docRef, {
      deletedAt: serverTimestamp(),
      deletedBy: userMeta,
      updatedAt: serverTimestamp(),
    });

    console.log("✅ Contact soft deleted successfully");
  } catch (error) {
    console.error("❌ Error soft deleting contact:", error);
    throw new Error(`Failed to soft delete contact: ${error.message}`);
  }
};

/**
 * Restore a soft-deleted contact
 * @param {string} contactId - Contact ID
 * @returns {Promise<void>}
 */
export const restoreContact = async (contactId) => {
  try {
    console.log("♻️ Restoring contact:", contactId);
    const docRef = doc(contactsCollection, contactId);

    await updateDoc(docRef, {
      deletedAt: null,
      deletedBy: null,
      updatedAt: serverTimestamp(),
    });

    console.log("✅ Contact restored successfully");
  } catch (error) {
    console.error("❌ Error restoring contact:", error);
    throw new Error(`Failed to restore contact: ${error.message}`);
  }
};

/**
 * Hard delete a contact permanently
 * @param {string} contactId - Contact ID
 * @returns {Promise<void>}
 */
export const hardDeleteContact = async (contactId) => {
  try {
    console.log("🗑️ Hard deleting contact:", contactId);
    const docRef = doc(contactsCollection, contactId);
    await deleteDoc(docRef);
    console.log("✅ Contact permanently deleted");
  } catch (error) {
    console.error("❌ Error hard deleting contact:", error);
    throw new Error(`Failed to permanently delete contact: ${error.message}`);
  }
};

/**
 * Get all contacts for export
 * @param {boolean} includeDeleted - Whether to include soft-deleted contacts
 * @returns {Promise<Array>} Array of all contacts
 */
export const getAllContactsForExport = async (includeDeleted = false) => {
  try {
    const snapshot = await getDocs(contactsCollection);
    const contacts = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    if (includeDeleted) {
      return contacts;
    }

    // Filter out soft-deleted contacts
    return contacts.filter(contact => !contact.deletedAt);
  } catch (error) {
    console.error('Error fetching contacts for export:', error);
    throw error;
  }
};

// Keep old deleteContact for backward compatibility (now uses soft delete)
export const deleteContact = softDeleteContact;
