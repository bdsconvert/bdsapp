import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAzf-SzZyk_UdU7jwjaccHjeCPQXIdfxtY",
  authDomain: "bdsapp-21.firebaseapp.com",
  databaseURL: "https://bdsapp-21-default-rtdb.firebaseio.com",
  projectId: "bdsapp-21",
  storageBucket: "bdsapp-21.appspot.com",
  messagingSenderId: "705002556975",
  appId: "1:705002556975:web:3194bbec5b39ff4d0f40da",
  measurementId: "G-4QMY1LSYKM"
};

export const fbapp = initializeApp(firebaseConfig);
export const authObj = { auth: getAuth(fbapp), bdsuser: null };
export const fbdb = getFirestore(fbapp);

onAuthStateChanged(authObj.auth, (user) => {
  if (user) {
    authObj.bdsuser = user.email;
    console.log(`Current User => ${authObj.bdsuser}`);
    document.querySelectorAll(".logged-in").forEach((item) => (item.style.display = "block"));
    document.querySelectorAll(".logged-out").forEach((item) => (item.style.display = "none"));
  } else {
    authObj.bdsuser = "";
    document.querySelectorAll(".logged-in").forEach((item) => (item.style.display = "none"));
    document.querySelectorAll(".logged-out").forEach((item) => (item.style.display = "block"));
  }
});
