import { db } from '../config/firebase';
import { collection, addDoc, getDoc, getDocs, updateDoc, deleteDoc, doc, query, where, FieldPath } from 'firebase/firestore';

/**
 * Adds a new document to a specified collection.
 * @param {string} collectionName - The name of the collection.
 * @param {object} data - The data to add.
 * @returns {Promise<string>} - The ID of the added document.
 */
const addDocument = async (collectionName, data) => {
  try {
    const docRef = await addDoc(collection(db, collectionName), data);
    return docRef.id;
  } catch (error) {
    console.error("Error adding document: ", error);
    throw error;
  }
};

/**
 * Retrieves a document by ID from a specified collection.
 * @param {string} collectionName - The name of the collection.
 * @param {string} docId - The ID of the document.
 * @returns {Promise<object>} - The document data.
 */
const getDocument = async (collectionName, docId) => {
  try {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      throw new Error("No such document!");
    }
  } catch (error) {
    console.error("Error getting document: ", error);
    throw error;
  }
};

/**
 * Retrieves all documents from a specified collection.
 * @param {string} collectionName - The name of the collection.
 * @returns {Promise<Array>} - An array of document data.
 */
const getAllDocuments = async (collectionName) => {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    const documents = [];
    querySnapshot.forEach((doc) => {
      documents.push({ id: doc.id, ...doc.data() });
    });
    return documents;
  } catch (error) {
    console.error("Error getting documents: ", error);
    throw error;
  }
};

/**
 * Updates a document in a specified collection.
 * @param {string} collectionName - The name of the collection.
 * @param {string} docId - The ID of the document.
 * @param {object} updatedData - The data to update.
 * @returns {Promise<void>}
 */
const updateDocument = async (collectionName, docId, updatedData) => {
  try {
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, updatedData);
  } catch (error) {
    console.error("Error updating document: ", error);
    throw error;
  }
};

/**
 * Deletes a document from a specified collection.
 * @param {string} collectionName - The name of the collection.
 * @param {string} docId - The ID of the document.
 * @returns {Promise<void>}
 */
const deleteDocument = async (collectionName, docId) => {
  try {
    const docRef = doc(db, collectionName, docId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting document: ", error);
    throw error;
  }
};

/**
 * Queries documents in a collection based on a condition.
 * @param {string} collectionName - The name of the collection.
 * @param {string | FieldPath} fieldPath - The field to query.
 * @param {string | WhereFilterOp} opStr - The operator to use.
 * @param {any} value - The value to match.
 * @returns {Promise<Array>} - An array of matching documents.
 */
const queryDocs = async (collectionName, fieldPath, opStr, value) => {
  try {
    const docRef = collection(db, collectionName);
    const q = query(docRef, where(fieldPath, opStr, value));
    const querySnapshot = await getDocs(q);
  const documents = [];
  querySnapshot.forEach((doc) => {
    documents.push({ id: doc.id, ...doc.data() });
  });
    return documents;
  } catch (error) {
    console.error("Error querying documents: ", error);
    throw error;
  }
};

export { addDocument, getDocument, getAllDocuments, updateDocument, deleteDocument, queryDocs };