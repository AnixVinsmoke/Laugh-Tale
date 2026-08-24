document.addEventListener("DOMContentLoaded", renderCart);

function getCart() {
  return JSON.parse(localStorage.getItem("cart") || "[]");
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function money(value) {
  return "₹" + Number(value).toLocaleString("en-IN");
}

function renderCart() {
  const cart = getCart();
  const items = document.getElementById("cart-items");
  const empty = document.getElementById("cart-empty");
  const layout = document.getElementById("cart-layout");

  document.querySelector("#cart-count").textContent = cart.reduce((s, i) => s + i.quantity, 0);

  if (!cart.length) {
    empty.classList.remove("hidden");
    layout.classList.add("hidden");
    return;
  }

  empty.classList.add("hidden");
  layout.classList.remove("hidden");

  items.innerHTML = cart.map((item, index) => `
    <article class="cart-item">
      <img src="${item.image}" alt="${item.name}">
      <div class="cart-details">
        <p class="product-category">FASHION STORE</p>
        <h3>${item.name}</h3>
        <strong>${money(item.price)}</strong>
        <div class="quantity">
          <button data-action="minus" data-index="${index}">−</button>
          <span>${item.quantity}</span>
          <button data-action="plus" data-index="${index}">+</button>
        </div>
      </div>
      <button class="remove-btn" data-action="remove" data-index="${index}">Remove</button>
    </article>
  `).join("");

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const delivery = 50;
  document.getElementById("subtotal").textContent = money(subtotal);
  document.getElementById("delivery").textContent = money(delivery);
  document.getElementById("total-price").textContent = money(subtotal + delivery);

  items.querySelectorAll("[data-action]").forEach(btn => {
    btn.addEventListener("click", () => {
      const i = Number(btn.dataset.index);
      const action = btn.dataset.action;
      if (action === "plus") cart[i].quantity++;
      if (action === "minus") cart[i].quantity--;
      if (action === "remove" || cart[i].quantity <= 0) cart.splice(i, 1);
      saveCart(cart);
      renderCart();
    });
  });

  document.getElementById("checkout-btn").onclick = () => {
    if (getCart().length) location.href = "checkout.html";
  };
}
