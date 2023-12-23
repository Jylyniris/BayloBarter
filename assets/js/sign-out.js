const signoutButton = document.getElementById("signoutButton");
signoutButton.addEventListener("click", signout);

function signout() {
  // Remove the user's email from local storage
  // localStorage.removeItem("uid");
  // localStorage.removeItem("userEmail");
  localStorage.clear();

  // Redirect the user to the login page
  window.location.href = "sign-in.html";
}
