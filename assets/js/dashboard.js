// /* globals Chart:false */

// (() => {
//   ("use strict");

//   // Graphs
//   const ctx = document.getElementById("myChart");
//   // eslint-disable-next-line no-unused-vars
//   const myChart = new Chart(ctx, {
//     type: "bar",
//     data: {
//       labels: [
//         "Clothing & Accessories",
//         "Electronics",
//         "Home & Garden",
//         "Books & Music",
//         "Sports & Leisure",
//       ],
//       datasets: [
//         {
//           data: [10, 20, 3, 18, 7],
//           lineTension: 0,
//           backgroundColor: "#007bff",
//           borderColor: "#007bff",
//           borderWidth: 4,
//           pointBackgroundColor: "#007bff",
//         },
//       ],
//     },
//     options: {
//       plugins: {
//         legend: {
//           display: false,
//         },
//         tooltip: {
//           boxPadding: 3,
//         },
//       },
//     },
//   });

//   // Function to get a random color
//   function getRandomColor() {
//     const letters = "0123456789ABCDEF";
//     let color = "#";
//     for (let i = 0; i < 4; i++) {
//       color += letters[Math.floor(Math.random() * 16)];
//     }
//     return color;
//   }
// })();

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import {
  getDatabase,
  ref,
  get,
  child,
  onValue
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js";

(() => {
  "use strict";

  // Your Firebase configuration
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

  // Reference to the items in the Firebase Realtime Database
  const db = getDatabase();
  const itemsRef = ref(db, "items");

  // Fetch data from Firebase
  get(child(itemsRef, "/"))
    .then((snapshot) => {
      if (snapshot.exists()) {
        const jsonData = snapshot.val();

        // Extract categories and count occurrences
        const categories = Object.values(jsonData).reduce((acc, item) => {
          const category = item.item_category;
          acc[category] = (acc[category] || 0) + 1;
          return acc;
        }, {});

        // Graphs
        const ctx = document.getElementById("myChart");
        const myChart = new Chart(ctx, {
          type: "bar",
          data: {
            labels: Object.keys(categories),
            datasets: [
              {
                data: Object.values(categories),
                lineTension: 0,
                backgroundColor: "#007bff",
                borderColor: "#007bff",
                borderWidth: 4,
                pointBackgroundColor: "#007bff",
              },
            ],
          },
          options: {
            plugins: {
              legend: {
                display: false,
              },
              tooltip: {
                boxPadding: 3,
              },
            },
          },
        });
      } else {
        console.error("No data available.");
      }
    })
    .catch((error) => {
      console.error("Error fetching data from Firebase:", error);
    });
  
    const conversationsRef = ref(db, "conversations");

    // Fetch data from Firebase
    onValue(child(conversationsRef, "/"), (snapshot) => {
      if (snapshot.exists()) {
        const jsonData = snapshot.val();

        // Count conversations per item
        const itemCounts = {};
        Object.values(jsonData).forEach((conversation) => {
          const itemID = conversation.item_id;
          itemCounts[itemID] = (itemCounts[itemID] || 0) + 1;
        });

        // Reference to the items in the Firebase Realtime Database
        const itemsRef = ref(db, "items");

        // Fetch item names from Firebase
        get(child(itemsRef, "/"))
          .then((itemSnapshot) => {
            if (itemSnapshot.exists()) {
              const itemData = itemSnapshot.val();

              // Map item IDs to item names
              const itemNames = {};
              Object.entries(itemData).forEach(([itemID, itemInfo]) => {
                itemNames[itemID] = itemInfo.item_name;
              });

              // Sort items by conversation count in descending order
              const sortedItems = Object.keys(itemNames).sort(
                (a, b) => itemCounts[b] - itemCounts[a]
              );

              // Select top 10 items
              const topItems = sortedItems.slice(0, 10);

              // Map item names to conversation counts for top items
              const labels = topItems.map((itemID) => itemNames[itemID]);
              const values = topItems.map((itemID) => itemCounts[itemID] || 0);

              // Graphs
              const ctx = document.getElementById("popularItems");
              const conversationChart = new Chart(ctx, {
                type: "bar",
                data: {
                  labels: labels,
                  datasets: [
                    {
                      data: values,
                      lineTension: 0,
                      backgroundColor: "#28a745",
                      borderColor: "#28a745",
                      borderWidth: 4,
                      pointBackgroundColor: "#28a745",
                    },
                  ],
                },
                options: {
                  plugins: {
                    legend: {
                      display: false,
                    },
                    tooltip: {
                      boxPadding: 3,
                    },
                  },
                },
              });
            } else {
              console.error("No item data available.");
            }
          })
          .catch((error) => {
            console.error("Error fetching item data from Firebase:", error);
          });
      } else {
        console.error("No conversations data available.");
      }
    });
})();
