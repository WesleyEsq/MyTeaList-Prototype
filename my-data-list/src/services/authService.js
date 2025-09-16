import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, storage } from "../firebase";
import { createUserProfileDocument, updateUserProfile as updateUserProfileInDb } from "./userService";


export const signUp = async (email, password, username) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  await updateProfile(user, { displayName: username });
  await createUserProfileDocument(user, { username });
  return userCredential;
};

export const signIn = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const logOut = () => {
  return signOut(auth);
};

const uploadImage = async (file, path) => {
  if (!file) return null;
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
};

export const updateUserProfile = async (user, updates) => {
  const { displayName, aboutMe, imageFile, bannerFile } = updates;
  const dataForAuth = {};
  const dataForFirestore = {};

  if (displayName && displayName !== user.displayName) {
    dataForAuth.displayName = displayName;
    dataForFirestore.displayName = displayName;
  }

  if (imageFile) {
    const photoURL = await uploadImage(imageFile, `profileImages/${user.uid}`);
    if (photoURL) {
      dataForAuth.photoURL = photoURL;
      dataForFirestore.photoURL = photoURL;
    }
  }
  
  if (bannerFile) {
    const bannerURL = await uploadImage(bannerFile, `bannerImages/${user.uid}`);
    if (bannerURL) dataForFirestore.bannerURL = bannerURL;
  }
  
  if (aboutMe !== undefined && aboutMe !== user.aboutMe) {
    dataForFirestore.aboutMe = aboutMe;
  }

  if (Object.keys(dataForAuth).length > 0) {
    await updateProfile(auth.currentUser, dataForAuth);
  }

  if (Object.keys(dataForFirestore).length > 0) {
    await updateUserProfileInDb(user.uid, dataForFirestore);
  }

  return { ...user, ...dataForFirestore, ...dataForAuth };
};

