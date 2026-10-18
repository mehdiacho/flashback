import { uploadFile } from './Storage';
import { addDocument, getAllDocuments, queryDocs } from './Firestore';
import { auth } from '../config/firebase';

/**
 * Uploads an image to Firebase Storage and saves its metadata to Firestore.
 * @param {File} file - The image file to upload.
 * @param {string} galleryId - The ID of the gallery to which the image belongs.
 * @returns {Promise<void>}
 */
const uploadImageWithMetadata = async (file, galleryId) => {
  if (!auth.currentUser) {
    throw new Error("User is not authenticated");
  }

  // Define the storage path
  const storagePath = `galleries/${galleryId}/${Date.now()}_${file.name}`;
  
  try {
    // Upload the file and get its download URL
    const downloadURL = await uploadFile(file, storagePath);
    
    // Prepare metadata
    const metadata = {
      name: file.name,
      url: downloadURL,
      uploadedAt: new Date(),
      uploadedBy: auth.currentUser.uid,
      galleryId: galleryId,
      // Add additional metadata fields as needed
    };
    
    // Save metadata to Firestore
    await addDocument(`galleries/${galleryId}/images`, metadata);
    
  } catch (error) {
    console.error("Error uploading image with metadata: ", error);
    throw error;
  }
};

// Function to fetch images for a given flashbackID for owned flashbacks
async function getFlashbackImages(flashbackId) {
  return getAllDocuments(`flashbacks/${flashbackId}/images`);
  
};

// Function to fetch images for a given flashbackID for shared flashbacks
async function queryFlashbackImages(flashbackId, userId) {
  return queryDocs(`flashbacks/${flashbackId}/images`, 'participants', 'array-contains', userId);
  const imagesRef = firestore.collection('flashbacks').doc(flashbackID).collection('images');
  const querySnapshot = await imagesRef.get();
  const images = [];
  querySnapshot.forEach(doc => {
    images.push({ id: doc.id, ...doc.data() });
  });
  return images;
}

// Function to fetch images for a given flashbackID
async function getUserFlashbacks(userId) {
  return queryDocs('flashbacks', 'ownerId', '==', userId);
}


// Function to fetch images for a given flashbackID
async function getSharedFlashbacks(userId) {
  return queryDocs('flashbacks', 'participants', 'array-contains', userId);
}

export {
  uploadImageWithMetadata,
  getFlashbackImages,
  queryFlashbackImages,
  getUserFlashbacks,
  getSharedFlashbacks
}

