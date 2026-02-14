(() => {
  const chatbot = document.querySelector(".chatbot");
  if (!chatbot) return;

  const sheetId = chatbot.dataset.sheetId;
  const dataUrl = sheetId ? `https://opensheet.elk.sh/${sheetId}/Sheet1` : null;

  const toggleButton = chatbot.querySelector(".chatbot-toggle");
  const panel = chatbot.querySelector(".chatbot-panel");
  const closeButton = chatbot.querySelector(".chatbot-close");
  const messages = chatbot.querySelector(".chatbot-messages");
  const form = chatbot.querySelector(".chatbot-form");
  const input = chatbot.querySelector("input[name='message']");

  let products = [];

  const normalize = (value) =>
    String(value || "")
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim();

  const getType = (item) => {
    const source = `${item.Name || ""} ${item.Description || ""}`.toLowerCase();
    if (/(earring|earrings|earing)/.test(source)) return "Earrings";
    if (/(ring|rings)/.test(source)) return "Rings";
    if (/(necklace|necklaces)/.test(source)) return "Necklaces";
    if (/(bracelet|bracelets)/.test(source)) return "Bracelets";
    if (/(hairpin|hair pins|hair pin)/.test(source)) return "Hairpins";
    return "Accessories";
  };

  const formatPrice = (value) => {
    if (!value) return "";
    const numeric = Number(String(value).replace(/[^0-9.]/g, ""));
    if (Number.isNaN(numeric)) return value;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2
    }).format(numeric);
  };

  const addMessage = (role, text) => {
    const bubble = document.createElement("div");
    bubble.className = `chatbot-message ${role}`;
    const p = document.createElement("p");
    p.textContent = text;
    bubble.appendChild(p);
    messages.appendChild(bubble);
    messages.scrollTop = messages.scrollHeight;
    return bubble;
  };

  const addProductList = (items) => {
    const list = document.createElement("div");
    list.className = "chatbot-products";

    items.forEach((item) => {
      const card = document.createElement("a");
      card.className = "chatbot-product";
      card.href = `products.html?id=${encodeURIComponent(item.ID || "")}`;
      card.innerHTML = `
        <span class="chatbot-product-name"></span>
        <span class="chatbot-product-meta"></span>
      `;
      const name = card.querySelector(".chatbot-product-name");
      const meta = card.querySelector(".chatbot-product-meta");
      name.textContent = item.Name || "Unnamed product";
      meta.textContent = `${getType(item)}${item.Price ? " • " + formatPrice(item.Price) : ""}`;
      list.appendChild(card);
    });

    const bubble = document.createElement("div");
    bubble.className = "chatbot-message bot";
    bubble.appendChild(list);
    messages.appendChild(bubble);
    messages.scrollTop = messages.scrollHeight;
  };

  const respond = (message) => {
    const query = normalize(message);
    if (!query) {
      addMessage("bot", "Share a product name or a type like earrings, rings, or necklaces.");
      return;
    }

    if (/(help|what can you do|how does this work)/.test(query)) {
      addMessage(
        "bot",
        "I can find products by name, type, or price. Try: gold ring, earrings, price of Luna."
      );
      return;
    }

    if (!products.length) {
      addMessage("bot", "I am still loading products. Please try again in a moment.");
      return;
    }

    const typeHint = /(earring|earrings|earing|ring|rings|necklace|necklaces|bracelet|bracelets|hairpin|hair pins|hair pin)/.test(
      query
    );

    let matches = products.filter((item) => {
      const name = normalize(item.Name);
      const description = normalize(item.Description);
      const type = normalize(getType(item));
      return (
        name.includes(query) ||
        description.includes(query) ||
        type.includes(query) ||
        query.includes(name)
      );
    });

    if (!matches.length && typeHint) {
      matches = products.filter((item) => normalize(getType(item)).includes(query));
    }

    if (!matches.length) {
      addMessage("bot", "I could not find that. Try a different name or a type like rings or earrings.");
      return;
    }

    const topMatches = matches.slice(0, 3);
    addMessage("bot", `Here are ${topMatches.length} match${topMatches.length > 1 ? "es" : ""}:`);
    addProductList(topMatches);
  };

  const openChat = () => {
    panel.classList.add("open");
    panel.setAttribute("aria-hidden", "false");
    toggleButton.setAttribute("aria-expanded", "true");
    if (!messages.children.length) {
      addMessage("bot", "Hi! Ask me about products or prices.");
    }
    input.focus();
  };

  const closeChat = () => {
    panel.classList.remove("open");
    panel.setAttribute("aria-hidden", "true");
    toggleButton.setAttribute("aria-expanded", "false");
  };

  toggleButton.addEventListener("click", () => {
    if (panel.classList.contains("open")) {
      closeChat();
    } else {
      openChat();
    }
  });

  closeButton.addEventListener("click", closeChat);

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const value = input.value.trim();
    if (!value) return;
    addMessage("user", value);
    input.value = "";
    respond(value);
  });

  const loadProducts = async () => {
    if (!dataUrl) return;
    try {
      const response = await fetch(dataUrl);
      if (!response.ok) throw new Error("Failed to fetch products");
      const data = await response.json();
      products = Array.isArray(data) ? data : [];
    } catch (error) {
      addMessage("bot", "I could not load the product list right now.");
    }
  };

  loadProducts();
})();
