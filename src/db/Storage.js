import { storage } from '../config/firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

/**
 * Uploads a file to Firebase Storage.
 * @param {File} file - The file to upload.
 * @param {string} path - The storage path where the file will be stored.
 * @returns {Promise<string>} - The download URL of the uploaded file.
 */
export const uploadFile = async (file, path) => {
  try {
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading file: ", error);
    throw error;
  }
};

/**
 * Deletes a file from Firebase Storage.
 * @param {string} path - The storage path of the file to delete.
 * @returns {Promise<void>}
 */
export const deleteFile = async (path) => {
  try {
    const fileRef = ref(storage, path);
    await deleteObject(fileRef);
  } catch (error) {
    console.error("Error deleting file: ", error);
    throw error;
  }
};

/**
 * Retrieves the download URL of a file in Firebase Storage.
 * @param {string} path - The storage path of the file.
 * @returns {Promise<string>} - The download URL.
 */
export const getFileDownloadURL = async (path) => {
  try {
    const fileRef = ref(storage, path);
    const downloadURL = await getDownloadURL(fileRef);
    return downloadURL;
  } catch (error) {
    console.error("Error getting download URL: ", error);
    throw error;
  }
};