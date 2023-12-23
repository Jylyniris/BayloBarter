// Initialize Firebase App
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import {
  getDatabase,
  ref,
  set,
  onValue,
  push,
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
const signupForm = document.getElementById("signupForm");
signupForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const firstname = document.getElementById("firstname").value;
  const lastname = document.getElementById("lastname").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  const firstnameError = document.getElementById("firstnameError");
  const lastnameError = document.getElementById("lastnameError");
  const emailError = document.getElementById("emailError");
  const passwordError = document.getElementById("passwordError");
  const confirmPasswordError = document.getElementById("confirmPasswordError");

  const errors = {};

  if (!firstname) {
    firstnameError.classList.remove("d-none");
    firstnameError.textContent = "Please enter your firstname.";
    errors.firstname = "Please enter your firstname.";
  } else {
    firstnameError.classList.add("d-none");
    firstnameError.textContent = "";
  }

  if (!lastname) {
    lastnameError.classList.remove("d-none");
    lastnameError.textContent = "Please enter your lastname.";
    errors.lastname = "Please enter your lastname.";
  } else {
    lastnameError.classList.add("d-none");
    lastnameError.textContent = "";
  }

  if (!email) {
    emailError.classList.remove("d-none");
    emailError.textContent = "Please enter an email address.";
    errors.email = "Please enter an email address.";
  } else if (checkEmailExistence(email) === true) {
    emailError.classList.remove("d-none");
    emailError.textContent = "Email address already exists.";
    errors.email = "Email address already exists.";
  } else {
    emailError.classList.add("d-none");
    emailError.textContent = "";
  }

  if (!password) {
    passwordError.classList.remove("d-none");
    passwordError.textContent = "Please enter a password.";
    errors.password = "Please enter a password.";
  } else if (password.length < 6) {
    passwordError.classList.remove("d-none");
    passwordError.textContent = "Password must be at least 6 characters long.";
    errors.password = "Password must be at least 6 characters long.";
  } else {
    passwordError.classList.add("d-none");
    passwordError.textContent = "";
  }

  if (!confirmPassword) {
    confirmPasswordError.classList.remove("d-none");
    confirmPasswordError.textContent = "Please enter your confirm password.";
    errors.confirmPassword = "Please enter your confirm password.";
  } else if (confirmPassword !== password) {
    confirmPasswordError.classList.remove("d-none");
    confirmPasswordError.textContent = "Passwords do not match.";
    errors.confirmPassword = "Passwords do not match.";
  } else {
    confirmPasswordError.classList.add("d-none");
    confirmPasswordError.textContent = "";
  }

  const hasErrors = Object.values(errors).some((error) => error !== "");

  if (hasErrors) {
    return;
  }

  const db = getDatabase();

  const user = {
    firstname: firstname,
    lastname: lastname,
    email: email,
    password: password,
  };

  let registrationSuccess = true;

  const usersRef = ref(db, "users");
  const newUserRef = push(usersRef);
  set(newUserRef, user)
    .then(() => {
      console.log("User successfully registered");
      signupForm.reset();
    })
    .catch((error) => {
      console.error(
        "Error creating user in Firebase Realtime Database:",
        error
      );
      registrationSuccess = false;
    })
    .finally(() => {
      if (registrationSuccess) {
        const toast = new bootstrap.Toast(
          document.getElementById("signupSuccessToast")
        );
        toast.show();

        setTimeout(() => {
          toast.hide();
          window.location.href = "sign-in.html";
        }, 2000);
      }
    });
});

function checkEmailExistence(email) {
  const db = getDatabase();
  const usersRef = ref(db, "users");

  let emailExists = false;

  onValue(usersRef, (snapshot) => {
    snapshot.forEach((userSnapshot) => {
      const userData = userSnapshot.val();
      const uid = userSnapshot.key;
      const emailAddress = userData.email;

      if (emailAddress === email) {
        emailExists = true;
        return;
      }
    });
  });

  return emailExists;
}
checkEmailExistence(email);
