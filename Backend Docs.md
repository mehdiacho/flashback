# Backend Documentation

## Overview

This document outlines the backend architecture and database schema for **Flashback**, a shared gallery application. The backend leverages Firebase Firestore for NoSQL database functionalities and Firebase Storage for storing image files. The design focuses on efficiency, scalability, and secure sharing of flashbacks among users without unnecessary data redundancy.

## Firestore Schema Design

### Collections Overview

1. **Users Collection (`users`)**
   - Stores user-specific information.

2. **Flashbacks Collection (`flashbacks`)**
   - Represents a set of images/memories shared among users.
   - Contains metadata about the flashback and its participants.

3. **Images Subcollection (`images`)**
   - Nested under each flashback.
   - Stores metadata for each image within the flashback.

### Detailed Structure

#### Users Collection

**Path:** `users/{userId}`

**Document Structure:**
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "createdAt": Timestamp,
  "profilePictureURL": "https://..."
}
```

**Explanation:**
- **`userId`**: Unique identifier for each user (typically UID from Firebase Authentication).
- **Fields**: User's name, email, profile picture URL, and account creation timestamp.

#### Flashbacks Collection

**Path:** `flashbacks/{flashbackId}`

**Document Structure:**
```json
{
  "title": "Summer Vacation 2023",
  "description": "Memories from our trip to the beach.",
  "ownerId": "userId_123",
  "participants": ["userId_123", "userId_456", "userId_789"],
  "createdAt": Timestamp,
  "updatedAt": Timestamp
}
```

**Explanation:**
- **`flashbackId`**: Unique identifier for each flashback.
- **Fields**:
  - **`title`** & **`description`**: Descriptive information about the flashback.
  - **`ownerId`**: UID of the user who created the flashback.
  - **`participants`**: Array of UIDs who have access to the flashback (including the owner).
  - **`createdAt`** & **`updatedAt`**: Timestamps for record-keeping.

#### Images Subcollection

**Path:** `flashbacks/{flashbackId}/images/{imageId}`

**Document Structure:**
```json
{
  "fileName": "beach_sunset.jpg",
  "downloadURL": "https://...",
  "uploadedBy": "userId_123",
  "uploadedAt": Timestamp,
  "metadata": {
    "tags": ["sunset", "beach"],
    "description": "Sunset view from the beach."
  }
}
```

**Explanation:**
- **`imageId`**: Unique identifier for each image.
- **Fields**:
  - **`fileName`** & **`downloadURL`**: Information about the stored image file.
  - **`uploadedBy`**: UID of the user who uploaded the image.
  - **`uploadedAt`**: Timestamp of when the image was uploaded.
  - **`metadata`**: Additional details like tags and descriptions.

### Sharing Mechanism

To facilitate sharing without redundancy:

- **Single Source of Truth:** Each image exists **once** in the `images` subcollection under its respective flashback.
- **Access Control:** Use the `participants` array in the flashback document to manage who can view or interact with the flashback and its images.
- **No Duplication:** Avoid duplicating image documents for shared users. Instead, leverage Firestore’s querying capabilities to fetch shared flashbacks relevant to a user.

## Firestore Security Rules

Implement security rules to ensure that users can only access flashbacks they own or are participants in.

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users can read and write their own user document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Flashbacks collection
    match /flashbacks/{flashbackId} {
      allow read, write: if isParticipantOrOwner(flashbackId);

      // Images subcollection
      match /images/{imageId} {
        allow read, write: if isParticipantOrOwner(flashbackId);
      }
    }

    function isParticipantOrOwner(flashbackId) {
      return request.auth != null &&
             (resource.data.ownerId == request.auth.uid ||
              resource.data.participants.hasAny([request.auth.uid]));
    }
  }
}
```

**Explanation:**
- **`isParticipantOrOwner` Function:** Checks if the authenticated user is either the owner or a participant of the flashback.
- **Access Control:** Grants read and write permissions only to authorized users.

## Indexing for Efficient Queries

To optimize query performance, especially when fetching flashbacks a user is part of:

1. **Composite Indexes:**
   - Create an index on the `flashbacks` collection where the `participants` array contains the user’s UID.

2. **Firestore Console Setup:**
   - Navigate to Firestore in the Firebase console.
   - Under the **Indexes** tab, create necessary composite indexes based on query patterns.

## Sample Queries

### Fetching User's Flashbacks

```javascript
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from './firebase';

/**
 * Function to get flashbacks where user is owner or participant
 */
const getUserFlashbacks = async (userId) => {
  const flashbacksRef = collection(db, 'flashbacks');
  const q = query(
    flashbacksRef,
    where('participants', 'array-contains', userId)
  );
  
  const querySnapshot = await getDocs(q);
  const flashbacks = [];
  querySnapshot.forEach((doc) => {
    flashbacks.push({ id: doc.id, ...doc.data() });
  });
  
  return flashbacks;
};
```

### Fetching Images for a Flashback

```javascript
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase';

/**
 * Function to get images for a specific flashback
 */
const getFlashbackImages = async (flashbackId) => {
  const imagesRef = collection(db, `flashbacks/${flashbackId}/images`);
  const querySnapshot = await getDocs(imagesRef);
  const images = [];
  querySnapshot.forEach((doc) => {
    images.push({ id: doc.id, ...doc.data() });
  });
  return images;
};
```

## Firebase Storage Structure

Organize Firebase Storage to align with Firestore's flashback-centric schema.

### Storage Path Convention

```
flashbacks/
  {flashbackId}/
    {imageFileName}
```

**Example:**

```
flashbacks/
  flashbackId_12345/
    beach_sunset.jpg
    mountain_hike.png
```

**Advantages:**
- **Logical Grouping:** Images are grouped under their respective flashbacks, simplifying access control and retrieval.
- **Scalability:** Easily scalable as the number of flashbacks and images grows.
- **Security:** Aligns with Firestore security rules by tying storage paths to flashback identifiers.

## Implementation Steps

### Organize Firestore Functions

Split your Firestore-related functions into `Firestore.js`, `Storage.js`, and `Db.js` for modularity.

#### Firestore.js

Handles all Firestore operations.

```javascript:src/db/Firestore.js
import { db } from './firebase';
import { collection, addDoc, getDoc, getDocs, updateDoc, deleteDoc, doc, query, where } from 'firebase/firestore';

/**
 * Adds a new document to a specified collection.
 */
export const addDocument = async (collectionName, data) => {
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
 */
export const getDocument = async (collectionName, docId) => {
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
 */
export const getAllDocuments = async (collectionName) => {
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
 */
export const updateDocument = async (collectionName, docId, updatedData) => {
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
 */
export const deleteDocument = async (collectionName, docId) => {
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
 */
export const queryDocuments = async (collectionName, field, value) => {
  try {
    const q = query(collection(db, collectionName), where(field, "==", value));
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
```

#### Storage.js

Handles all Firebase Storage operations.

```javascript:src/db/Storage.js
import { storage } from './firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

/**
 * Uploads a file to Firebase Storage.
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
```

#### Db.js

Combines Firestore and Storage functions to perform complex operations like uploading an image and storing its metadata.

```javascript:src/db/Db.js
import { uploadFile } from './Storage';
import { addDocument } from './Firestore';
import { auth } from './firebase';

/**
 * Uploads an image to Firebase Storage and saves its metadata to Firestore.
 */
export const uploadImageWithMetadata = async (file, flashbackId) => {
  if (!auth.currentUser) {
    throw new Error("User is not authenticated");
  }

  // Define the storage path
  const storagePath = `flashbacks/${flashbackId}/${Date.now()}_${file.name}`;
  
  try {
    // Upload the file and get its download URL
    const downloadURL = await uploadFile(file, storagePath);
    
    // Prepare metadata
    const metadata = {
      fileName: file.name,
      downloadURL: downloadURL,
      uploadedBy: auth.currentUser.uid,
      uploadedAt: new Date(),
      // Add additional metadata fields as needed
    };
    
    // Save metadata to Firestore
    await addDocument(`flashbacks/${flashbackId}/images`, metadata);
    
  } catch (error) {
    console.error("Error uploading image with metadata: ", error);
    throw error;
  }
};
```

## Integrate Database Functions into Your Application

### Uploading Images via `Home.jsx`

Enhance your `Home` component to include an upload button that allows users to upload images to a specific flashback.

```javascript:src/pages/Home.jsx
import { useContext, useState } from 'react';
import { AuthContext } from '../auth/AuthContext';
import {
  Container,
  Box,
  Typography,
  Button,
  AppBar,
  Toolbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  LinearProgress,
  Alert
} from '@mui/material';
import UploadIcon from '@mui/icons-material/Upload';
import { uploadImageWithMetadata } from '../db/Db';

function Home() {
  const { logout, user } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [flashbackId, setFlashbackId] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error('Error logging out:', err);
    }
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedFiles([]);
    setFlashbackId('');
    setUploadProgress(0);
    setError('');
    setSuccess('');
  };

  const handleFileChange = (e) => {
    setSelectedFiles(e.target.files);
  };

  const handleUpload = async () => {
    if (!flashbackId) {
      setError('Please enter a Flashback ID');
      return;
    }

    if (selectedFiles.length === 0) {
      setError('Please select at least one image to upload');
      return;
    }

    setError('');
    setSuccess('');
    setUploadProgress(0);

    const totalFiles = selectedFiles.length;
    let uploaded = 0;

    try {
      for (let i = 0; i < totalFiles; i++) {
        const file = selectedFiles[i];
        await uploadImageWithMetadata(file, flashbackId);
        uploaded += 1;
        setUploadProgress((uploaded / totalFiles) * 100);
      }

      setSuccess('All images uploaded successfully!');
      setSelectedFiles([]);
      setFlashbackId('');
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.message);
    }
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Flashback
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
            Log Out
          </Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="md">
        <Box sx={{ mt: 8, textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom>
            Welcome to Flashback!
          </Typography>
          <Typography variant="h6" gutterBottom>
            You are logged in as {user.email}.
          </Typography>
          <Button
            variant="contained"
            startIcon={<UploadIcon />}
            onClick={handleOpen}
            sx={{ mt: 4 }}
          >
            Upload Images
          </Button>
        </Box>

        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
          <DialogTitle>Upload Images</DialogTitle>
          <DialogContent>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
            <TextField
              autoFocus
              margin="dense"
              label="Flashback ID"
              type="text"
              fullWidth
              variant="outlined"
              value={flashbackId}
              onChange={(e) => setFlashbackId(e.target.value)}
              required
            />
            <Button
              variant="contained"
              component="label"
              sx={{ mt: 2 }}
            >
              Select Images
              <input
                type="file"
                accept="image/*"
                multiple
                hidden
                onChange={handleFileChange}
              />
            </Button>
            {selectedFiles.length > 0 && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                {selectedFiles.length} file(s) selected
              </Typography>
            )}
            {uploadProgress > 0 && uploadProgress < 100 && (
              <Box sx={{ width: '100%', mt: 2 }}>
                <LinearProgress variant="determinate" value={uploadProgress} />
                <Typography variant="body2" color="text.secondary">{`Uploading ${Math.round(uploadProgress)}%`}</Typography>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button
              onClick={handleUpload}
              variant="contained"
              disabled={uploadProgress > 0 && uploadProgress < 100}
            >
              Upload
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
}

export default Home;
```

## Firestore Structure Query Optimization

Ensure your Firestore queries are optimized to fetch flashbacks efficiently.

### Fetch Flashbacks Accessible to a User

```javascript
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from './firebase';

/**
 * Fetches all flashbacks where the user is a participant.
 */
export const getUserFlashbacks = async (userId) => {
  try {
    const flashbacksRef = collection(db, 'flashbacks');
    const q = query(flashbacksRef, where('participants', 'array-contains', userId));
    const querySnapshot = await getDocs(q);
    const flashbacks = [];
    querySnapshot.forEach((doc) => {
      flashbacks.push({ id: doc.id, ...doc.data() });
    });
    return flashbacks;
  } catch (error) {
    console.error("Error fetching user flashbacks: ", error);
    throw error;
  }
};
```

**Usage Example:**
```javascript
import { getUserFlashbacks } from '../db/Firestore';

const fetchFlashbacks = async () => {
  const userId = auth.currentUser.uid;
  const flashbacks = await getUserFlashbacks(userId);
  // Handle the fetched flashbacks
};
```

### Fetch Images for a Specific Flashback

```javascript
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase';

/**
 * Fetches all images within a specific flashback.
 */
export const getFlashbackImages = async (flashbackId) => {
  try {
    const imagesRef = collection(db, `flashbacks/${flashbackId}/images`);
    const querySnapshot = await getDocs(imagesRef);
    const images = [];
    querySnapshot.forEach((doc) => {
      images.push({ id: doc.id, ...doc.data() });
    });
    return images;
  } catch (error) {
    console.error("Error fetching flashback images: ", error);
    throw error;
  }
};
```

**Usage Example:**
```javascript
import { getFlashbackImages } from '../db/Firestore';

const fetchImages = async (flashbackId) => {
  const images = await getFlashbackImages(flashbackId);
  // Handle the fetched images
};
```

## Firebase Storage Security Rules

Align Storage security rules with Firestore rules to ensure that only authorized users can access specific files.

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    
    // Allow users to access their flashbacks' images
    match /flashbacks/{flashbackId}/{allPaths=**} {
      allow read, write: if isParticipantOrOwner(flashbackId);
    }

    function isParticipantOrOwner(flashbackId) {
      return request.auth != null &&
             exists(/databases/$(database)/documents/flashbacks/$(flashbackId)) &&
             (
               get(/databases/$(database)/documents/flashbacks/$(flashbackId)).data.ownerId == request.auth.uid ||
               get(/databases/$(database)/documents/flashbacks/$(flashbackId)).data.participants.hasAny([request.auth.uid])
             );
    }
  }
}
```

**Explanation:**
- **Access Control:** Users can read/write files in a flashback's folder only if they are participants or the owner.
- **Consistency:** Ensures that Storage access mirrors Firestore permissions, maintaining data integrity and security.

## Firestore Data Flow Summary

1. **User Authentication:**
   - Users authenticate via Firebase Authentication.
   - Each user has a unique `userId`.

2. **Creating a Flashback:**
   - User creates a flashback, adding their `userId` to the `ownerId` and `participants` array in the `flashbacks` collection.

3. **Uploading Images:**
   - User selects images to upload.
   - Images are stored in Firebase Storage under `flashbacks/{flashbackId}/`.
   - Image metadata is stored in Firestore under `flashbacks/{flashbackId}/images/{imageId}`.

4. **Sharing Flashbacks:**
   - To share, add other users' `userId`s to the `participants` array in the flashback document.
   - Shared users can access images without duplicating data.

5. **Retrieving Images:**
   - When a user opens the app, query `flashbacks` where `participants` contains their `userId`.
   - Fetch images from the `images` subcollection of accessible flashbacks.
   - Display images grouped by their respective flashbacks.

## Advantages of This Schema

- **No Redundancy:** Images and their metadata are stored once per flashback, regardless of the number of participants.
- **Scalability:** Efficiently supports a growing number of users, flashbacks, and images.
- **Performance:** Optimized queries ensure that users can quickly retrieve accessible flashbacks and images without scanning the entire database.
- **Security:** Robust security rules protect data integrity and ensure that only authorized users can access specific flashbacks and images.
- **Maintainability:** Clear separation of concerns with modular Firestore and Storage functions enhances maintainability and ease of development.

## Additional Recommendations

### Gallery Creation and Management

Instead of manually entering `Flashback ID` when uploading images, implement functionality to create and select flashbacks within the app.

- **Create Flashback:**
  - Users can create a new flashback with a unique title and description.
  - Upon creation, the app generates a `flashbackId` and assigns the creator as the owner.

- **Select Flashback for Upload:**
  - Provide a dropdown or selection interface for users to choose which flashback they want to upload images to.

### Enhanced Sharing Features

Facilitate seamless sharing by allowing users to invite others via email or in-app notifications.

- **Invite Participants:**
  - Implement an invitation system where owners can add participants to a flashback.
  - Send invitations via email or in-app notifications for participant acknowledgment.

- **Manage Participants:**
  - Allow owners to add or remove participants from a flashback.
  - Implement role-based access if needed (e.g., owner vs. collaborator).

### Optimizing Upload Processes

For large uploads, consider optimizing the upload process to handle concurrency and retries.

- **Batch Uploads:**
  - Implement batch uploading with progress indicators for multiple files.
  - Allow users to pause or cancel ongoing uploads.

- **Error Handling:**
  - Provide detailed error messages and retry options in case of failures.

### Implementing AI-Powered Features

Integrate AI functionalities as outlined in your README for face recognition and tagging.

- **Face Recognition Integration:**
  - After uploading, process images through AI models to detect and tag faces.
  - Update image metadata with recognized faces and suggested participants.

- **Participant Suggestions:**
  - Automatically suggest or assign participants based on recognized faces in uploaded images.

### UI/UX Enhancements

Leverage Material-UI (MUI) to create an intuitive and responsive user interface.

- **Flashback Dashboard:**
  - Display a list or grid of accessible flashbacks.
  - Show flashback details and a preview of images.

- **Image Gallery View:**
  - Implement a dynamic gallery view with search and filter capabilities.
  - Allow users to add descriptions or contextual stories to each image.

- **Responsive Design:**
  - Ensure the app is optimized for various devices and screen sizes.

## Directory Structure

```
src/
├── auth/
│   └── AuthContext.jsx
├── db/
│   ├── Db.js
│   ├── Firestore.js
│   ├── Storage.js
│   └── firebase.js
├── pages/
│   ├── Home.jsx
│   ├── Login.jsx
│   └── Signup.jsx
├── config/
│   └── firebase.js
├── App.jsx
├── main.jsx
└── index.css
```

## Conclusion

By structuring your Firestore and Firebase Storage as outlined above, you create a robust and efficient backend for your Flashback application. This schema ensures minimal redundancy, optimal performance, and seamless sharing capabilities, all while maintaining data integrity and security. Leveraging Firestore’s powerful querying and Firebase Storage’s scalable storage solutions, you can deliver a high-quality user experience aligned with industry best practices.

Feel free to reach out if you need further assistance with implementation details or additional features!
