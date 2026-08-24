document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  setupMenu();
  setupCartButtons();
  setupShopFilters();
  setupNewsletter();
});

function getCart() {
  return JSON.parse(localStorage.getItem("cart") || "[]");
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  const count = getCart().reduce((sum, item) => sum + (item.quantity || 1), 0);
  document.querySelectorAll("#cart-count").forEach(el => el.textContent = count);
}

function setupCartButtons() {
  document.querySelectorAll(".cart-btn").forEach(button => {
    button.addEventListener("click", () => {
      const card = button.closest(".product-card");
      const product = {
        name: card.dataset.name,
        price: Number(card.dataset.price),
        image: card.dataset.image,
        quantity: 1
      };

      const cart = getCart();
      const existing = cart.find(item => item.name === product.name);

      if (existing) {
        existing.quantity += 1;
      } else {
        cart.push(product);
      }

      saveCart(cart);
      button.textContent = "✓ Added";
      button.classList.add("added");
      showToast(`${product.name} added to cart`);

      setTimeout(() => {
        button.textContent = "Add to Cart";
        button.classList.remove("added");
      }, 1200);
    });
  });
}

function setupShopFilters() {
  const search = document.getElementById("search");
  const category = document.getElementById("category");
  const sort = document.getElementById("sort");
  if (!search || !category || !sort) return;

  const update = () => {
    const cards = [...document.querySelectorAll("#shop-products .product-card")];
    const term = search.value.trim().toLowerCase();
    const cat = category.value;

    cards.sort((a, b) => {
      if (sort.value === "low") return Number(a.dataset.price) - Number(b.dataset.price);
      if (sort.value === "high") return Number(b.dataset.price) - Number(a.dataset.price);
      if (sort.value === "rating") return Number(b.dataset.rating) - Number(a.dataset.rating);
      return 0;
    });

    const container = document.getElementById("shop-products");
    cards.forEach(card => container.appendChild(card));

    let shown = 0;
    cards.forEach(card => {
      const matchesName = card.dataset.name.toLowerCase().includes(term);
      const matchesCategory = cat === "all" || card.dataset.category === cat;
      const visible = matchesName && matchesCategory;
      card.style.display = visible ? "" : "none";
      if (visible) shown++;
    });

    const count = document.getElementById("result-count");
    if (count) count.textContent = `${shown} product${shown === 1 ? "" : "s"} found`;
    document.getElementById("no-results")?.classList.toggle("hidden", shown !== 0);
  };

  search.addEventListener("input", update);
  category.addEventListener("change", update);
  sort.addEventListener("change", update);
  update();
}

function setupNewsletter() {
  const form = document.getElementById("newsletter-form");
  if (!form) return;
  form.addEventListener("submit", e => {
    e.preventDefault();
    document.getElementById("newsletter-message").textContent = "You're subscribed! 🎉";
    form.reset();
  });
}

function setupMenu() {
  const button = document.getElementById("menu-btn");
  const nav = document.querySelector(".site-header nav");
  if (button && nav) button.addEventListener("click", () => nav.classList.toggle("open"));
}

function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 1800);
}
