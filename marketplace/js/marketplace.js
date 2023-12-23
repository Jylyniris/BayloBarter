// Initialize Firebase App
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-storage.js";
import {
  getDatabase,
  ref,
  set,
  onValue,
  push,
  get,
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
const app = initializeApp(firebaseConfig);
// Initialize Cloud Storage and get a reference to the service
const storage = getStorage(app);

function displayMarketplaceData() {
  const db = getDatabase();
  const itemsRef = ref(db, "items");
  const productContainer = document.getElementById("productContainer");
  const noDataMessage = document.getElementById("noDataMessage");
  const categoryFilter = document.getElementById("categoryFilter");
  const currentUser = localStorage.getItem("uid");

  onValue(itemsRef, (snapshot) => {
    productContainer.innerHTML = ""; // Clear existing products
    let hasData = false;

    snapshot.forEach((itemSnapshot) => {
      const itemData = itemSnapshot.val();

      // Skip items added by the current user
      if (itemData && itemData.item_owner === currentUser) {
        return;
      }

      // Check if a category filter is selected
      const selectedCategory = categoryFilter.value.toLowerCase(); // Ensure case-insensitivity
      const itemCategory = itemData.item_category.toLowerCase(); // Ensure case-insensitivity

      if (selectedCategory !== "all" && itemCategory !== selectedCategory) {
        return; // Skip items that don't match the selected category
      }

      // Parse the timestamp into a Date object
      const date = new Date(itemData.item_timestamp);

      // Create an options object for formatting
      const options = { month: "short", day: "numeric", year: "numeric" };

      // Format the date
      const formattedDate = new Intl.DateTimeFormat("en-US", options).format(
        date
      );

      // Retrieve user data using once (to fetch it only once)
      const itemOwner = itemData.item_owner;
      const usersRef = ref(db, `users/${itemOwner}`);

      get(usersRef).then((userSnapshot) => {
        const userData = userSnapshot.val();
        if (userData) {
          const fullName = `${userData.firstname} ${userData.lastname}`;

          // Create HTML elements for each product
          const productCard = document.createElement("div");
          productCard.classList.add("col");
          productCard.innerHTML = `
            <div class="card shadow-sm" data-itemid="${itemSnapshot.key}" data-ownerid="${itemOwner}">
              <img src="${itemData.item_image}" alt="${itemData.item_name}" class="img-fluid" style="height: 400px; object-fit: cover; width: 100%">
              <div class="card-body">
                <p class="card-text fw-bold m-0">${itemData.item_name} <span class="badge text-bg-success text-capitalize">${itemData.item_category}</span></p>
                <p><i><small> By: ${fullName}</small></i></p>
                <div class="d-flex justify-content-between align-items-center">
                  <button type="button" class="btn btn-primary trade-item">Trade this item</button>
                  <i><small class="text-body-secondary">Date Posted: ${formattedDate}</small></i>
                </div>
              </div>
            </div>
          `;

          // Append the product card to the container
          productContainer.appendChild(productCard);
        }
      });

      hasData = true;
    });

    // Display message when no data is found
    if (!hasData) {
      noDataMessage.style.display = "block";
    } else {
      noDataMessage.style.display = "none";
    }
  });
}

// Event listener for category filter change
const categoryFilter = document.getElementById("categoryFilter");
categoryFilter.addEventListener("change", displayMarketplaceData);

window.addEventListener("load", displayMarketplaceData);

document.addEventListener("click", (event) => {
  const tradeItemBtn = event.target.closest(".trade-item");
  if (tradeItemBtn) {
    const itemCard = tradeItemBtn.closest(".card");
    const itemOwner = itemCard.dataset.ownerid;
    const itemId = itemCard.dataset.itemid;

    console.log(itemOwner, itemId);
    tradeItem(itemOwner, itemId);
  }
});

function tradeItem(ownerId, itemId) {
  const db = getDatabase();
  const conversationsRef = ref(db, "conversations");

  const loggedInUser = localStorage.getItem("uid");

  const conversations = {
    members: [loggedInUser, ownerId],
    item_id: itemId,
    messages: {},
  };

  const newConversationsRef = push(conversationsRef);
  const newConversationsKey = newConversationsRef.key;
  set(newConversationsRef, conversations)
    .then(() => {
      console.log("Conversations created successfully");
      // Store the key in localStorage
      localStorage.setItem("selectedConversation", newConversationsKey);
      window.location.href = "messages.html";
    })
    .catch((error) => {
      console.error(
        "Error creating conversations in Firebase Realtime Database:",
        error
      );
    });
}
