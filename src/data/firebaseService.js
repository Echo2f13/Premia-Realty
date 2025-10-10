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
} from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
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

    // Extract the storage path from the URL
    const imageRef = ref(storage, imageUrl);
    await deleteObject(imageRef);
  } catch (error) {
    console.error("Error deleting image:", error);
    // Don't throw - continue even if image delete fails
  }
};

/**
 * Create a new property with images
 * @param {Object} propertyData - Property data including images
 * @param {File[]} imageFiles - Array of image files
 * @returns {Promise<string>} The created property ID
 */
export const createProperty = async (propertyData, imageFiles = []) => {
  // Generate a unique ID for the property
  const tempId = createRandomId();

  // Upload images first
  const imageUrls = await uploadPropertyImages(imageFiles, tempId);

  // Create the property document
  const docRef = await addDoc(propertiesCollection, {
    ...propertyData,
    images: imageUrls,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return docRef.id;
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
 * @returns {Promise<void>}
 */
export const updateProperty = async (
  propertyId,
  propertyData,
  newImageFiles = [],
  imagesToDelete = []
) => {
  const docRef = doc(propertiesCollection, propertyId);

  // Delete removed images from storage
  await Promise.all(imagesToDelete.map(deletePropertyImage));

  // Upload new images
  const newImageUrls = await uploadPropertyImages(newImageFiles, propertyId);

  // Get current images and filter out deleted ones
  const currentProperty = await getProperty(propertyId);
  const currentImages = currentProperty?.images || [];
  const remainingImages = currentImages.filter(
    (url) => !imagesToDelete.includes(url)
  );

  // Merge existing and new images
  const updatedImages = [...remainingImages, ...newImageUrls];

  // Update the document
  await updateDoc(docRef, {
    ...propertyData,
    images: updatedImages,
    updatedAt: serverTimestamp(),
  });
};

/**
 * Delete a property and all its images
 * @param {string} propertyId - Property ID
 * @returns {Promise<void>}
 */
export const deleteProperty = async (propertyId) => {
  const docRef = doc(propertiesCollection, propertyId);

  // Get the property to access its images
  const property = await getProperty(propertyId);

  // Delete all images from storage
  if (property?.images && property.images.length > 0) {
    await Promise.all(property.images.map(deletePropertyImage));
  }

  // Delete the Firestore document
  await deleteDoc(docRef);
};
