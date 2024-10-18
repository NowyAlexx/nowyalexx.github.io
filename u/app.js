// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-analytics.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-storage.js";

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
const analytics = getAnalytics(app);
const auth = getAuth(app);
const storage = getStorage(app);

// Check authentication status
const userStatusDiv = document.getElementById('userStatus');

// Check if user is logged in
onAuthStateChanged(auth, user => {
    if (user) {
        userStatusDiv.innerHTML = "User logged in";
        userStatusDiv.style.display = 'block';
    } else {
        window.location.href = "../index.html"; // Redirect if not logged in
    }
});

// Function to upload mod settings.ini
async function uploadModSettings() {
    const author = document.getElementById('author').value;
    const github = document.getElementById('github').value;
    const title = document.getElementById('title').value;
    const thumbnail = document.getElementById('thumbnail').files[0]; // Get selected thumbnail
    const fulldesc = document.getElementById('fulldesc').value;
    const version = document.getElementById('version').value;
    const creationDate = document.getElementById('creationDate').value;
    const downloadable = document.getElementById('downloadable').checked;
    const downloadGit = document.getElementById('downloadGit').checked;
    const downloadUrl = document.getElementById('downloadUrl').value;
    const gitUrl = document.getElementById('gitUrl').value;

    // Create settings.ini content
    let settingsContent = `author=${author}\n`;
    settingsContent += `github=${github}\n`;
    settingsContent += `title=${title}\n`;
    settingsContent += `thumbnail=${thumbnail.name}\n`;
    settingsContent += `fulldesc=${fulldesc}\n`;
    settingsContent += `version=${version}\n`;
    settingsContent += `creationdate=${creationDate}\n`;
    settingsContent += `downloadable=${downloadable ? 'yes' : 'no'}\n`;
    settingsContent += `downloadgit=${downloadGit ? 'yes' : 'no'}\n`;
    settingsContent += `downloadurl=${downloadUrl}\n`;
    settingsContent += `giturl=${gitUrl}\n`;
    settingsContent += `imagesize=300\n`;
    settingsContent += `isauthorcertified=no\n`;
    settingsContent += `ismodcertified=no\n`;
    settingsContent += `id=1001\n`; // Use your logic to set this dynamically

    // Upload settings.ini file to Firebase Storage
    const storageRef = storage.ref(); // Use the storage reference
    const modFolder = 'mods_folder'; // Replace with actual folder structure if needed
    const settingsFileRef = storageRef.child(`${modFolder}/settings.ini`);
    await settingsFileRef.putString(settingsContent);

    // Upload thumbnail image to Firebase Storage
    const thumbnailRef = storageRef.child(`${modFolder}/${thumbnail.name}`);
    await thumbnailRef.put(thumbnail);

    alert('Mod uploaded successfully!');
}

// Attach the upload function to a button or call it directly as needed
document.getElementById('uploadButton').addEventListener('click', uploadModSettings);
