function uid() {
  return `svc-${Math.random().toString(36).slice(2, 10)}`;
}

function uidOffering() {
  return `off-${Math.random().toString(36).slice(2, 10)}`;
}

function slugify(value, fallback = "item") {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || fallback;
}

function ensureUniqueId(baseId, items, currentId) {
  const fallback = slugify(baseId, "item");
  let nextId = fallback;
  let counter = 2;
  const used = new Set((items || []).map((item) => item && item.id).filter(Boolean));
  if (currentId) {
    used.delete(currentId);
  }
  while (used.has(nextId)) {
    nextId = `${fallback}-${counter}`;
    counter += 1;
  }
  return nextId;
}

function setPreviewImage(id, value) {
  const img = document.getElementById(id);
  if (!img) return;
  img.src = value || "";
  img.style.display = value ? "block" : "none";
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

function applyLogoFallback(img, value) {
  if (!img) return;
  const fallback = getBrandLogoFallback();
  img.onerror = () => {
    if (img.dataset.fallbackApplied === "true") return;
    img.dataset.fallbackApplied = "true";
    img.src = fallback;
  };
  img.dataset.fallbackApplied = "false";
  img.src = resolveBrandLogoPath(value);
}

function setCurrentImageState(inputId, previewId, value) {
  const input = document.getElementById(inputId);
  if (!input) return;
  input.value = "";
  input.dataset.current = value || "";
  input.dataset.removed = "false";
  setPreviewImage(previewId, value || "");
}

function markImageRemoved(inputId, previewId) {
  const input = document.getElementById(inputId);
  if (!input) return;
  input.value = "";
  input.dataset.current = "";
  input.dataset.removed = "true";
  setPreviewImage(previewId, "");
}

function previewSelectedFile(inputId, previewId) {
  const input = document.getElementById(inputId);
  const file = input && input.files && input.files[0];
  if (!file) return;
  input.dataset.removed = "false";
  setPreviewImage(previewId, URL.createObjectURL(file));
}

function guardAdminPage() {
  if (!isAdminAuthenticated()) {
    window.location.href = "admin-login.html";
    return false;
  }
  return true;
}

function splitCommaList(value) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function getFieldValue(id) {
  const field = document.getElementById(id);
  return field ? field.value.trim() : "";
}

function setFieldValue(id, value) {
  const field = document.getElementById(id);
  if (field) field.value = value || "";
}

function collectManagedSiteImageUrls(data) {
  const urls = new Set();
  const imageLibrary = window.ProjectImageLibrary;
  if (!imageLibrary) return urls;

  const maybeAdd = (value) => {
    if (imageLibrary.isManagedUrl("siteAdmin", value)) {
      urls.add(imageLibrary.stripVersion(value));
    }
  };

  maybeAdd(data.company && data.company.logo);
  (data.services || []).forEach((service) => {
    maybeAdd(service.image);
    (service.offerings || []).forEach((offering) => maybeAdd(offering.image));
  });
  return urls;
}

async function deleteRemovedSiteImages(previousData, nextData) {
  const imageLibrary = window.ProjectImageLibrary;
  if (!imageLibrary || !imageLibrary.isSupported()) return;

  const previousUrls = collectManagedSiteImageUrls(previousData);
  const nextUrls = collectManagedSiteImageUrls(nextData);

  for (const url of previousUrls) {
    if (!nextUrls.has(url)) {
      await imageLibrary.deleteImageFile("siteAdmin", url);
    }
  }
}

async function saveSiteDataWithCleanup(previousData, nextData) {
  saveSiteData(nextData);
  await deleteRemovedSiteImages(previousData, nextData);
}

async function saveManagedSiteImage(folderName, file, nameBase) {
  return window.ProjectImageLibrary.saveImageWithFallback("siteAdmin", folderName, file, nameBase, {
    maxWidth: 1800,
    maxHeight: 1800,
    quality: 0.84,
    outputType: "image/webp"
  });
}

async function syncSiteImageFolderStatus() {
  const status = document.getElementById("siteImageFolderStatus");
  const button = document.getElementById("connectSiteImageFolderBtn");
  if (!status || !button) return;

  const imageLibrary = window.ProjectImageLibrary;
  if (!imageLibrary) {
    status.textContent = "Uploads are unavailable because the image library script did not load.";
    button.disabled = true;
    return;
  }

  if (!imageLibrary.isSupported()) {
    status.textContent = "Browser storage upload mode is active. Use a modern Chromium browser if you also want folder-based project file saving.";
    return;
  }

  const details = await imageLibrary.getRootStatus("siteAdmin");
  status.textContent = details.label;
}

function fillBrandForm(data) {
  const logo = data.company.logo || DEFAULT_DATA.company.logo || "";
  setFieldValue("companyName", data.company.name);
  setFieldValue("companyDomain", data.company.domain);
  setFieldValue("companyTagline", data.company.tagline);
  setCurrentImageState("companyLogoFile", "companyLogoPreview", logo);
  applyLogoFallback(document.getElementById("adminBrandLogo"), logo);
}

function fillSiteContentForm(data) {
  const home = data.content.home;
  const about = data.content.about;
  const servicesPage = data.content.servicesPage;
  const contactPage = data.content.contactPage;
  const footer = data.content.footer;

  setFieldValue("homeHeroEyebrowInput", home.eyebrow);
  setFieldValue("homeHeroTitleInput", home.title);
  setFieldValue("homeHeroIntroInput", home.intro);
  setFieldValue("homePrimaryCtaLabelInput", home.primaryCtaLabel);
  setFieldValue("homePrimaryCtaHrefInput", home.primaryCtaHref);
  setFieldValue("homeSecondaryCtaLabelInput", home.secondaryCtaLabel);
  setFieldValue("homeSecondaryCtaHrefInput", home.secondaryCtaHref);
  setFieldValue("homeTrustItemsInput", (home.trustItems || []).join(", "));
  setFieldValue("homeExpertiseTitleInput", home.expertiseTitle);
  setFieldValue("homeExpertiseItemsInput", (home.expertiseItems || []).join(", "));
  setFieldValue("homeFeaturedEyebrowInput", home.featuredEyebrow);
  setFieldValue("homeFeaturedTitleInput", home.featuredTitle);
  setFieldValue("homeProcessEyebrowInput", home.processEyebrow);
  setFieldValue("homeProcessTitleInput", home.processTitle);
  setFieldValue("homeProcessStep1Title", home.processSteps && home.processSteps[0] ? home.processSteps[0].title : "");
  setFieldValue("homeProcessStep1Text", home.processSteps && home.processSteps[0] ? home.processSteps[0].text : "");
  setFieldValue("homeProcessStep2Title", home.processSteps && home.processSteps[1] ? home.processSteps[1].title : "");
  setFieldValue("homeProcessStep2Text", home.processSteps && home.processSteps[1] ? home.processSteps[1].text : "");
  setFieldValue("homeProcessStep3Title", home.processSteps && home.processSteps[2] ? home.processSteps[2].title : "");
  setFieldValue("homeProcessStep3Text", home.processSteps && home.processSteps[2] ? home.processSteps[2].text : "");
  setFieldValue("homeFinalEyebrowInput", home.finalEyebrow);
  setFieldValue("homeFinalTitleInput", home.finalTitle);
  setFieldValue("homeFinalTextInput", home.finalText);
  setFieldValue("homeFinalButtonLabelInput", home.finalButtonLabel);
  setFieldValue("homeFinalButtonHrefInput", home.finalButtonHref);

  setFieldValue("aboutHeroEyebrowInput", about.eyebrow);
  setFieldValue("aboutHeroTitleInput", about.title);
  setFieldValue("aboutHeroIntroInput", about.intro);
  setFieldValue("aboutCard1Title", about.cards && about.cards[0] ? about.cards[0].title : "");
  setFieldValue("aboutCard1Text", about.cards && about.cards[0] ? about.cards[0].text : "");
  setFieldValue("aboutCard2Title", about.cards && about.cards[1] ? about.cards[1].title : "");
  setFieldValue("aboutCard2Text", about.cards && about.cards[1] ? about.cards[1].text : "");
  setFieldValue("aboutCard3Title", about.cards && about.cards[2] ? about.cards[2].title : "");
  setFieldValue("aboutCard3Text", about.cards && about.cards[2] ? about.cards[2].text : "");
  setFieldValue("aboutProcessEyebrowInput", about.processEyebrow);
  setFieldValue("aboutProcessTitleInput", about.processTitle);
  setFieldValue("aboutProcessStep1Title", about.processSteps && about.processSteps[0] ? about.processSteps[0].title : "");
  setFieldValue("aboutProcessStep1Text", about.processSteps && about.processSteps[0] ? about.processSteps[0].text : "");
  setFieldValue("aboutProcessStep2Title", about.processSteps && about.processSteps[1] ? about.processSteps[1].title : "");
  setFieldValue("aboutProcessStep2Text", about.processSteps && about.processSteps[1] ? about.processSteps[1].text : "");
  setFieldValue("aboutProcessStep3Title", about.processSteps && about.processSteps[2] ? about.processSteps[2].title : "");
  setFieldValue("aboutProcessStep3Text", about.processSteps && about.processSteps[2] ? about.processSteps[2].text : "");
  setFieldValue("aboutOwnerEyebrowInput", about.ownerEyebrow);
  setFieldValue("aboutOwnerTitleInput", about.ownerTitle);
  setFieldValue("aboutOwnerTextInput", about.ownerText);
  setFieldValue("aboutOwnerCardTextInput", about.ownerCardText);
  setFieldValue("aboutOwnerButtonLabelInput", about.ownerButtonLabel);
  setFieldValue("aboutOwnerButtonHrefInput", about.ownerButtonHref);

  setFieldValue("servicesPageEyebrowInput", servicesPage.eyebrow);
  setFieldValue("servicesPageTitleInput", servicesPage.title);
  setFieldValue("servicesPageIntroInput", servicesPage.intro);

  setFieldValue("contactPageEyebrowInput", contactPage.eyebrow);
  setFieldValue("contactPageTitleInput", contactPage.title);
  setFieldValue("contactPageIntroInput", contactPage.intro);

  setFieldValue("footerTaglineInput", footer.tagline);
  setFieldValue("footerContactLineInput", footer.contactLine);
  setFieldValue("footerServicesLinkLabelInput", footer.servicesLinkLabel);
  setFieldValue("footerServicesLinkHrefInput", footer.servicesLinkHref);
  setFieldValue("footerDomainPrefixInput", footer.domainPrefix);
}

function setupAdminSessionActions() {
  const logoutBtn = document.getElementById("adminLogoutBtn");
  logoutBtn.addEventListener("click", () => {
    logoutAdmin();
    window.location.href = "admin-login.html";
  });
}

function renderServicesAdmin() {
  const data = getSiteData();
  const root = document.getElementById("servicesAdminList");

  if (!data.services.length) {
    root.innerHTML = `<p class="muted">No services found. Add your first service above.</p>`;
    return;
  }

  root.innerHTML = data.services
    .map((service) => {
      return `
        <article class="list-card">
          <img src="${service.image}" alt="${service.title}" />
          <div>
            <h3>${service.icon} ${service.title}</h3>
            <p class="muted">${service.category}</p>
            <p>${service.description}</p>
          </div>
          <div class="list-actions">
            <button class="btn btn-ghost" data-edit-service="${service.id}" type="button">Edit</button>
            <button class="btn btn-danger" data-delete-service="${service.id}" type="button">Delete</button>
          </div>
        </article>
      `;
    })
    .join("");
}

function populateOfferingServiceSelect(selectedId) {
  const select = document.getElementById("offeringServiceId");
  const data = getSiteData();
  select.innerHTML = data.services
    .map((service) => `<option value="${service.id}">${service.icon} ${service.title}</option>`)
    .join("");

  if (!data.services.length) {
    select.value = "";
    return;
  }

  const validId = selectedId && data.services.find((service) => service.id === selectedId) ? selectedId : data.services[0].id;
  select.value = validId;
}

function normalizeOfferings(service) {
  return (service.offerings || []).map((offering) => ({
    id: offering.id || ensureUniqueId(slugify(offering.name, uidOffering()), service.offerings || []),
    name: offering.name || "Unnamed Item",
    priceLkr: Number(offering.priceLkr || 0),
    image: offering.image || service.image
  }));
}

function renderOfferingsAdmin(serviceId) {
  const data = getSiteData();
  const root = document.getElementById("offeringsAdminList");
  const service = data.services.find((item) => item.id === serviceId) || data.services[0];

  if (!service) {
    root.innerHTML = `<p class="muted">Add a main service first to manage service items.</p>`;
    return;
  }

  service.offerings = normalizeOfferings(service);
  saveSiteData(data);

  if (!service.offerings.length) {
    root.innerHTML = `<p class="muted">No items for ${service.title}. Add the first plan above.</p>`;
    return;
  }

  root.innerHTML = service.offerings
    .map(
      (offering) => `
        <article class="list-card offering-admin-card">
          <img src="${offering.image}" alt="${offering.name}" />
          <div>
            <h3>${offering.name}</h3>
            <p class="offering-price">LKR ${Number(offering.priceLkr).toLocaleString()}</p>
            <p class="muted">${service.title}</p>
          </div>
          <div class="list-actions">
            <button class="btn btn-ghost" data-edit-offering="${offering.id}" data-offering-service="${service.id}" type="button">Edit</button>
            <button class="btn btn-danger" data-delete-offering="${offering.id}" data-offering-service="${service.id}" type="button">Delete</button>
          </div>
        </article>
      `
    )
    .join("");
}

function renderOrders() {
  const orders = getOrders().map((order) => ({
    ...order,
    received: Boolean(order.received),
    receivedAt: order.receivedAt || null
  }));
  saveOrders(orders);
  const root = document.getElementById("ordersList");

  if (!orders.length) {
    root.innerHTML = `<p class="muted">No orders yet. New orders from the public site will appear here.</p>`;
    return;
  }

  root.innerHTML = orders
    .map((order) => {
      return `
        <article class="list-card order-card">
          <div>
            <h3>${order.id}</h3>
            <p><strong>${order.clientName}</strong> (${order.clientEmail})</p>
            <p>Service: ${order.serviceType}</p>
            <p>Budget: ${order.projectBudget || "Not set"} | Deadline: ${order.deadline || "Not set"}</p>
            <p>Received: ${order.received ? "Yes" : "No"}</p>
            <p class="muted">${order.details}</p>
          </div>
          <div class="order-controls">
            <label>Status</label>
            <select data-order-status="${order.id}">
              ${["New", "In Progress", "Delivered", "Completed", "Cancelled"]
                .map((status) => `<option ${order.status === status ? "selected" : ""} value="${status}">${status}</option>`)
                .join("")}
            </select>
            <label>Delivery</label>
            <select data-order-delivery="${order.id}">
              ${["Not Started", "Building", "Ready to Send", "Delivered"]
                .map((delivery) => `<option ${order.delivery === delivery ? "selected" : ""} value="${delivery}">${delivery}</option>`)
                .join("")}
            </select>
            <button class="btn" data-save-order="${order.id}" type="button">Save</button>
            <button class="btn btn-danger" data-delete-order="${order.id}" type="button">Remove</button>
          </div>
        </article>
      `;
    })
    .join("");
}

function renderAdminStats() {
  const orders = getOrders();
  const root = document.getElementById("adminStats");
  if (!root) return;

  const total = orders.length;
  const newCount = orders.filter((order) => order.status === "New").length;
  const receivedCount = orders.filter((order) => Boolean(order.received)).length;
  const completed = orders.filter((order) => order.status === "Completed" || order.status === "Delivered").length;

  root.innerHTML = `
    <article class="stats-card">
      <p>Total Orders</p>
      <h3>${total}</h3>
    </article>
    <article class="stats-card">
      <p>New Submissions</p>
      <h3>${newCount}</h3>
    </article>
    <article class="stats-card">
      <p>Received by Admin</p>
      <h3>${receivedCount}</h3>
    </article>
    <article class="stats-card">
      <p>Completed/Delivered</p>
      <h3>${completed}</h3>
    </article>
  `;
}

function renderOrdersInbox() {
  const orders = getOrders();
  const root = document.getElementById("ordersInboxList");
  if (!root) return;

  const inboxOrders = orders.filter((order) => !order.received);
  if (!inboxOrders.length) {
    root.innerHTML = `<p class="muted">No pending submissions. All incoming orders are marked as received.</p>`;
    return;
  }

  root.innerHTML = inboxOrders
    .map(
      (order) => `
        <article class="list-card order-card">
          <div>
            <h3>${order.id}</h3>
            <p><strong>${order.clientName}</strong> (${order.clientEmail})</p>
            <p>Service: ${order.serviceType}</p>
            <p class="muted">${order.details}</p>
          </div>
          <div class="list-actions">
            <button class="btn" data-receive-order="${order.id}" type="button">Mark Received</button>
            <button class="btn btn-ghost" data-open-order="${order.id}" type="button">Open in Manager</button>
          </div>
        </article>
      `
    )
    .join("");
}

function setupSiteImageFolder() {
  const button = document.getElementById("connectSiteImageFolderBtn");
  if (!button) return;

  button.addEventListener("click", async () => {
    try {
      await window.ProjectImageLibrary.connectRoot("siteAdmin");
      await syncSiteImageFolderStatus();
      alert("Site image folder connected.");
    } catch (error) {
      alert(error.message || "Failed to connect the site image folder.");
    }
  });
}

function setupBrandForm() {
  const form = document.getElementById("brandForm");
  const logoInput = document.getElementById("companyLogoFile");
  const removeLogoBtn = document.getElementById("removeCompanyLogoBtn");

  logoInput.addEventListener("change", () => previewSelectedFile("companyLogoFile", "companyLogoPreview"));
  removeLogoBtn.addEventListener("click", () => markImageRemoved("companyLogoFile", "companyLogoPreview"));

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = getSiteData();
    const previousData = structuredClone(data);
    data.company.name = document.getElementById("companyName").value.trim();
    data.company.domain = document.getElementById("companyDomain").value.trim();
    data.company.tagline = document.getElementById("companyTagline").value.trim();

    const file = logoInput.files && logoInput.files[0];
    if (file) {
      data.company.logo = await saveManagedSiteImage("brand", file, data.company.name || "company-logo");
    } else if (logoInput.dataset.removed === "true") {
      data.company.logo = DEFAULT_DATA.company.logo;
    } else {
      data.company.logo = logoInput.dataset.current || data.company.logo || DEFAULT_DATA.company.logo;
    }

    await saveSiteDataWithCleanup(previousData, data);
    fillBrandForm(data);
    alert("Company details saved.");
  });
}

function setupSiteContentForm() {
  const form = document.getElementById("siteContentForm");
  if (!form) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = getSiteData();
    const previousData = structuredClone(data);

    data.content.home = {
      eyebrow: getFieldValue("homeHeroEyebrowInput"),
      title: getFieldValue("homeHeroTitleInput"),
      intro: getFieldValue("homeHeroIntroInput"),
      primaryCtaLabel: getFieldValue("homePrimaryCtaLabelInput"),
      primaryCtaHref: getFieldValue("homePrimaryCtaHrefInput"),
      secondaryCtaLabel: getFieldValue("homeSecondaryCtaLabelInput"),
      secondaryCtaHref: getFieldValue("homeSecondaryCtaHrefInput"),
      trustItems: splitCommaList(getFieldValue("homeTrustItemsInput")),
      expertiseTitle: getFieldValue("homeExpertiseTitleInput"),
      expertiseItems: splitCommaList(getFieldValue("homeExpertiseItemsInput")),
      featuredEyebrow: getFieldValue("homeFeaturedEyebrowInput"),
      featuredTitle: getFieldValue("homeFeaturedTitleInput"),
      processEyebrow: getFieldValue("homeProcessEyebrowInput"),
      processTitle: getFieldValue("homeProcessTitleInput"),
      processSteps: [
        { title: getFieldValue("homeProcessStep1Title"), text: getFieldValue("homeProcessStep1Text") },
        { title: getFieldValue("homeProcessStep2Title"), text: getFieldValue("homeProcessStep2Text") },
        { title: getFieldValue("homeProcessStep3Title"), text: getFieldValue("homeProcessStep3Text") }
      ].filter((step) => step.title || step.text),
      finalEyebrow: getFieldValue("homeFinalEyebrowInput"),
      finalTitle: getFieldValue("homeFinalTitleInput"),
      finalText: getFieldValue("homeFinalTextInput"),
      finalButtonLabel: getFieldValue("homeFinalButtonLabelInput"),
      finalButtonHref: getFieldValue("homeFinalButtonHrefInput")
    };

    data.content.about = {
      eyebrow: getFieldValue("aboutHeroEyebrowInput"),
      title: getFieldValue("aboutHeroTitleInput"),
      intro: getFieldValue("aboutHeroIntroInput"),
      cards: [
        { title: getFieldValue("aboutCard1Title"), text: getFieldValue("aboutCard1Text") },
        { title: getFieldValue("aboutCard2Title"), text: getFieldValue("aboutCard2Text") },
        { title: getFieldValue("aboutCard3Title"), text: getFieldValue("aboutCard3Text") }
      ].filter((card) => card.title || card.text),
      processEyebrow: getFieldValue("aboutProcessEyebrowInput"),
      processTitle: getFieldValue("aboutProcessTitleInput"),
      processSteps: [
        { title: getFieldValue("aboutProcessStep1Title"), text: getFieldValue("aboutProcessStep1Text") },
        { title: getFieldValue("aboutProcessStep2Title"), text: getFieldValue("aboutProcessStep2Text") },
        { title: getFieldValue("aboutProcessStep3Title"), text: getFieldValue("aboutProcessStep3Text") }
      ].filter((step) => step.title || step.text),
      ownerEyebrow: getFieldValue("aboutOwnerEyebrowInput"),
      ownerTitle: getFieldValue("aboutOwnerTitleInput"),
      ownerText: getFieldValue("aboutOwnerTextInput"),
      ownerCardText: getFieldValue("aboutOwnerCardTextInput"),
      ownerButtonLabel: getFieldValue("aboutOwnerButtonLabelInput"),
      ownerButtonHref: getFieldValue("aboutOwnerButtonHrefInput")
    };

    data.content.servicesPage = {
      eyebrow: getFieldValue("servicesPageEyebrowInput"),
      title: getFieldValue("servicesPageTitleInput"),
      intro: getFieldValue("servicesPageIntroInput")
    };

    data.content.contactPage = {
      eyebrow: getFieldValue("contactPageEyebrowInput"),
      title: getFieldValue("contactPageTitleInput"),
      intro: getFieldValue("contactPageIntroInput")
    };

    data.content.footer = {
      tagline: getFieldValue("footerTaglineInput"),
      contactLine: getFieldValue("footerContactLineInput"),
      servicesLinkLabel: getFieldValue("footerServicesLinkLabelInput"),
      servicesLinkHref: getFieldValue("footerServicesLinkHrefInput"),
      domainPrefix: getFieldValue("footerDomainPrefixInput")
    };

    await saveSiteDataWithCleanup(previousData, data);
    fillSiteContentForm(data);
    alert("Site content saved.");
  });
}

function setupAccessForm() {
  const form = document.getElementById("adminAccessForm");
  const msg = document.getElementById("adminAccessMsg");
  const creds = getAdminCredentials();
  document.getElementById("newAdminUser").value = creds.username;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const username = document.getElementById("newAdminUser").value.trim();
    const password = document.getElementById("newAdminPass").value.trim();

    if (!username || !password) {
      msg.textContent = "Username and password are required.";
      return;
    }

    setAdminCredentials(username, password);
    msg.textContent = "Admin login updated successfully.";
    form.reset();
    document.getElementById("newAdminUser").value = username;
  });
}

function clearServiceForm() {
  document.getElementById("serviceId").value = "";
  document.getElementById("serviceTitle").value = "";
  document.getElementById("serviceIcon").value = "";
  document.getElementById("serviceCategory").value = "";
  setCurrentImageState("serviceImageFile", "serviceImagePreview", "");
  document.getElementById("serviceDescription").value = "";
  document.getElementById("serviceFeatures").value = "";
}

function clearOfferingForm(keepService = true) {
  const currentService = document.getElementById("offeringServiceId").value;
  document.getElementById("offeringId").value = "";
  document.getElementById("offeringName").value = "";
  document.getElementById("offeringPriceLkr").value = "";
  setCurrentImageState("offeringImageFile", "offeringImagePreview", "");
  if (keepService && currentService) {
    document.getElementById("offeringServiceId").value = currentService;
  }
}

function setupServiceForm() {
  const form = document.getElementById("serviceForm");
  const serviceImageInput = document.getElementById("serviceImageFile");
  const removeServiceImageBtn = document.getElementById("removeServiceImageBtn");

  serviceImageInput.addEventListener("change", () => previewSelectedFile("serviceImageFile", "serviceImagePreview"));
  removeServiceImageBtn.addEventListener("click", () => markImageRemoved("serviceImageFile", "serviceImagePreview"));

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = getSiteData();
    const previousData = structuredClone(data);
    const existingId = document.getElementById("serviceId").value;
    const serviceTitle = document.getElementById("serviceTitle").value.trim();
    const id = existingId || ensureUniqueId(slugify(serviceTitle, uid()), data.services);
    const existing = data.services.find((item) => item.id === id);

    const file = serviceImageInput.files && serviceImageInput.files[0];
    let image = serviceImageInput.dataset.current || (existing && existing.image) || "";
    if (file) {
      image = await saveManagedSiteImage("services", file, `${id}-cover`);
    } else if (serviceImageInput.dataset.removed === "true") {
      image = "";
    }

    if (!image) {
      alert("Please upload a service image.");
      return;
    }

    const service = {
      id,
      title: serviceTitle,
      icon: document.getElementById("serviceIcon").value.trim(),
      category: document.getElementById("serviceCategory").value.trim(),
      image,
      description: document.getElementById("serviceDescription").value.trim(),
      features: document
        .getElementById("serviceFeatures")
        .value.split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      offerings: (existing && existing.offerings) || []
    };

    const index = data.services.findIndex((item) => item.id === id);
    if (index >= 0) {
      data.services[index] = service;
    } else {
      data.services.push(service);
    }

    await saveSiteDataWithCleanup(previousData, data);
    renderServicesAdmin();
    populateOfferingServiceSelect(id);
    renderOfferingsAdmin(id);
    clearServiceForm();
    alert("Service saved.");
  });
}

function setupOfferingForm() {
  const form = document.getElementById("offeringForm");
  const serviceSelect = document.getElementById("offeringServiceId");
  const imageFileInput = document.getElementById("offeringImageFile");
  const removeOfferingImageBtn = document.getElementById("removeOfferingImageBtn");

  serviceSelect.addEventListener("change", () => {
    clearOfferingForm(false);
    renderOfferingsAdmin(serviceSelect.value);
  });

  imageFileInput.addEventListener("change", () => previewSelectedFile("offeringImageFile", "offeringImagePreview"));
  removeOfferingImageBtn.addEventListener("click", () => markImageRemoved("offeringImageFile", "offeringImagePreview"));

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = getSiteData();
    const previousData = structuredClone(data);
    const serviceId = serviceSelect.value;
    const service = data.services.find((item) => item.id === serviceId);
    if (!service) {
      alert("Please select a valid service.");
      return;
    }

    const existingId = document.getElementById("offeringId").value;
    const offeringName = document.getElementById("offeringName").value.trim();
    const id = existingId || ensureUniqueId(slugify(offeringName, uidOffering()), service.offerings || []);
    const name = offeringName;
    const priceLkr = Number(document.getElementById("offeringPriceLkr").value);

    const file = imageFileInput.files && imageFileInput.files[0];
    let image = imageFileInput.dataset.current || service.image;
    if (file) {
      image = await saveManagedSiteImage("items", file, `${serviceId}-${id}-card`);
    } else if (imageFileInput.dataset.removed === "true") {
      image = service.image;
    }

    if (!name || Number.isNaN(priceLkr)) {
      alert("Item name and LKR price are required.");
      return;
    }

    const nextItem = { id, name, priceLkr, image };
    service.offerings = service.offerings || [];
    const index = service.offerings.findIndex((item) => item.id === id);

    if (index >= 0) {
      service.offerings[index] = nextItem;
    } else {
      service.offerings.push(nextItem);
    }

    await saveSiteDataWithCleanup(previousData, data);
    clearOfferingForm(true);
    renderOfferingsAdmin(serviceId);
    alert("Service item saved.");
  });
}

function setupOfferingActions() {
  const root = document.getElementById("offeringsAdminList");
  root.addEventListener("click", async (event) => {
    const editId = event.target.getAttribute("data-edit-offering");
    const deleteId = event.target.getAttribute("data-delete-offering");
    const serviceId = event.target.getAttribute("data-offering-service");
    if (!serviceId || (!editId && !deleteId)) return;

    const data = getSiteData();
    const service = data.services.find((item) => item.id === serviceId);
    if (!service) return;
    service.offerings = service.offerings || [];

    if (editId) {
      const item = service.offerings.find((offering) => offering.id === editId);
      if (!item) return;
      document.getElementById("offeringServiceId").value = serviceId;
      document.getElementById("offeringId").value = item.id;
      document.getElementById("offeringName").value = item.name || "";
      document.getElementById("offeringPriceLkr").value = item.priceLkr || 0;
      setCurrentImageState("offeringImageFile", "offeringImagePreview", item.image || "");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (deleteId) {
      const previousData = structuredClone(data);
      service.offerings = service.offerings.filter((offering) => offering.id !== deleteId);
      await saveSiteDataWithCleanup(previousData, data);
      renderOfferingsAdmin(serviceId);
      alert("Service item removed.");
    }
  });
}

function setupServiceActions() {
  document.getElementById("servicesAdminList").addEventListener("click", async (event) => {
    const editId = event.target.getAttribute("data-edit-service");
    const deleteId = event.target.getAttribute("data-delete-service");
    if (!editId && !deleteId) return;

    const data = getSiteData();

    if (editId) {
      const service = data.services.find((item) => item.id === editId);
      if (!service) return;
      document.getElementById("serviceId").value = service.id;
      document.getElementById("serviceTitle").value = service.title;
      document.getElementById("serviceIcon").value = service.icon;
      document.getElementById("serviceCategory").value = service.category;
      setCurrentImageState("serviceImageFile", "serviceImagePreview", service.image || "");
      document.getElementById("serviceDescription").value = service.description;
      document.getElementById("serviceFeatures").value = service.features.join(", ");
      document.getElementById("offeringServiceId").value = service.id;
      renderOfferingsAdmin(service.id);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (deleteId) {
      const previousData = structuredClone(data);
      data.services = data.services.filter((item) => item.id !== deleteId);
      await saveSiteDataWithCleanup(previousData, data);
      renderServicesAdmin();
      populateOfferingServiceSelect();
      renderOfferingsAdmin(document.getElementById("offeringServiceId").value);
      alert("Service removed.");
    }
  });
}

function setupOrdersActions() {
  document.getElementById("ordersList").addEventListener("click", (event) => {
    const saveId = event.target.getAttribute("data-save-order");
    const deleteId = event.target.getAttribute("data-delete-order");
    if (!saveId && !deleteId) return;

    const orders = getOrders();

    if (saveId) {
      const target = orders.find((order) => order.id === saveId);
      if (!target) return;
      target.status = document.querySelector(`[data-order-status="${saveId}"]`).value;
      target.delivery = document.querySelector(`[data-order-delivery="${saveId}"]`).value;
      saveOrders(orders);
      renderOrders();
      renderOrdersInbox();
      renderAdminStats();
      alert("Order updated.");
      return;
    }

    if (deleteId) {
      const filtered = orders.filter((order) => order.id !== deleteId);
      saveOrders(filtered);
      renderOrders();
      renderOrdersInbox();
      renderAdminStats();
      alert("Order removed.");
    }
  });
}

function setupInboxActions() {
  const root = document.getElementById("ordersInboxList");
  if (!root) return;
  root.addEventListener("click", (event) => {
    const receiveId = event.target.getAttribute("data-receive-order");
    const openId = event.target.getAttribute("data-open-order");
    if (!receiveId && !openId) return;

    const orders = getOrders();

    if (receiveId) {
      const order = orders.find((item) => item.id === receiveId);
      if (!order) return;
      order.received = true;
      order.receivedAt = new Date().toISOString();
      saveOrders(orders);
      renderOrdersInbox();
      renderOrders();
      renderAdminStats();
      alert(`Order ${receiveId} marked as received.`);
      return;
    }

    if (openId) {
      const manager = document.getElementById("ordersList");
      if (manager) manager.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
}

function setupDataTools() {
  document.getElementById("resetServicesBtn").addEventListener("click", async () => {
    const data = getSiteData();
    const previousData = structuredClone(data);
    data.services = structuredClone(DEFAULT_DATA.services);
    await saveSiteDataWithCleanup(previousData, data);
    renderServicesAdmin();
    populateOfferingServiceSelect();
    renderOfferingsAdmin(document.getElementById("offeringServiceId").value);
    alert("Services reset to default.");
  });

  document.getElementById("exportBtn").addEventListener("click", () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      data: getSiteData(),
      orders: getOrders()
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "yakafinity-backup.json";
    link.click();
    URL.revokeObjectURL(url);
  });

  document.getElementById("importInput").addEventListener("change", async (event) => {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    try {
      const previousData = getSiteData();
      const text = await file.text();
      const parsed = JSON.parse(text);
      if (!parsed.data || !parsed.orders) {
        alert("Invalid file format.");
        return;
      }
      await saveSiteDataWithCleanup(previousData, parsed.data);
      saveOrders(parsed.orders);
      const currentData = getSiteData();
      fillBrandForm(currentData);
      fillSiteContentForm(currentData);
      renderServicesAdmin();
      populateOfferingServiceSelect();
      renderOfferingsAdmin(document.getElementById("offeringServiceId").value);
      renderOrders();
      renderOrdersInbox();
      renderAdminStats();
      alert("Data imported successfully.");
    } catch {
      alert("Failed to import file.");
    } finally {
      event.target.value = "";
    }
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  if (!guardAdminPage()) return;
  const data = getSiteData();
  fillBrandForm(data);
  fillSiteContentForm(data);
  await syncSiteImageFolderStatus();
  setupSiteImageFolder();
  setupAdminSessionActions();
  setupBrandForm();
  setupSiteContentForm();
  setupAccessForm();
  setupServiceForm();
  setupServiceActions();
  populateOfferingServiceSelect();
  setupOfferingForm();
  setupOfferingActions();
  renderOfferingsAdmin(document.getElementById("offeringServiceId").value);
  setupOrdersActions();
  setupInboxActions();
  setupDataTools();
  renderAdminStats();
  renderOrdersInbox();
  renderServicesAdmin();
  renderOrders();
});
