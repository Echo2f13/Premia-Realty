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
} from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth, db } from "../firebase";

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
