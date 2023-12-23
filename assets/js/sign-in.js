// Initialize Firebase App
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import {
  getDatabase,
  ref,
  set,
  onValue,
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDStoShvcGlg2vbt6rfV0DfhNI3ez6T6dc",
  authDomain: "baylo-39b7f.firebaseapp.com",
  databaseURL:
    "https://baylo-39b7f-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "baylo-39b7f",
  storageBucket: "baylo-39b7f.appspot.com",
  messagingSenderId: "510985562452",
  appId: "1:510985562452:web:587577ffbdda592e15c0c1",
  measurementId: "G-88GTXK5WKR",
};

// Initialize Firebase
initializeApp(firebaseConfig);

// Handle sign up form submission
// const signinForm = document.getElementById("signinForm");
// signinForm.addEventListener("submit", async (event) => {
//   event.preventDefault();

//   const email = document.getElementById("email").value;
//   const password = document.getElementById("password").value;

//   const emailError = document.getElementById("emailError");
//   const passwordError = document.getElementById("passwordError");
//   const invalidCredentialsError = document.getElementById(
//     "invalidCredentialsError"
//   );

//   const errors = {};

//   // Validate email
//   if (!email) {
//     emailError.classList.remove("d-none");
//     emailError.textContent = "Please enter an email address.";
//     errors.email = "Please enter an email address.";
//   } else {
//     emailError.classList.add("d-none");
//     emailError.textContent = "";
//   }

//   // Validate password
//   if (!password) {
//     passwordError.classList.remove("d-none");
//     passwordError.textContent = "Please enter a password.";
//     errors.password = "Please enter a password.";
//   } else {
//     passwordError.classList.add("d-none");
//     passwordError.textContent = "";
//   }

//   // Check for errors
//   const hasErrors = Object.values(errors).some((error) => error !== "");

//   if (hasErrors) {
//     return; // Prevent data creation if errors exist
//   }

//   const db = getDatabase();
//   const usersRef = ref(db, "users");

//   let userID = "";

//   onValue(usersRef, (snapshot) => {
//     snapshot.forEach((userSnapshot) => {
//       const userData = userSnapshot.val();
//       const uid = userSnapshot.key;
//       const fname = userData.firstname;
//       const lname = userData.lastname;
//       const emailAddress = userData.email;
//       const passwordData = userData.password;

//       if (emailAddress === email && passwordData === password) {
//         console.log("User successfully signed in:", uid);

//         localStorage.setItem("uid", uid);
//         localStorage.setItem("fullname", fname + " " + lname);

//         getConversationLists();

//         const toast = new bootstrap.Toast(
//           document.getElementById("signinSuccessToast")
//         );
//         toast.show();

//         setTimeout(() => {
//           toast.hide();
//           window.location.href = "dashboard.html";
//         }, 2000);
//         return;
//       }
//     });

//     // Handle invalid credentials scenario
//     if (userID === "") {
//       console.error("Invalid email or password.");
//       invalidCredentialsError.classList.remove("d-none"); // Display error message
//     }
//   });
// });

const signinForm = document.getElementById("signinForm");
signinForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const emailError = document.getElementById("emailError");
  const passwordError = document.getElementById("passwordError");
  const invalidCredentialsError = document.getElementById(
    "invalidCredentialsError"
  );

  const errors = {};

  // Validate email
  if (!email) {
    emailError.classList.remove("d-none");
    emailError.textContent = "Please enter an email address.";
    errors.email = "Please enter an email address.";
  } else {
    emailError.classList.add("d-none");
    emailError.textContent = "";
  }

  // Validate password
  if (!password) {
    passwordError.classList.remove("d-none");
    passwordError.textContent = "Please enter a password.";
    errors.password = "Please enter a password.";
  } else {
    passwordError.classList.add("d-none");
    passwordError.textContent = "";
  }

  // Check for errors
  const hasErrors = Object.values(errors).some((error) => error !== "");

  if (hasErrors) {
    return; // Prevent data creation if errors exist
  }

  const db = getDatabase();
  const usersRef = ref(db, "users");

  let userFound = false;

  onValue(usersRef, (snapshot) => {
    snapshot.forEach((userSnapshot) => {
      const userData = userSnapshot.val();
      const uid = userSnapshot.key;
      const fname = userData.firstname;
      const lname = userData.lastname;
      const emailAddress = userData.email;
      const passwordData = userData.password;

      if (emailAddress === email) {
        userFound = true;

        if (passwordData === password) {
          console.log("User successfully signed in:", uid);

          localStorage.setItem("uid", uid);
          localStorage.setItem("fullname", fname + " " + lname);

          getConversationLists();

          const toast = new bootstrap.Toast(
            document.getElementById("signinSuccessToast")
          );
          toast.show();

          setTimeout(() => {
            toast.hide();
            window.location.href = "dashboard.html";
          }, 2000);
        } else {
          // Incorrect password
          console.error("Incorrect password.");
          invalidCredentialsError.classList.remove("d-none");
          invalidCredentialsError.textContent = "Incorrect password.";
        }

        return;
      }
    });

    // Handle non-existing email
    if (!userFound) {
      console.error("Email address not found.");
      invalidCredentialsError.classList.remove("d-none");
      invalidCredentialsError.textContent = "Email address not found.";
    }
  });
});


function getConversationLists() {
  const db = getDatabase();
  const convoRef = ref(db, "test");

  const currentUser = localStorage.getItem("uid");

  onValue(convoRef, (snapshot) => {
    let isFirstItem = true;

    snapshot.forEach((userSnapshot) => {
      const userData = userSnapshot.val();
      const convoId = userSnapshot.key;

      // Check if the current user is present in the conversation members
      if (userData.members.includes(currentUser)) {
        const mainUser = userData.members[0];
        const chattingWithUserId = userData.members[1];

        // Display conversation list for both users involved
        if (mainUser === currentUser) {
          const chattingWithUserRef = ref(db, `users/${chattingWithUserId}`);
          onValue(chattingWithUserRef, (userSnapshot) => {
            // Store the data-conversation attribute to localStorage if it's the first item
            if (isFirstItem) {
              localStorage.setItem("selectedConversation", convoId);
              isFirstItem = false; // Set isFirstItem to false after storing
            }
          });
        } else if (chattingWithUserId === currentUser) {
          const mainUserRef = ref(db, `users/${mainUser}`);
          onValue(mainUserRef, (userSnapshot) => {
            // Store the data-conversation attribute to localStorage if it's the first item
            if (isFirstItem) {
              localStorage.setItem("selectedConversation", convoId);
              isFirstItem = false; // Set isFirstItem to false after storing
            }
          });
        }
      }
    });
  });
}
