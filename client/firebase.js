// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "text-editor-56e8c.firebaseapp.com",
  projectId: "text-editor-56e8c",
  storageBucket: "text-editor-56e8c.appspot.com",
  messagingSenderId: "776489891914",
  appId: "1:776489891914:web:97bd36cf06d9bb739d4eb3",
  measurementId: "G-57YFJ79DCV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export default app;
// export const auth = getAuth(app);
// export const provider = new GoogleAuthProvider();
// firebase login
// firebase init
// firebase deploy

