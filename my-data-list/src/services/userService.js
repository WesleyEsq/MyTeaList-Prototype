import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

export const getUserProfile = async (uid) => {
  if (!uid) return null;
  const userRef = doc(db, "users", uid);
  const docSnap = await getDoc(userRef);
  return docSnap.exists() ? { uid, ...docSnap.data() } : null;
};

export const createUserProfileDocument = async (userAuth, additionalData = {}) => {
  if (!userAuth) return;
  const userRef = doc(db, "users", userAuth.uid);
  const { email, displayName, photoURL } = userAuth;
  const createdAt = serverTimestamp();
  try {
    await setDoc(userRef, {
      displayName: displayName || additionalData.username || 'New User',
      email,
      photoURL: photoURL || '',
      bannerURL: '',
      aboutMe: '',
      createdAt,
      ...additionalData,
    });
  } catch (error) {
    console.error("Error creating user profile document:", error);
  }
};

export const updateUserProfile = async (uid, dataToUpdate) => {
  if (!uid) return;
  const userRef = doc(db, "users", uid);
  await setDoc(userRef, dataToUpdate, { merge: true });
};

