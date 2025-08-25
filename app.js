// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  setDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDpb1WrouTcU5p1qrm-PyChtVBofp8S6ZI",
  authDomain: "ecommercesite-504d5.firebaseapp.com",
  projectId: "ecommercesite-504d5",
  storageBucket: "ecommercesite-504d5.appspot.com",
  messagingSenderId: "539154564213",
  appId: "1:539154564213:web:82c160284871ed2cfb643c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Show logged-in user
onAuthStateChanged(auth, (user) => {
  const userInfo = document.getElementById("user-info");
  const loginLink = document.getElementById("login-link");
  const logoutLink = document.getElementById("logout-link"); // link instead of button

  if (user) {
    if (userInfo) userInfo.textContent = `Logged in as: ${user.email}`;
    if (loginLink) loginLink.style.display = "none";
    if (logoutLink) logoutLink.style.display = "inline-block";
  } else {
    if (userInfo) userInfo.textContent = "";
    if (loginLink) loginLink.style.display = "inline-block";
    if (logoutLink) logoutLink.style.display = "none";
  }
});

// Handle logout link click
const logoutLink = document.getElementById("logout-link");
if (logoutLink) {
  logoutLink.addEventListener("click", (e) => {
    e.preventDefault(); // prevent page reload
    signOut(auth).then(() => {
      alert("🚪 Logged out!");
      location.reload();
    }).catch((error) => {
      console.error("Logout error:", error);
    });
  });
}

// Load and display products from Firestore
async function loadProducts() {
  const productGrid = document.querySelector(".product-grid");

  if (!productGrid) {
    console.error("❌ .product-grid element not found in HTML!");
    return;
  }

  try {
    const snapshot = await getDocs(collection(db, "products"));
    productGrid.innerHTML = "";

    if (snapshot.empty) {
      productGrid.innerHTML = "<p>No products found.</p>";
      return;
    }

    snapshot.forEach((doc) => {
      const data = doc.data();

      const productCard = document.createElement("div");
      productCard.className = "product-card";
productCard.innerHTML = `
 
  <img src="${data.image}" alt="${data.name}" />
  <h3>${data.name}</h3>
  <p>₹${data.price}</p>
<button onclick='addToCart({
  id: "${doc.id}",
  name: "${data.name}",
  price: ${data.price},
  image: "${data.image}"
})'>Add to Cart</button>

`;

      productGrid.appendChild(productCard);
    });
  } catch (error) {
    console.error("🔥 Error loading products:", error);
  }
}

// Add to cart (localStorage)


// Load products on page load
loadProducts();
function decreaseQty() {
  const qtyInput = document.getElementById("quantity");
  let current = parseInt(qtyInput.value);
  if (current > 1) {
    qtyInput.value = current - 1;
  }
}

function increaseQty() {
  const qtyInput = document.getElementById("quantity");
  let current = parseInt(qtyInput.value);
  if (current < 10) {
    qtyInput.value = current + 1;
  }
}
// ✅ Add to Cart Function
function addToCart(product) {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const cartItemRef = doc(db, "carts", `${user.uid}_${product.id}`);
      try {
        await setDoc(cartItemRef, {
          userId: user.uid,
          productId: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: 1
        });
        alert("🛒 Product added to cart!");
      } catch (error) {
        console.error("Error adding to cart: ", error);
        alert("❌ Failed to add to cart. Try again.");
      }
    } else {
      alert("🔒 Please login to add items to your cart.");
      window.location.href = "login.html";
    }
  });
}

// ⬇️ Make it available to inline onclick
window.addToCart = addToCart;
