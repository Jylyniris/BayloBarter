// Check if the key does not exist in localStorage
if (!localStorage.getItem("uid")) {
  // Redirect to a specific page
  window.location.href = "sign-in.html";
}

// Retrieve user information from localStorage
const userFullName = localStorage.getItem("fullname");

// Update the welcome message
const welcomeMessage = document.getElementById("welcomeMessage");
if (userFullName) {
  welcomeMessage.textContent = `Welcome, ${userFullName}`;
}
