# Secure Chat

## Functionalities
- **User Registration and Authentication**
  - Users can register an account and authenticate themselves securely.
- **Finding and Adding Contacts**
  - Users can search for and add contacts to their list.
- **Realtime Chat with end-to-end Encryption**
  - Instant messaging between users with encryption for data security.
- **Secure sessions**
  - Ensures secure communication and data protection throughout the platform.

## Tech Stack Used
### Frontend
- **React**
  - Single-page application for a seamless user experience.
- **Chakra UI**
  - Provides themes and main components for enhanced visual appearance.
- **Formik & Yup**
  - Manages forms and validates user inputs.
- **React Query**
  - Handles API calls and state management for efficient communication.
- **Socket.io-client**
  - Enables real-time communication with the backend through sockets.
- **Openpgp**
  - Generates private/public keys and encrypts/decrypts data for security.

### Backend
- **Node.js with Express**
  - Powers the backend with TypeScript for type safety.
- **Socket.IO**
  - Provides a socket server for real-time client communication.
- **Pino**
  - Logging library for capturing errors and other relevant information.
- **Crypto**
  - Utilized for encryption techniques, including AES encryption.
- **OpenPGP**
  - Generates private/public keys and encrypts/decrypts data for security.
- **MongoDB**
  - NoSQL database for persistent storage.
- **Prisma**
  - Feature-rich ORM for interacting with the database.
