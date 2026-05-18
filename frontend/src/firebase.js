import { initializeApp } from "firebase/app";

import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDZrgjUbD8H-PNjCP26niZKXqSDudLhsCE",

  authDomain: "cloudvault-d89bd.firebaseapp.com",

  projectId: "cloudvault-d89bd",

  storageBucket:
    "cloudvault-d89bd.firebasestorage.app",

  messagingSenderId: "789216364227",

  appId:
    "1:789216364227:web:3f4a23b73281a3c1934476",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);