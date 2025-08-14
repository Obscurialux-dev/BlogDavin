import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCTapZu-5WRwpcPHqdaxU18usD0grVVTio",
  authDomain: "starluxx-a7041.firebaseapp.com",
  projectId: "starluxx-a7041",
  storageBucket: "starluxx-a7041.appspot.com",
  messagingSenderId: "15297324500",
  appId: "1:15297324500:web:7d5feab81290f015e02241"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup, onAuthStateChanged, signOut };
