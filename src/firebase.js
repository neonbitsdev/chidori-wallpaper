import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyA2BZCXx-YEUdzhAbGUr5vafKzeVDsW7W8",
    authDomain: "chidori-website.firebaseapp.com",
    projectId: "chidori-website",
    storageBucket: "chidori-website.firebasestorage.app",
    messagingSenderId: "435363051996",
    appId: "1:435363051996:web:1db0f48a2081c712043719"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup, signOut };
