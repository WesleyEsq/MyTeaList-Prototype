import { collection, doc, addDoc, onSnapshot, query, where, orderBy, updateDoc, arrayUnion, getDoc, deleteDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../firebase";

const uploadListCoverImage = async (file, userId) => {
  if (!file) return null; // Devuelve null si no hay archivo
  const filePath = `list_covers/${userId}/${Date.now()}_${file.name}`;
  const storageRef = ref(storage, filePath);
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
};

const uploadRowImage = async (file, userId, listId) => {
    if (!file) return "";
    const filePath = `row_images/${userId}/${listId}/${Date.now()}_${file.name}`;
    const storageRef = ref(storage, filePath);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
};

export const createList = async (listData, userId) => {
  const coverImageURL = await uploadListCoverImage(listData.coverFile, userId) || "";
  await addDoc(collection(db, "lists"), {
    authorId: userId,
    title: listData.title,
    description: listData.description,
    coverImageURL,
    rows: [],
    createdAt: new Date(),
  });
};

export const getUserLists = (userId, callback) => {
  if (!userId) return () => {};
  const q = query(
    collection(db, "lists"),
    where("authorId", "==", userId),
    orderBy("createdAt", "desc")
  );
  return onSnapshot(q, (querySnapshot) => {
    const lists = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(lists);
  });
};

export const getListById = (listId, callback) => {
  const listRef = doc(db, "lists", listId);
  return onSnapshot(listRef, (docSnap) => {
    if (docSnap.exists()) {
      callback({ id: docSnap.id, ...docSnap.data() });
    } else {
      console.error("No such list document!");
      callback(null);
    }
  });
};

export const addRowToList = async (listId, rowData, userId) => {
  const imageURL = await uploadRowImage(rowData.rowFile, userId, listId);
  const listRef = doc(db, "lists", listId);
  const newRow = {
    id: Date.now(), 
    name: rowData.name,
    description: rowData.description,
    extraField: rowData.extraField,
    bigDescription: rowData.bigDescription || "",
    imageURL: imageURL,
  };
  await updateDoc(listRef, {
    rows: arrayUnion(newRow)
  });
  return newRow;
};

// NUEVA FUNCIÓN: Actualiza los detalles de una lista
export const updateListDetails = async (listId, updates) => {
  const { title, description, newCoverFile } = updates;
  const listRef = doc(db, "lists", listId);
  const dataToUpdate = { title, description };
  if (newCoverFile) {
    const listDoc = (await getDoc(listRef)).data();
    const coverImageURL = await uploadListCoverImage(newCoverFile, listDoc.authorId);
    if (coverImageURL) {
      dataToUpdate.coverImageURL = coverImageURL;
    }
  }
  await updateDoc(listRef, dataToUpdate);
};

// NUEVA FUNCIÓN: Elimina una lista y sus datos asociados.
export const deleteList = async (listId) => {
  if (!listId) return;
  const listRef = doc(db, "lists", listId);
  await deleteDoc(listRef);
  // NOTA: La eliminación de imágenes en Storage es más compleja (requiere Cloud Functions para hacerlo de forma robusta)
  // Por ahora, solo eliminamos el documento de Firestore.
};

