/*============================
     FIREBASE CONFIGURATION
=============================*/ 

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
apiKey: "AIzaSyAHY5IvTUL14aPUi-YV7xFfwE_yGwoN-js",
authDomain: "task-master-e14a8.firebaseapp.com",
projectId: "task-master-e14a8",
storageBucket: "task-master-e14a8.appspot.com",
messagingSenderId: "20302403336",
appId: "1:20302403336:web:c275107446e2f0aab5febd",
measurementId: "G-3B8RV8B19X"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const fs = firebase.firestore();