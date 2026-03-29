function createServiceCard(service) {
  const features = (service.features || []).map((feature) => `<li>${feature}</li>`).join("");
  return `
    <a class="service-card-link" href="service-detail.html?id=${encodeURIComponent(service.id)}" aria-label="View ${service.title}">
      <article class="service-card">
        <img src="${service.image}" alt="${service.title}" />
        <div class="service-content">
          <p class="chip">${service.category}</p>
          <h3>${service.icon} ${service.title}</h3>
          <p>${service.description}</p>
          <ul>${features}</ul>
        </div>
      </article>
    </a>
  `;
}

function setTextIfExists(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function getBrandLogoFallback() {
  return "../admin-images/site-admin/brand/logo.png";
}

function resolveBrandLogoPath(value) {
  const logo = String(value || "").trim();
  if (!logo) return getBrandLogoFallback();
  if (
    logo === "logo.png" ||
    logo === "./logo.png" ||
    logo === "Yakafinity Website/logo.png" ||
    logo === "../Yakafinity Website/logo.png" ||
    logo === "/Yakafinity Website/logo.png"
  ) {
    return getBrandLogoFallback();
  }
  if (logo.startsWith("/admin-images/site-admin/")) {
    return `..${logo}`;
  }
  if (logo.startsWith("admin-images/site-admin/")) {
    return `../${logo}`;
  }
  return logo;
}

function applyLogoFallback(img, value, altText) {
  if (!img) return;
  const fallback = getBrandLogoFallback();
  img.onerror = () => {
    if (img.dataset.fallbackApplied === "true") return;
    img.dataset.fallbackApplied = "true";
    img.src = fallback;
  };
  img.dataset.fallbackApplied = "false";
  img.src = resolveBrandLogoPath(value);
  if (altText) img.alt = altText;
}

function setLinkIfExists(id, label, href) {
  const el = document.getElementById(id);
  if (!el) return;
  if (label) el.textContent = label;
  if (href) el.href = href;
}

function renderTextList(rootId, items) {
  const root = document.getElementById(rootId);
  if (!root) return;
  root.innerHTML = (items || []).map((item) => `<li>${item}</li>`).join("");
}

function renderProcessGrid(rootId, steps) {
  const root = document.getElementById(rootId);
  if (!root) return;
  root.innerHTML = (steps || [])
    .map(
      (step) => `
        <article>
          <h3>${step.title}</h3>
          <p>${step.text}</p>
        </article>
      `
    )
    .join("");
}

function renderAboutCards(rootId, cards) {
  const root = document.getElementById(rootId);
  if (!root) return;
  root.innerHTML = (cards || [])
    .map(
      (card) => `
        <article class="info-card">
          <h2>${card.title}</h2>
          <p>${card.text}</p>
        </article>
      `
    )
    .join("");
}

function applyCompanyBrand(data) {
  setTextIfExists("brandName", data.company.name);
  setTextIfExists("footerName", data.company.name);
  setTextIfExists("brandDomain", data.company.domain);

  const logo = document.getElementById("brandLogo");
  applyLogoFallback(logo, data.company.logo, `${data.company.name} logo`);
}

function applySiteContent(data) {
  const home = data.content.home;
  const about = data.content.about;
  const servicesPage = data.content.servicesPage;
  const contactPage = data.content.contactPage;
  const footer = data.content.footer;

  setTextIfExists("homeHeroEyebrow", home.eyebrow);
  setTextIfExists("heroTitle", home.title);
  setTextIfExists("homeHeroIntro", home.intro);
  setLinkIfExists("homePrimaryCta", home.primaryCtaLabel, home.primaryCtaHref);
  setLinkIfExists("homeSecondaryCta", home.secondaryCtaLabel, home.secondaryCtaHref);
  renderTextList("homeTrustRow", home.trustItems);
  setTextIfExists("homeExpertiseTitle", home.expertiseTitle);
  renderTextList("homeExpertiseList", home.expertiseItems);
  setTextIfExists("homeFeaturedEyebrow", home.featuredEyebrow);
  setTextIfExists("homeFeaturedTitle", home.featuredTitle);
  setTextIfExists("homeProcessEyebrow", home.processEyebrow);
  setTextIfExists("homeProcessTitle", home.processTitle);
  renderProcessGrid("homeProcessGrid", home.processSteps);
  setTextIfExists("homeFinalEyebrow", home.finalEyebrow);
  setTextIfExists("homeFinalTitle", home.finalTitle);
  setTextIfExists("homeFinalText", home.finalText);
  setLinkIfExists("homeFinalButton", home.finalButtonLabel, home.finalButtonHref);

  setTextIfExists("aboutHeroEyebrow", about.eyebrow);
  setTextIfExists("aboutHeroTitle", about.title);
  setTextIfExists("aboutHeroIntro", about.intro);
  renderAboutCards("aboutCardsGrid", about.cards);
  setTextIfExists("aboutProcessEyebrow", about.processEyebrow);
  setTextIfExists("aboutProcessTitle", about.processTitle);
  renderProcessGrid("aboutProcessGrid", about.processSteps);
  setTextIfExists("aboutOwnerEyebrow", about.ownerEyebrow);
  setTextIfExists("aboutOwnerTitle", about.ownerTitle);
  setTextIfExists("aboutOwnerText", about.ownerText);
  setTextIfExists("aboutOwnerCardText", about.ownerCardText);
  setLinkIfExists("aboutOwnerButton", about.ownerButtonLabel, about.ownerButtonHref);

  setTextIfExists("servicesPageEyebrow", servicesPage.eyebrow);
  setTextIfExists("servicesPageTitle", servicesPage.title);
  setTextIfExists("servicesPageIntro", servicesPage.intro);

  setTextIfExists("contactPageEyebrow", contactPage.eyebrow);
  setTextIfExists("contactPageTitle", contactPage.title);
  setTextIfExists("contactPageIntro", contactPage.intro);

  setTextIfExists("footerSecondaryText", footer.contactLine);
  setTextIfExists("footerDomainPrefix", footer.domainPrefix);
  setLinkIfExists("footerServicesLink", footer.servicesLinkLabel, footer.servicesLinkHref);
}

function renderServices(data) {
  const servicesGrid = document.getElementById("servicesGrid");
  if (servicesGrid) {
    const isHome =
      window.location.pathname.endsWith("/index.html") ||
      window.location.pathname === "/" ||
      window.location.pathname === "";
    const list = isHome ? data.services.slice(0, 5) : data.services;
    servicesGrid.innerHTML = list.map(createServiceCard).join("");
  }

  const selects = document.querySelectorAll("[data-service-select], #serviceType");
  selects.forEach((select) => {
    select.innerHTML = data.services
      .map((service) => `<option value="${service.title}">${service.title}</option>`)
      .join("");

    const params = new URLSearchParams(window.location.search);
    const selected = params.get("service");
    if (selected) {
      const option = Array.from(select.options).find((item) => item.value === selected);
      if (option) select.value = selected;
    }
  });
}

function setupOrderForms() {
  const forms = document.querySelectorAll("[data-order-form], #orderForm");
  forms.forEach((form) => {
    if (form.dataset.bound === "true") return;
    form.dataset.bound = "true";

    const message = form.querySelector(".form-message") || document.getElementById("orderMessage");
    const params = new URLSearchParams(window.location.search);
    const plan = params.get("plan");
    const detailsField = form.querySelector("#details");
    if (plan && detailsField && !detailsField.value) {
      detailsField.value = `Selected Plan: ${plan}`;
    }

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const formData = new FormData(form);
      const orders = getOrders();
      const order = {
        id: `YAK-${Date.now()}`,
        createdAt: new Date().toISOString(),
        status: "New",
        delivery: "Not Started",
        received: false,
        receivedAt: null,
        clientName: formData.get("clientName"),
        clientEmail: formData.get("clientEmail"),
        serviceType: formData.get("serviceType"),
        projectBudget: formData.get("projectBudget"),
        deadline: formData.get("deadline"),
        details: formData.get("details")
      };
      orders.unshift(order);
      saveOrders(orders);
      form.reset();
      if (message) {
        message.innerHTML = `Order submitted successfully. Your order ID is ${order.id}. <a href="client-portal.html?orderId=${encodeURIComponent(order.id)}">Login & Pay</a>`;
      }
    });
  });
}

function injectWhatsAppButton() {
  if (document.querySelector(".whatsapp-float")) return;
  const link = document.createElement("a");
  link.href = "https://wa.me/94721005844";
  link.target = "_blank";
  link.rel = "noopener";
  link.className = "whatsapp-float";
  link.setAttribute("aria-label", "Chat on WhatsApp");
  link.innerHTML = `
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <path d="M19.1 17.2c-.3-.1-1.7-.8-1.9-.9-.3-.1-.5-.1-.7.1-.2.2-.8.9-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.2-.4-2.2-1.3-.8-.7-1.3-1.5-1.5-1.8-.2-.3 0-.4.1-.6.1-.1.3-.3.4-.5.1-.2.2-.3.3-.5.1-.2 0-.4 0-.6 0-.1-.7-1.7-1-2.3-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.2-1.2 2.9s1.2 3.4 1.3 3.6c.2.2 2.3 3.5 5.7 4.9.8.3 1.4.5 1.9.6.8.2 1.5.2 2.1.1.6-.1 1.7-.7 1.9-1.4.2-.7.2-1.3.1-1.4-.1-.1-.3-.2-.6-.4z" />
      <path d="M16 3C8.8 3 3 8.8 3 16c0 2.5.7 4.9 2 7L3 29l6.2-2c2 1.1 4.3 1.8 6.8 1.8 7.2 0 13-5.8 13-13S23.2 3 16 3zm0 23.4c-2.1 0-4.1-.6-5.8-1.7l-.4-.2-3.7 1.2 1.2-3.6-.2-.4c-1.2-1.8-1.8-3.8-1.8-5.9C5.3 10.3 10.3 5.3 16 5.3s10.7 5 10.7 10.7S21.7 26.4 16 26.4z" />
    </svg>
    <span>WhatsApp</span>
  `;
  document.body.appendChild(link);
}

document.addEventListener("DOMContentLoaded", () => {
  const data = getSiteData();
  applyCompanyBrand(data);
  applySiteContent(data);
  renderServices(data);
  setupOrderForms();
  injectWhatsAppButton();
});
