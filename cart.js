// cart.js
import {
  initializeApp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import {
  getFirestore,
  collection,
  getDocs,
  query,
  where
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import {
  getAuth,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDpb1WrouTcU5p1qrm-PyChtVBofp8S6ZI",
  authDomain: "ecommercesite-504d5.firebaseapp.com",
  projectId: "ecommercesite-504d5",
  storageBucket: "ecommercesite-504d5.appspot.com",
  messagingSenderId: "539154564213",
  appId: "1:539154564213:web:82c160284871ed2cfb643c"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Check login
onAuthStateChanged(auth, async (user) => {
  const userInfo = document.getElementById("user-info");
  const loginLink = document.getElementById("login-link");
  const logoutLink = document.getElementById("logout-link");

  if (user) {
    if (userInfo) userInfo.textContent = `Logged in as: ${user.email}`;
    if (loginLink) loginLink.style.display = "none";
    if (logoutLink) logoutLink.style.display = "inline-block";

    loadCart(user.uid); // 🔑 Load cart
  } else {
    alert("🔒 Please log in to view your cart.");
    window.location.href = "login.html";
  }
});

// Logout link
const logoutLink = document.getElementById("logout-link");
if (logoutLink) {
  logoutLink.addEventListener("click", (e) => {
    e.preventDefault();
    signOut(auth).then(() => {
      alert("🚪 Logged out!");
      window.location.href = "login.html";
    });
  });
}

// Load cart items
async function loadCart(userId) {
  const cartContainer = document.getElementById("cart-container");
  try {
    const q = query(collection(db, "carts"), where("userId", "==", userId));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      cartContainer.innerHTML = "<p>Your cart is empty.</p>";
      return;
    }

    let html = "";
    snapshot.forEach(doc => {
      const item = doc.data();
      html += `
        <div class="cart-item">
          <img src="${item.image}" alt="${item.name}" width="80"/>
          <div>
            <h3>${item.name}</h3>
            <p>Price: ₹${item.price}</p>
            <p>Qty: ${item.quantity}</p>
            <p>Total: ₹${item.price * item.quantity}</p>
          </div>
        </div>
        <hr/>
      `;
    });

    cartContainer.innerHTML = html;

  } catch (error) {
    console.error("❌ Error loading cart:", error);
    cartContainer.innerHTML = "<p>Failed to load cart items.</p>";
  }
}
