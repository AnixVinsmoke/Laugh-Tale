document.addEventListener("DOMContentLoaded", () => {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (!cart.length) {
    location.href = "shirts.html";
    return;
  }

  document.getElementById("cart-count").textContent = cart.reduce((s, i) => s + i.quantity, 0);
  document.getElementById("checkout-subtotal").textContent = "₹" + subtotal.toLocaleString("en-IN");
  document.getElementById("checkout-total").textContent = "₹" + (subtotal + 50).toLocaleString("en-IN");

  document.getElementById("checkout-form").addEventListener("submit", e => {
    e.preventDefault();
    const orderId = "FS" + Math.floor(100000 + Math.random() * 900000);
    localStorage.removeItem("cart");
    document.body.innerHTML = `
      <main class="success-page">
        <div class="success-card">
          <div class="success-icon">✓</div>
          <p class="eyebrow">ORDER CONFIRMED</p>
          <h1>Thank you for your order!</h1>
          <p>Your demo order <strong>#${orderId}</strong> has been placed successfully.</p>
          <a href="index.html" class="primary-btn">Back to Home</a>
        </div>
      </main>`;
  });
});
