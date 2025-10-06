import { addDoc, collection, getDocs, serverTimestamp } from "firebase/firestore";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";

const propertiesCollection = collection(db, "properties");
const contactsCollection = collection(db, "contacts");

export const addProperty = async (propertyData) => {
  const docRef = await addDoc(propertiesCollection, {
    ...propertyData,
    createdAt: serverTimestamp(),
  });

  return docRef.id;
};

export const getAllProperties = async () => {
  const snapshot = await getDocs(propertiesCollection);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const addContactForm = async (contactData) => {
  const docRef = await addDoc(contactsCollection, {
    ...contactData,
    createdAt: serverTimestamp(),
  });

  return docRef.id;
};

export const signInAdmin = async (email, password) => {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return credential.user;
};
