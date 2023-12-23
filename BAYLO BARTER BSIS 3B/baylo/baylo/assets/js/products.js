// import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
// import {
//   child,
//   getDatabase,
//   ref,
//   set,
//   onValue,
//   onChildAdded,
//   push,
// } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js";

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyDStoShvcGlg2vbt6rfV0DfhNI3ez6T6dc",
//   authDomain: "baylo-39b7f.firebaseapp.com",
//   databaseURL:
//     "https://baylo-39b7f-default-rtdb.asia-southeast1.firebasedatabase.app",
//   projectId: "baylo-39b7f",
//   storageBucket: "baylo-39b7f.appspot.com",
//   messagingSenderId: "510985562452",
//   appId: "1:510985562452:web:587577ffbdda592e15c0c1",
//   measurementId: "G-88GTXK5WKR",
// };

// // Initialize Firebase
// initializeApp(firebaseConfig);

// const db = getDatabase();

// const tradeProduct = document.getElementById("trade");
// tradeProduct.addEventListener("click", () => {
//   const conversationsRef = ref(db, "test");

//   const productOwner = "-NlIGpSJafiTpwoJklP_";
//   const loggedInUser = localStorage.getItem("uid");

//   const conversations = {
//     members: [loggedInUser, productOwner],
//     messages: {},
//   };

//   const newConversationsRef = push(conversationsRef);
//   set(newConversationsRef, conversations)
//     .then(() => {
//       console.log("Conversations created successfully");
//     })
//     .catch((error) => {
//       console.error(
//         "Error creating conversations in Firebase Realtime Database:",
//         error
//       );
//     });
// });
