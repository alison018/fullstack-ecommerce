const productsData = [
  {
    id: 1,
    name: "Coffee Beans",
    country: "Colombia",
    price: 5.99,
    image: "assetsimagescarouselaji.jpg",
  },
  {
    id: 2,
    name: "Panela",
    country: "Panama",
    price: 4.99,
    image: "assetsimagescarouselmate.webp",
  },
  {
    id: 3,
    name: "Cachaça",
    country: "Brazil",
    price: 12.49,
    image: "assetsimagescarousel\tortillas.jpg",
  },
  {
    id: 4,
    name: "Quinoa",
    country: "Peru",
    price: 6.99,
    image: "assets/images/carousel/71uFt8fBQ-L.jpg",
  },
  {
    id: 5,
    name: "Mate Tea",
    country: "Argentina",
    price: 7.99,
    image: "assets/images/carousel/71uFt8fBQ-L.jpg",
  },
];

if (!localStorage.getItem("products")) {
  localStorage.setItem("products", JSON.stringify(productsData));
}

if (!localStorage.getItem("cart")) {
  localStorage.setItem("cart", JSON.stringify([]));
}

let products = JSON.parse(localStorage.getItem("products"));
let cart = JSON.parse(localStorage.getItem("cart"));

const productList = document.getElementById("product-list");
const cartItemsContainer = document.getElementById("cart-items");
const totalAmountElement = document.getElementById("total-amount");
const searchBar = document.getElementById("search-bar");
const countryFilter = document.getElementById("country-filter");
const sortFilter = document.getElementById("sort-filter");
const checkoutButton = document.getElementById("checkout-button");

function renderProducts(filteredProducts) {
  productList.innerHTML = "";

  if (filteredProducts.length === 0) {
    productList.innerHTML = "<p>No products found.</p>";
    return;
  }

  filteredProducts.forEach((product) => {
    const productCard = document.createElement("div");
    productCard.classList.add("product-card");

    productCard.innerHTML = `
        <img src="${product.image}" alt="${product.name}" class="product-image">
        <h3 class="product-name">${product.name}</h3>
        <p class="product-country"><strong>Country:</strong> ${
          product.country
        }</p>
        <p class="product-price">&euro;${product.price.toFixed(2)}</p>
        <button class="add-to-cart-btn" data-id="${
          product.id
        }">Add to Cart</button>
      `;

    productList.appendChild(productCard);
  });
}

function renderCart() {
  cartItemsContainer.innerHTML = "";

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
    totalAmountElement.textContent = "0.00";
    return;
  }

  cart.forEach((item) => {
    const cartItem = document.createElement("div");
    cartItem.classList.add("cart-item");

    cartItem.innerHTML = `
        <img src="${item.image}" alt="${item.name}" class="cart-item-image">
        <div class="cart-item-details">
          <h4>${item.name}</h4>
          <p>&euro;${item.price.toFixed(2)}</p>
          <input type="number" min="1" value="${
            item.quantity
          }" class="cart-item-quantity" data-id="${item.id}">
          <button class="remove-item-btn" data-id="${item.id}">Remove</button>
        </div>
      `;

    cartItemsContainer.appendChild(cartItem);
  });

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  totalAmountElement.textContent = total.toFixed(2);
}

function addToCart(id) {
  const product = products.find((p) => p.id === id);
  const cartItem = cart.find((item) => item.id === id);

  if (cartItem) {
    cartItem.quantity += 1;
  } else {
    cart.push({
      ...product,
      quantity: 1,
    });
  }

  updateLocalStorage();
  renderCart();
}

function removeFromCart(id) {
  cart = cart.filter((item) => item.id !== id);
  updateLocalStorage();
  renderCart();
}

function updateQuantity(id, quantity) {
  const cartItem = cart.find((item) => item.id === id);
  if (cartItem) {
    cartItem.quantity = quantity;
    if (cartItem.quantity < 1) {
      removeFromCart(id);
    }
    updateLocalStorage();
    renderCart();
  }
}

function updateLocalStorage() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function applyFilters() {
  let filteredProducts = [...products];

  const selectedCountry = countryFilter.value;
  if (selectedCountry) {
    filteredProducts = filteredProducts.filter(
      (product) => product.country === selectedCountry
    );
  }

  const query = searchBar.value.toLowerCase();
  if (query) {
    filteredProducts = filteredProducts.filter((product) =>
      product.name.toLowerCase().includes(query)
    );
  }

  const sortValue = sortFilter.value;
  if (sortValue === "asc") {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortValue === "desc") {
    filteredProducts.sort((a, b) => b.price - a.price);
  }

  renderProducts(filteredProducts);
}

productList.addEventListener("click", (e) => {
  if (e.target.classList.contains("add-to-cart-btn")) {
    const id = parseInt(e.target.getAttribute("data-id"));
    addToCart(id);
  }
});

cartItemsContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("remove-item-btn")) {
    const id = parseInt(e.target.getAttribute("data-id"));
    removeFromCart(id);
  }
});

cartItemsContainer.addEventListener("change", (e) => {
  if (e.target.classList.contains("cart-item-quantity")) {
    const id = parseInt(e.target.getAttribute("data-id"));
    const quantity = parseInt(e.target.value);
    if (isNaN(quantity) || quantity < 1) {
      e.target.value = 1;
      updateQuantity(id, 1);
    } else {
      updateQuantity(id, quantity);
    }
  }
});

searchBar.addEventListener("input", applyFilters);

countryFilter.addEventListener("change", applyFilters);

sortFilter.addEventListener("change", applyFilters);

checkoutButton.addEventListener("click", () => {
  if (cart.length === 0) {
    alert("Your cart is empty.");
    return;
  }

  alert("Thank you for your purchase!");
  cart = [];
  updateLocalStorage();
  renderCart();
});

document.addEventListener("DOMContentLoaded", () => {
  applyFilters();
  renderCart();
});
