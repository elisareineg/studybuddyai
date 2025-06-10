import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBePooicwMM_MqKEkJGABEG22bPba8WEE0",
  authDomain: "studdybuddyai-c7892.firebaseapp.com",
  projectId: "studdybuddyai-c7892",
  storageBucket: "studdybuddyai-c7892.firebasestorage.app",
  messagingSenderId: "640190532722",
  appId: "1:640190532722:web:08590cde6f05474c5dc6eb",
  measurementId: "G-R6K7DTBWWK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Configure auth persistence
auth.setPersistence('local');

// Only initialize analytics on the client and if supported
export let analytics = null;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
} 