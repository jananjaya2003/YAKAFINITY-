function getContactLogo(label) {
  const key = String(label || "").toLowerCase();

  if (key.includes("email")) return "assets/contact-logos/email.svg";
  if (key.includes("instagram")) return "assets/contact-logos/instagram.svg";
  if (key.includes("linkedin")) return "assets/contact-logos/linkedin.svg";
  return "assets/contact-logos/email.svg";
}

function setText(id, value) {
  const element = document.getElementById(id);
  if (element) {
    element.textContent = value;
  }
}

function renderFooterResume(data) {
  const element = document.getElementById("footer-copy");
  if (!element) return;

  if (data.resumeUrl) {
    element.innerHTML = `<a href="${data.resumeUrl}" download>Portfolio of ${data.name}.</a>`;
    return;
  }

  element.textContent = `Portfolio of ${data.name}.`;
}

function getGalleryCover(item, index) {
  const images = Array.isArray(item.images) ? item.images.filter(Boolean) : [];
  return images[0] || item.image || window.PortfolioCMS.createPlaceholderDataUrl(item.title || `Frame ${index + 1}`, "#d6e4f0", "#aebfd0");
}

function getFrameDetailHref(index) {
  return `frame-detail.html?frame=${index}`;
}

function renderHeroPills(items) {
  const heroPills = document.getElementById("hero-pills");
  if (!heroPills) return;
  heroPills.innerHTML = "";
  items.forEach((pill) => {
    const span = document.createElement("span");
    span.className = "hero-pill";
    span.textContent = pill;
    heroPills.appendChild(span);
  });
}

function renderStats(items) {
  const statsBand = document.getElementById("stats-band");
  if (!statsBand) return;
  statsBand.innerHTML = "";
  items.forEach((stat) => {
    const article = document.createElement("article");
    article.className = "stat-card";
    article.innerHTML = `<strong>${stat.value}</strong><span>${stat.label}</span>`;
    statsBand.appendChild(article);
  });
}

function renderServices(items) {
  const servicesGrid = document.getElementById("services-grid");
  if (!servicesGrid) return;
  servicesGrid.innerHTML = "";
  items.forEach((service, index) => {
    const article = document.createElement("article");
    article.className = "service-card";
    article.innerHTML = `
      <span class="service-index">0${index + 1}</span>
      <h3>${service.title}</h3>
      <p>${service.text}</p>
    `;
    servicesGrid.appendChild(article);
  });
}

function getProjectDetailHref(index) {
  return `project-detail.html?project=${index}`;
}

function projectCardMarkup(project, index) {
  const tags = Array.isArray(project.tags) ? project.tags : [];
  return `
    <div class="project-image-wrap">
      <img src="${project.image || window.PortfolioCMS.createPlaceholderDataUrl(project.title || "Project", "#bdd5ea", "#8faec9")}" alt="${project.title}">
    </div>
    <div class="project-copy">
      <span class="project-category">${project.category}</span>
      <h3>${project.title}</h3>
      <p>${project.summary}</p>
      <div class="tag-row">${tags.map((tag) => `<span>${tag}</span>`).join("")}</div>
      <a class="project-link-button" href="${getProjectDetailHref(index)}">View Project</a>
    </div>
  `;
}

function renderProjects(rootId, items, limit) {
  const root = document.getElementById(rootId);
  if (!root) return;
  root.innerHTML = "";
  const list = typeof limit === "number" ? items.slice(0, limit) : items;
  list.forEach((project, index) => {
    const article = document.createElement("article");
    article.className = "project-card";
    article.innerHTML = projectCardMarkup(project, index);
    root.appendChild(article);
  });
}

function galleryCardMarkup(item, index, linked) {
  const inner = `
    <img src="${getGalleryCover(item, index)}" alt="${item.title}">
    <figcaption>
      <span>${item.type}</span>
      <strong>${item.title}</strong>
    </figcaption>
  `;

  return linked ? `<a class="gallery-card-link" href="${getFrameDetailHref(index)}">${inner}</a>` : inner;
}

function renderGallery(rootId, items, options = {}) {
  const root = document.getElementById(rootId);
  if (!root) return;
  root.innerHTML = "";
  const { limit, linked = false, startIndex = 0 } = options;
  const list = typeof limit === "number" ? items.slice(0, limit) : items;
  list.forEach((item, index) => {
    const figure = document.createElement("figure");
    figure.className = `gallery-card gallery-card-${(index % 3) + 1}`;
    figure.innerHTML = galleryCardMarkup(item, startIndex + index, linked);
    root.appendChild(figure);
  });
}

function renderFrameBlocks(rootId, allItems, items) {
  const root = document.getElementById(rootId);
  if (!root) return;
  root.innerHTML = "";
  items.forEach((item, index) => {
    const frameIndex = allItems.indexOf(item);
    const article = document.createElement("article");
    article.className = "frame-block panel-card";
    article.innerHTML = `
      <div class="frame-block-head">
        <div>
          <p class="eyebrow">${item.type}</p>
          <h2>${item.title}</h2>
        </div>
        <a class="section-link" href="${getFrameDetailHref(frameIndex)}">Open ${item.title}</a>
      </div>
      <div class="gallery-grid archive-grid frame-preview-grid">
        ${(Array.isArray(item.images) ? item.images : [getGalleryCover(item, index)])
          .slice(0, 3)
          .map(
            (image, imageIndex) => `
              <figure class="gallery-card gallery-card-${(imageIndex % 3) + 1}">
                <a class="gallery-card-link" href="${getFrameDetailHref(frameIndex)}">
                  <img src="${image}" alt="${item.title} image ${imageIndex + 1}">
                  <figcaption>
                    <span>${item.type}</span>
                    <strong>${item.title}</strong>
                  </figcaption>
                </a>
              </figure>
            `
          )
          .join("")}
      </div>
    `;
    root.appendChild(article);
  });
}

function renderContactLinks(items) {
  const contactLinks = document.getElementById("contact-links");
  if (!contactLinks) return;
  contactLinks.innerHTML = "";
  items.forEach((contact) => {
    const anchor = document.createElement("a");
    anchor.className = "contact-link";
    anchor.href = contact.href || "#";
    if (contact.href && !contact.href.startsWith("mailto:") && contact.href !== "#") {
      anchor.target = "_blank";
      anchor.rel = "noreferrer";
    }
    anchor.innerHTML = `
      <span class="contact-icon" aria-hidden="true">
        <img src="${getContactLogo(contact.label)}" alt="${contact.label} logo">
      </span>
      <span class="contact-meta">
        <span>${contact.label}</span>
        <strong>${contact.value}</strong>
      </span>
    `;
    contactLinks.appendChild(anchor);
  });
}

function filterMedia(items, matcher) {
  return items.filter((item) => matcher(String(item.type || "").toLowerCase()));
}

function toggleSection(sectionId, shouldShow) {
  const section = document.getElementById(sectionId);
  if (section) {
    section.hidden = !shouldShow;
  }
}

async function renderProjectDetail() {
  const detailRoot = document.getElementById("project-detail-page");
  if (!detailRoot) return;

  const data = await window.PortfolioCMS.getData();
  const params = new URLSearchParams(window.location.search);
  const requestedIndex = Number(params.get("project"));
  const projectIndex = Number.isInteger(requestedIndex) && requestedIndex >= 0 && requestedIndex < data.projects.length ? requestedIndex : 0;
  const project = data.projects[projectIndex];

  document.title = `${project.title} | ${data.name}`;
  setText("site-brand-name", data.name);
  renderFooterResume(data);
  setText("project-detail-eyebrow", project.category || "Project");
  setText("project-detail-title", project.title);
  setText("project-detail-summary", project.summary);
  setText("project-detail-description", project.fullDescription || project.summary);
  setText("project-detail-shot-label", `${project.title} Screenshot`);

  const detailImage = document.getElementById("project-detail-image");
  if (detailImage) {
    detailImage.src = project.image || window.PortfolioCMS.createPlaceholderDataUrl(project.title || "Project", "#bdd5ea", "#8faec9");
    detailImage.alt = `${project.title} screenshot`;
  }

  const tagsRoot = document.getElementById("project-detail-tags");
  if (tagsRoot) {
    const tags = Array.isArray(project.tags) ? project.tags : [];
    tagsRoot.innerHTML = tags.map((tag) => `<span>${tag}</span>`).join("");
  }

  const docsSection = document.getElementById("project-detail-documents-section");
  const docsRoot = document.getElementById("project-detail-documents");
  if (docsSection && docsRoot) {
    const documents = Array.isArray(project.documents) ? project.documents : [];
    docsSection.hidden = documents.length === 0;
    docsRoot.innerHTML = documents
      .map(
        (doc) => `
          <a class="project-document-link" href="${doc.url}" target="_blank" rel="noreferrer">
            <span>${doc.label || doc.name || "Document"}</span>
            <strong>${doc.name || "Open file"}</strong>
          </a>
        `
      )
      .join("");
  }

  const liveLink = document.getElementById("project-detail-live-link");
  if (liveLink) {
    if (project.link && project.link !== "#") {
      liveLink.href = project.link;
      liveLink.hidden = false;
    } else {
      liveLink.hidden = true;
    }
  }
}

async function renderFrameDetail() {
  const detailRoot = document.getElementById("frame-detail-page");
  if (!detailRoot) return;

  const data = await window.PortfolioCMS.getData();
  const params = new URLSearchParams(window.location.search);
  const requestedIndex = Number(params.get("frame"));
  const frameIndex = Number.isInteger(requestedIndex) && requestedIndex >= 0 && requestedIndex < data.gallery.length ? requestedIndex : 0;
  const frame = data.gallery[frameIndex];
  const images = Array.isArray(frame.images) && frame.images.length ? frame.images : [getGalleryCover(frame, frameIndex)];

  document.title = `${frame.title} | ${data.name}`;
  setText("site-brand-name", data.name);
  renderFooterResume(data);
  setText("frame-detail-eyebrow", frame.type || "Gallery");
  setText("frame-detail-title", frame.title);
  setText("frame-detail-summary", `Browse the full ${frame.title} gallery.`);
  setText("frame-detail-description", frame.description || "See all images inside this frame.");
  setText("frame-detail-count", `${images.length} image${images.length === 1 ? "" : "s"} in this frame`);

  const grid = document.getElementById("frame-detail-grid");
  if (grid) {
    grid.innerHTML = images
      .map(
        (image, index) => `
          <figure class="frame-detail-card panel-card">
            <img src="${image}" alt="${frame.title} image ${index + 1}">
            <figcaption>${frame.title} ${index + 1}</figcaption>
          </figure>
        `
      )
      .join("");
  }
}

async function renderSite() {
  const data = await window.PortfolioCMS.getData();

  document.title = document.body.dataset.pageTitle || `${data.name} | AI, Technology & Visual Storytelling`;
  setText("site-brand-name", data.name);
  setText("hero-eyebrow", data.heroEyebrow);
  setText("hero-title", data.heroTitle);
  setText("hero-summary", data.heroSummary);
  setText("hero-caption-title", data.heroCaptionTitle);
  setText("hero-caption-subtitle", data.heroCaptionSubtitle);
  setText("hero-signal", data.heroSignal);
  setText("about-text", data.aboutText);
  setText("education-line", data.education);
  setText("focus-line", data.focus);
  setText("location-line", data.location);
  setText("contact-heading", data.contactHeading);
  setText("contact-text", data.contactText);
  renderFooterResume(data);

  const portrait = document.getElementById("hero-portrait");
  if (portrait) {
    portrait.src = data.portraitImage || "JB.png";
  }

  renderHeroPills(data.heroPills);
  renderStats(data.stats);
  renderServices(data.services);
  renderProjects("projects-grid", data.projects, 4);
  renderProjects("projects-grid-all", data.projects);
  renderGallery("gallery-grid", data.gallery, { limit: 3, linked: true, startIndex: 0 });

  const photographyItems = filterMedia(data.gallery, (type) => type.includes("photo"));
  const videographyItems = filterMedia(data.gallery, (type) => type.includes("video"));
  const otherMediaItems = data.gallery.filter(
    (item) => !photographyItems.includes(item) && !videographyItems.includes(item)
  );

  renderFrameBlocks("gallery-photography", data.gallery, photographyItems);
  renderFrameBlocks("gallery-videography", data.gallery, videographyItems);
  renderFrameBlocks("gallery-creative", data.gallery, otherMediaItems);

  toggleSection("media-photography-section", photographyItems.length > 0);
  toggleSection("media-videography-section", videographyItems.length > 0);
  toggleSection("media-creative-section", otherMediaItems.length > 0);

  renderContactLinks(data.contacts);
}

renderSite();
renderProjectDetail();
renderFrameDetail();
