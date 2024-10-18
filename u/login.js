// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyA8buBrv26Qtk9dmRj3NVk757mPG92b_Ik",
    authDomain: "astromods.firebaseapp.com",
    projectId: "astromods",
    storageBucket: "astromods.appspot.com",
    messagingSenderId: "801546619851",
    appId: "1:801546619851:web:85129cbb4e6ceb3360444e",
    measurementId: "G-K8K3M9KBFY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Function to handle login
async function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        await signInWithEmailAndPassword(auth, email, password);
        // Redirect to upload.html after successful login
        window.location.href = "upload.html";
    } catch (error) {
        console.error("Error logging in:", error);
        alert("Login failed: " + error.message);
    }
}

// Attach event listener to the login button
document.getElementById('loginButton').addEventListener('click', login);
