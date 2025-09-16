import { doc, updateDoc, getDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../firebase";

/**
 * Sube la imagen para una fila de una lista a Firebase Storage.
 * @param {File} file - El archivo de imagen.
 * @param {string} userId - El ID del usuario.
 * @param {string} listId - El ID de la lista.
 * @returns {Promise<string|null>} - La URL de la imagen o null.
 */
const uploadRowImage = async (file, userId, listId) => {
  if (!file) return null;
  const filePath = `row_images/${userId}/${listId}/${Date.now()}_${file.name}`;
  const storageRef = ref(storage, filePath);
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
};

/**
 * Sobrescribe el array 'rows' completo en una lista con un nuevo array reordenado.
 * @param {string} listId - El ID de la lista.
 * @param {Array<object>} newRowsArray - El array completo de filas en su nuevo orden.
 */
export const updateRowOrder = async (listId, newRowsArray) => {
  const listRef = doc(db, "lists", listId);
  await updateDoc(listRef, { rows: newRowsArray });
};

/**
 * Actualiza una fila específica dentro del array 'rows' de una lista.
 * @param {string} listId - El ID de la lista que contiene la fila.
 * @param {string} userId - El ID del usuario actual (para la ruta de la imagen).
 * @param {object} updatedRowData - El objeto completo de la fila con los datos actualizados.
 * @param {File|null} newRowFile - El nuevo archivo de imagen, si se seleccionó uno.
 */
export const updateRowInList = async (listId, userId, updatedRowData, newRowFile) => {
  const listRef = doc(db, "lists", listId);
  const listSnap = await getDoc(listRef);

  if (listSnap.exists()) {
    let finalRowData = { ...updatedRowData };
    
    // Si se proporcionó un nuevo archivo de imagen, súbelo y actualiza la URL.
    if (newRowFile) {
      const newImageURL = await uploadRowImage(newRowFile, userId, listId);
      if (newImageURL) {
        finalRowData.imageURL = newImageURL;
      }
    }

    const list = listSnap.data();
    const updatedRows = list.rows.map(row => 
      row.id === finalRowData.id ? finalRowData : row
    );
    
    await updateDoc(listRef, { rows: updatedRows });
  } else {
    throw new Error("List not found!");
  }
};

/**
 * Elimina una fila específica del array 'rows' de una lista.
 * @param {string} listId - El ID de la lista.
 * @param {number} rowId - El ID de la fila a eliminar.
 */
export const deleteRowFromList = async (listId, rowId) => {
  const listRef = doc(db, "lists", listId);
  const listSnap = await getDoc(listRef);
  if (listSnap.exists()) {
    const list = listSnap.data();
    const updatedRows = list.rows.filter(row => row.id !== rowId);
    await updateDoc(listRef, { rows: updatedRows });
  } else {
    throw new Error("List not found!");
  }
};

