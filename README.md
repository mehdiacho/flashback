# Flashback

## Overview

**Flashback** is a shared gallery application that allows users to upload and view pictures within private or shared galleries. Designed with privacy and user collaboration in mind, Flashback enables users to manage who can view each photo, create multiple galleries, and add contextual stories to their images. Leveraging modern technologies and AI-powered face recognition, Flashback provides a seamless and intuitive experience for capturing and sharing memories.

## Features

- **User Authentication & Waitlist Access**
  - Limited early access for whitelisted users.
  - Users can sign up for the waitlist to gain access.
  - Free usage during the early access phase with planned subscription plans for the full release.

- **Gallery Management**
  - Create multiple galleries, each with a unique name.
  - Invite friends or add users via email to collaborate on galleries.
  - Set visibility permissions for each gallery.

- **Photo Upload & Organization**
  - Upload single or multiple pictures to a gallery.
  - Assign participants to each photo to control visibility.
  - Batch upload photos with predefined participant settings.

- **Privacy Controls**
  - Customize default visibility settings in user profiles.
  - Ensure only designated individuals can view specific photos.

- **AI-Powered Face Recognition**
  - Integrate AI models to automatically recognize and tag faces in photos.
  - Suggest participants based on recognized faces for easier photo management.
  - Future integration with advanced AI models for enhanced recognition capabilities.

- **Interactive Gallery Viewing**
  - Automatically scrolling gallery view for a seamless browsing experience.
  - Manual controls available for user navigation.
  - Add contextual stories or descriptions to individual photos.

- **Responsive & Intuitive Design**
  - Adheres to Google's design principles for a clean and user-friendly interface.
  - Optimized for various devices and screen sizes.

## Technologies

### Frontend

- **Vite**: Fast and opinionated frontend build tool.
- **React**: Robust JavaScript library for building user interfaces.

### Backend & Database

- **Firebase**: Real-time database, authentication, and storage solutions.
  - *Alternatives*: Consider **Supabase** or **AWS Amplify** for additional features and scalability.

### AI & Machine Learning

- **Gemini**: AI model for face recognition and tagging.
  - *Other Options*: 
    - **OpenAI**: Offers powerful models for various AI tasks.
    - **Llama**: Efficient and scalable for custom AI solutions.
    - **Claude**: Advanced conversational AI capabilities.
  - *Note*: Research and evaluate each model's compatibility and performance with Firebase and project requirements.

### Design

- **Google Material Design**: Implements Google's design principles for consistency and usability.

## Installation

### Prerequisites

- **Node.js** (v14 or later)
- **npm** or **yarn**
- **Firebase Account**: For backend services.

### Steps

1. **Clone the Repository**

   ```bash
   git clone https://github.com/yourusername/flashback.git
   cd flashback
   ```

2. **Install Dependencies**

   Using npm:

   ```bash
   npm install
   ```

   Or using yarn:

   ```bash
   yarn install
   ```

3. **Configure Firebase**

   - Create a Firebase project in the [Firebase Console](https://console.firebase.google.com/).
   - Enable necessary services: Authentication, Firestore Database, Storage.
   - Obtain your Firebase configuration and set it up in the project.

4. **Run the Development Server**

   Using npm:

   ```bash
   npm run dev
   ```

   Or using yarn:

   ```bash
   yarn dev
   ```

   The application should now be running at `http://localhost:3000`.

## Usage

1. **Sign Up & Join Waitlist**

   - Visit the application URL.
   - Sign up using your email to join the waitlist for early access.

2. **Create & Manage Galleries**

   - After gaining access, create a new gallery by providing a unique name.
   - Invite friends or add users via email to collaborate on your gallery.

3. **Upload Photos**

   - Upload photos to your gallery.
   - Assign participants to each photo to control who can view them.
   - Utilize batch upload for adding multiple photos with predefined participants.

4. **View & Interact with Galleries**

   - Browse through galleries with auto-scrolling capabilities.
   - Add contextual stories or descriptions to enrich your memories.

## AI Model Considerations

Flashback plans to integrate AI-powered face recognition to enhance photo management and tagging. Below are the AI models under consideration:

- **Gemini**
  - *Pros*: Seamless integration with Firebase.
  - *Cons*: Requires evaluation of recognition accuracy and scalability.

- **OpenAI Models**
  - *Pros*: Advanced capabilities and support.
  - *Cons*: Potential costs and integration complexity.

- **Llama**
  - *Pros*: Efficient and customizable.
  - *Cons*: May require more development effort for integration.

- **Claude**
  - *Pros*: Robust conversational AI features.
  - *Cons*: Primarily focused on conversation, may need customization for image recognition.

*Recommendation*: Research each option to determine the best fit based on integration ease, performance, scalability, and cost.

## Design Principles

Flashback’s design heavily follows **Google's Material Design** principles to ensure a clean, intuitive, and accessible user interface. Key focus areas include:

- **Consistency**: Uniform design elements across the application for a cohesive experience.
- **Accessibility**: Ensuring the app is usable by people with varying abilities.
- **Responsiveness**: Optimized layout for different devices and screen sizes.
- **Feedback**: Providing users with clear feedback on their interactions.

## Future Roadmap

- **AI Integration Enhancements**
  - Implement and refine face recognition capabilities.
  - Enable automatic tagging and participant suggestions.

- **Subscription Plans**
  - Develop and launch scalable subscription models for the full release.
  - Offer premium features and storage options for subscribers.

- **Expanded User Management**
  - Enhance invitation system with more robust user management tools.
  - Implement advanced privacy settings and permissions.

- **Performance Improvements**
  - Optimize image loading and gallery performance.
  - Enhance scalability to support a growing user base.

## Contributing

Contributions are welcome! Please follow these steps to contribute:

1. **Fork the Repository**

2. **Create a Feature Branch**

   ```bash
   git checkout -b feature/YourFeature
   ```

3. **Commit Your Changes**

   ```bash
   git commit -m "Add your message"
   ```

4. **Push to the Branch**

   ```bash
   git push origin feature/YourFeature
   ```

5. **Open a Pull Request**

## License

This project is licensed under the [MIT License](LICENSE).

## Contact

For any inquiries or feedback, please contact [your.email@example.com](mailto:your.email@example.com).
