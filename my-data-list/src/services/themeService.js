import { collection, doc, getDocs, updateDoc, writeBatch, query } from "firebase/firestore";
import { db } from "../firebase";

// Array completo con la definición de TODOS los temas a crear.
const THEMES_TO_SEED = [
  // --- Temas Oscuros ---
  { id: 'navy', name: 'Deep Navy', type: 'dark', colors: { '--background-color': '#0A192F', '--surface-color': '#172A45', '--primary-color': '#3A7DFF', '--accent-color': '#64FFDA', '--text-primary': '#CCD6F6', '--text-secondary': '#8892B0' } },
  { id: 'teal', name: 'Default Teal', type: 'dark', colors: { '--background-color': '#0d1a1a', '--surface-color': '#132e2e', '--primary-color': '#008080', '--accent-color': '#48d1cc', '--text-primary': '#e6f2f2', '--text-secondary': '#8cb3b3' } },
  { id: 'rose', name: 'Sakura Rose', type: 'dark', colors: { '--background-color': '#2B2123', '--surface-color': '#4F3A41', '--primary-color': '#D96C83', '--accent-color': '#F8B5C3', '--text-primary': '#F5E6E8', '--text-secondary': '#D3B6BC' } },
  { id: 'mint', name: 'Fresh Mint', type: 'dark', colors: { '--background-color': '#1E2A2B', '--surface-color': '#334F49', '--primary-color': '#5FAD93', '--accent-color': '#A6E1C3', '--text-primary': '#E6F2ED', '--text-secondary': '#B6CAC2' } },
  { id: 'crimson', name: 'Crimson Night', type: 'dark', colors: { '--background-color': '#1A1A1A', '--surface-color': '#2C2C2C', '--primary-color': '#990000', '--accent-color': '#FF4D4D', '--text-primary': '#FFFFFF', '--text-secondary': '#A9A9A9' } },
  { id: 'midnight', name: 'Midnight Black', type: 'dark', colors: { '--background-color': '#000000', '--surface-color': '#1C1C1E', '--primary-color': '#333333', '--accent-color': '#58A6FF', '--text-primary': '#FFFFFF', '--text-secondary': '#8A8A8E' } },
  { id: 'grape', name: 'Grape Soda', type: 'dark', colors: { '--background-color': '#23192D', '--surface-color': '#3B2F4A', '--primary-color': '#7F5AF0', '--accent-color': '#9D86E2', '--text-primary': '#E0D9EF', '--text-secondary': '#A79CBF' } },
  { id: 'forest', name: 'Forest Green', type: 'dark', colors: { '--background-color': '#1B2A1B', '--surface-color': '#2E3E2E', '--primary-color': '#228B22', '--accent-color': '#6B8E23', '--text-primary': '#DFF0D8', '--text-secondary': '#A3BFA3' } },

  // --- Temas Claros ---
  { id: 'sky', name: 'Clear Sky', type: 'light', colors: { '--background-color': '#F0F4F8', '--surface-color': '#FFFFFF', '--primary-color': '#A7C7E7', '--accent-color': '#4A90E2', '--text-primary': '#2F4858', '--text-secondary': '#5C7A89' } },
  { id: 'cupcake', name: 'Sweet Cupcake', type: 'light', colors: { '--background-color': '#FAF4F4', '--surface-color': '#FFFFFF', '--primary-color': '#FBCFE8', '--accent-color': '#E55380', '--text-primary': '#332D2D', '--text-secondary': '#756969' } },
  { id: 'spreadsheet', name: 'Spreadsheet Green', type: 'light', colors: { '--background-color': '#F0FFF4', '--surface-color': '#FFFFFF', '--primary-color': '#C6F6D5', '--accent-color': '#2F855A', '--text-primary': '#2A433A', '--text-secondary': '#4A5568' } },
  { id: 'presentation', name: 'Presentation Orange', type: 'light', colors: { '--background-color': '#FFF5EB', '--surface-color': '#FFFFFF', '--primary-color': '#FEEBC8', '--accent-color': '#DD6B20', '--text-primary': '#4A331B', '--text-secondary': '#71542A' } },
  { id: 'lemonade', name: 'Lemonade', type: 'light', colors: { '--background-color': '#FFFFF0', '--surface-color': '#FFFFFF', '--primary-color': '#FEF08A', '--accent-color': '#F59E0B', '--text-primary': '#42360B', '--text-secondary': '#6D5B19' } },
  { id: 'lavender', name: 'Lavender Bliss', type: 'light', colors: { '--background-color': '#F5F3FF', '--surface-color': '#FFFFFF', '--primary-color': '#DDD6FE', '--accent-color': '#7C3AED', '--text-primary': '#37304A', '--text-secondary': '#5B546A' } },
  { id: 'solar', name: 'Solar Flare', type: 'light', colors: { '--background-color': '#FFFBEB', '--surface-color': '#FFFFFF', '--primary-color': '#FEF3C7', '--accent-color': '#F59E0B', '--text-primary': '#423207', '--text-secondary': '#6C541B' } },
  { id: 'aqua', name: 'Aqua Marine', type: 'light', colors: { '--background-color': '#ECFEFF', '--surface-color': '#FFFFFF', '--primary-color': '#A5F3FC', '--accent-color': '#0891B2', '--text-primary': '#1E4048', '--text-secondary': '#3B6068' } },
  { id: 'rosewater', name: 'Rosewater', type: 'light', colors: { '--background-color': '#F5E0DC', '--surface-color': '#FFFFFF', '--primary-color': '#F8C8C3', '--accent-color': '#E46876', '--text-primary': '#4C3839', '--text-secondary': '#7B5A5D' } },
];

/**
 * FUNCIÓN DE CONFIGURACIÓN ÚNICA: Crea los temas en Firestore si no existen.
 * Descomentar la llamada a esta función una vez para poblar la base de datos.
 */
export const initializeThemes = async () => {
  console.log("Checking for themes...");
  const themesCollectionRef = collection(db, "themes");
  
  // Borra la colección existente para asegurar una actualización limpia
  const oldThemes = await getDocs(query(themesCollectionRef));
  if (!oldThemes.empty) {
    console.log(`Deleting ${oldThemes.size} old themes...`);
    const deleteBatch = writeBatch(db);
    oldThemes.forEach(doc => deleteBatch.delete(doc.ref));
    await deleteBatch.commit();
    console.log("Old themes deleted.");
  }

  console.log("Seeding database with new themes...");
  const batch = writeBatch(db);
  THEMES_TO_SEED.forEach(theme => {
    const docRef = doc(db, "themes", theme.id);
    batch.set(docRef, { name: theme.name, type: theme.type, colors: theme.colors });
  });
  await batch.commit();
  console.log("Themes seeded successfully!");
};

// Descomenta la siguiente línea UNA SOLA VEZ para poblar tu base de datos, luego vuelve a comentarla.
// initializeThemes(); 

/**
 * Obtiene todos los temas disponibles desde la colección 'themes' en Firestore.
 * @returns {Promise<Array>} Un array de objetos de tema.
 */
export const getAvailableThemes = async () => {
  const themesCollectionRef = collection(db, "themes");
  const q = query(themesCollectionRef);
  const querySnapshot = await getDocs(q);
  const themes = [];
  querySnapshot.forEach((doc) => {
    themes.push({ id: doc.id, ...doc.data() });
  });
  return themes;
};

/**
 * Actualiza la preferencia de tema para un usuario específico en su documento de perfil.
 * @param {string} userId - El UID del usuario.
 * @param {string} themeId - El ID del tema seleccionado (ej. 'rose').
 */
export const updateUserThemePreference = async (userId, themeId) => {
  if (!userId || !themeId) return;
  const userRef = doc(db, "users", userId);
  await updateDoc(userRef, {
    selectedTheme: themeId
  });
};

