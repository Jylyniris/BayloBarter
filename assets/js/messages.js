// Initialize Firebase App
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import {
  child,
  getDatabase,
  ref,
  set,
  onValue,
  onChildAdded,
  onChildChanged,
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
initializeApp(firebaseConfig);

const db = getDatabase();

const username = localStorage.getItem("fullname");
let selectedConversation = localStorage.getItem("selectedConversation"); // Default conversation for demonstration
// let lastConversation = localStorage.getItem("lastConversationId"); // Default conversation for demonstration

function updateSelectedConversationUI() {
  const chatMessagesContainer = document.querySelector(".chat-messages");
  chatMessagesContainer.innerHTML = "";

  const conversationRef = ref(
    db,
    `conversations/${selectedConversation}/messages`
  );
  onChildAdded(conversationRef, (messageSnapshot) => {
    const messageKey = messageSnapshot.key;
    const messageData = messageSnapshot.val();
    const messageElement = createMessageElement(messageData, messageKey);
    chatMessagesContainer.appendChild(messageElement);
  });

  // Update the active class in the user list based on the selected conversation
  const listItems = document.querySelectorAll(".user-list .list-group-item");
  listItems.forEach((item) => {
    const itemConversation = item.getAttribute("data-conversation");
    if (itemConversation === selectedConversation) {
      item.classList.add("active");
    } else {
      item.classList.remove("active");
    }
  });
}

const userList = document.querySelector(".user-list");
userList.addEventListener("click", (e) => {
  // Check if the clicked element is a list item
  if (e.target.classList.contains("list-group-item")) {
    selectedConversation = e.target.getAttribute("data-conversation");
    localStorage.setItem("selectedConversation", selectedConversation);
    updateSelectedConversationUI();
    // updateActiveUserListItem(e.target);
  }
});

function initializeUserList() {
  const userList = document.querySelector(".user-list");
  const listItems = userList.querySelectorAll(".list-group-item");

  listItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      const selectedConversation = e.target.getAttribute("data-conversation");
      // localStorage.setItem("selectedConversation", selectedConversation);
      updateSelectedConversationUI();
      updateActiveUserListItem(e.target);
    });
  });
}

function updateActiveUserListItem(selectedItem) {
  const listItems = document.querySelectorAll(".user-list .list-group-item");
  listItems.forEach((item) => {
    item.classList.remove("active");
  });
  selectedItem.classList.add("active");
}

window.addEventListener("load", () => {
  // initializeUserList();
  updateSelectedConversationUI();
});

// Listen for changes in conversation when the page is already loaded
const currentUser = localStorage.getItem("uid");
const convoRef = ref(db, "conversations");

onChildChanged(convoRef, (snapshot) => {
  const userData = snapshot.val();
  const convoId = snapshot.key;

  console.log(userData.members.includes(currentUser));

  if (userData.members.includes(currentUser)) {
    updateSelectedConversationUI();
  }
});

// function updateActiveUserListItem(selectedItem) {
//   const listItems = document.querySelectorAll(".user-list .list-group-item");
//   listItems.forEach((item) => {
//     item.classList.remove("active");
//   });
//   selectedItem.classList.add("active");
// }

function createMessageElement(messageData, messageKey) {
  // Check if the message already exists in the UI
  const existingMessage = document.querySelector(
    `.message[data-message-id="${messageKey}"]`
  );

  if (existingMessage) {
    // Message already exists, no need to append it again
    return existingMessage;
  }

  const messageElement = document.createElement("div");
  messageElement.classList.add("message");
  messageElement.setAttribute("data-message-id", messageKey);

  const senderElement = document.createElement("strong");
  senderElement.textContent = `${
    messageData.sender === username ? "You" : messageData.sender
  }:`;
  messageElement.appendChild(senderElement);

  const messageContentElement = document.createElement("span");
  messageContentElement.classList.add("mx-2");
  messageContentElement.textContent = messageData.content;
  messageElement.appendChild(messageContentElement);

  const timestampElement = document.createElement("span");
  timestampElement.classList.add("message-time");
  timestampElement.textContent = formatTimestamp(messageData.timestamp);
  messageElement.appendChild(timestampElement);

  if (messageData.sender === username) {
    messageElement.classList.add("text-end");
  }

  return messageElement;
}

function formatTimestamp(timestamp) {
  const date = new Date(timestamp);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const formattedTime = `${hours}:${minutes.toString().padStart(2, "0")}`;
  return formattedTime;
}

// Send message on button click
const sendButton = document.getElementById("sendButton");
sendButton.addEventListener("click", () => {
  const messageInput = document.querySelector(".chat-input input");
  const message = messageInput.value.trim();

  if (message) {
    const newMessage = {
      sender: localStorage.getItem("fullname"),
      content: message,
      timestamp: Date.now(),
    };

    const conversationRef = ref(
      db,
      `conversations/${selectedConversation}/messages`
    );
    const newConversationsRef = push(conversationRef);
    set(newConversationsRef, newMessage)
      .then(() => {
        console.log("Send successfully!");
      })
      .catch((error) => {
        console.error(
          "Error creating message in Firebase Realtime Database:",
          error
        );
      });

    // Clear the input field and update the UI
    messageInput.value = "";
    updateSelectedConversationUI();
  }
});

// Initialize UI with selected conversation
// updateSelectedConversationUI();

function getCurrentUser() {
  const db = getDatabase();
  const usersRef = ref(db, "users");
  const currentUser = localStorage.getItem("uid");

  onValue(usersRef, (snapshot) => {
    snapshot.forEach((userSnapshot) => {
      const userData = userSnapshot.val();
      const uid = userSnapshot.key;

      if (uid === currentUser) {
        const fname = userData.firstname;
        const lname = userData.lastname;

        document.getElementById("user").innerHTML = fname + " " + lname;
      }
    });
  });
}

window.addEventListener("load", getCurrentUser);

function getConversationLists() {
  const db = getDatabase();
  const convoRef = ref(db, "conversations");

  const currentUser = localStorage.getItem("uid");

  onValue(convoRef, (snapshot) => {
    const userLists = [];
    let isFirstItem = true;

    snapshot.forEach((userSnapshot) => {
      const userData = userSnapshot.val();
      const convoId = userSnapshot.key;
      const itemId = userData.item_id;

      // Check if the current user is present in the conversation members
      if (userData.members.includes(currentUser)) {
        const mainUser = userData.members[0];
        const chattingWithUserId = userData.members[1];

        // Display conversation list for both users involved
        if (mainUser === currentUser) {
          const chattingWithUserRef = ref(db, `users/${chattingWithUserId}`);
          onValue(chattingWithUserRef, (userSnapshot) => {
            const chattingWithUser =
              userSnapshot.val().firstname + " " + userSnapshot.val().lastname;

            // Fetch item data based on itemId
            const itemRef = ref(db, `items/${itemId}`);
            onValue(itemRef, (itemSnapshot) => {
              const itemName = itemSnapshot.val().item_name;

              userLists.push(`
              <li class="list-group-item ${
                isFirstItem ? "active" : ""
              }" data-conversation="${convoId}">${chattingWithUser} - ${itemName}</li>
            `);

              // Store the data-conversation attribute to localStorage if it's the first item
              if (isFirstItem) {
                localStorage.setItem("selectedConversation", convoId);
                isFirstItem = false; // Set isFirstItem to false after storing
              }

              // Update the mainContainer with the accumulated user list
              const mainContainer = document.getElementById("userLists");
              mainContainer.innerHTML = userLists.join("");
            });
          });
        } else if (chattingWithUserId === currentUser) {
          const mainUserRef = ref(db, `users/${mainUser}`);
          onValue(mainUserRef, (userSnapshot) => {
            const mainUser =
              userSnapshot.val().firstname + " " + userSnapshot.val().lastname;

            // Fetch item data based on itemId
            const itemRef = ref(db, `items/${itemId}`);
            onValue(itemRef, (itemSnapshot) => {
              const itemName = itemSnapshot.val().item_name;

              userLists.push(`
              <li class="list-group-item ${
                isFirstItem ? "active" : ""
              }" data-conversation="${convoId}">${mainUser} - ${itemName}</li>
            `);

              // Store the data-conversation attribute to localStorage if it's the first item
              if (isFirstItem) {
                localStorage.setItem("selectedConversation", convoId);
                isFirstItem = false; // Set isFirstItem to false after storing
              }

              // Update the mainContainer with the accumulated user list
              const mainContainer = document.getElementById("userLists");
              mainContainer.innerHTML = userLists.join("");
            });
          });
        }
      }
    });
  });
}

window.addEventListener("load", getConversationLists);
