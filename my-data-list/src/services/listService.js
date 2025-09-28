import { collection, doc, addDoc, onSnapshot, query, where, orderBy, updateDoc, arrayUnion, getDoc, deleteDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../firebase";

// --- Funciones del servicio de listas --- //


// Sube una imagen de portada para una lista y devuelve su URL
const uploadListCoverImage = async (file, userId) => {
  if (!file) return null; // Devuelve null si no hay archivo
  const filePath = `list_covers/${userId}/${Date.now()}_${file.name}`;
  const storageRef = ref(storage, filePath);
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
};

// Sube una imagen para una fila y devuelve su URL
const uploadRowImage = async (file, userId, listId) => {
    if (!file) return "";
    const filePath = `row_images/${userId}/${listId}/${Date.now()}_${file.name}`;
    const storageRef = ref(storage, filePath);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
};

// Crea una nueva lista con los datos proporcionados
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

// Obtiene todas las listas de un usuario específico
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

// Obtiene una lista específica por su ID
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

// Añade una nueva fila a una lista existente
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

// Actualiza los detalles de una lista
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

// Elimina una lista y sus datos asociados.
// TODO: Implementar eliminación de imágenes almacenadas!!!
export const deleteList = async (listId) => {
  if (!listId) return;
  const listRef = doc(db, "lists", listId);
  await deleteDoc(listRef);
};

