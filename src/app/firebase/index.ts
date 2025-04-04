import { initializeApp } from "firebase/app";
import { browserSessionPersistence, getAuth, setPersistence } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

export const firebaseConfig = {
  apiKey: "AIzaSyCveGQtLfYySfu1YP0v5cvWxmDsReB3JqA",
  authDomain: "tausi-app.firebaseapp.com",
  projectId: "tausi-app",
  storageBucket: "tausi-app.appspot.com",
  messagingSenderId: "164460393814",
  appId: "1:164460393814:web:ceca91decb00405fe0d2f7",
  measurementId: "G-S1BNRKZP4K"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
setPersistence(auth, browserSessionPersistence);
export const storage = getStorage(app);
export const firestore = getFirestore(app);
