const cms = window.PortfolioCMS;
let draft = null;
let pendingPortraitImage = null;
let pendingResumeDocument = null;
const pendingProjectImages = new WeakMap();
const pendingGalleryImages = new WeakMap();
const pendingProjectDocuments = new WeakMap();
const ACCEPTED_IMAGE_TYPES = ".jpg,.jpeg,.png,.webp,.gif,.bmp,.svg,.avif,.jfif,image/*";

const fieldMap = {
  name: "name",
  heroEyebrow: "heroEyebrow",
  heroTitle: "heroTitle",
  heroSummary: "heroSummary",
  heroCaptionTitle: "heroCaptionTitle",
  heroCaptionSubtitle: "heroCaptionSubtitle",
  heroSignal: "heroSignal",
  aboutText: "aboutText",
  education: "education",
  focus: "focus",
  location: "location",
  contactHeading: "contactHeading",
  contactText: "contactText"
};

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function guardPortfolioAdminPage() {
  if (typeof isAdminAuthenticated !== "function") return true;
  if (!isAdminAuthenticated()) {
    window.location.href = "manage-login.html";
    return false;
  }
  return true;
}

function setStatus(message, dirty) {
  const status = document.getElementById("save-status");
  status.textContent = message;
  status.dataset.dirty = dirty ? "true" : "false";
}

function setResumeStatus(value) {
  const status = document.getElementById("resume-status");
  if (!status) return;
  status.textContent = value ? `Current resume: ${value.split("/").pop()}` : "No resume file connected.";
}

function markDirty() {
  setStatus("Unsaved changes ready. Click Save All Changes to publish them.", true);
}

function createInput(labelText, value, onInput, type = "text") {
  const label = document.createElement("label");
  const span = document.createElement("span");
  span.textContent = labelText;
  const input = document.createElement(type === "textarea" ? "textarea" : "input");
  if (type !== "textarea") {
    input.type = type;
  } else {
    input.rows = 4;
  }
  input.value = value || "";
  input.addEventListener("input", () => {
    onInput(input.value);
    markDirty();
  });
  label.append(span, input);
  return label;
}

function createPreviewCard(image, altText) {
  const preview = document.createElement("div");
  preview.className = "inline-preview";
  preview.innerHTML = image ? `<img src="${image}" alt="${altText || "Preview"}">` : "<div class='empty-preview'>No image selected</div>";
  return preview;
}

function createImageEditor(labelText, currentImage, onSelect, onRemove, altText) {
  const wrap = document.createElement("div");
  wrap.className = "full-width";

  const label = document.createElement("label");
  const span = document.createElement("span");
  span.textContent = labelText;
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ACCEPTED_IMAGE_TYPES;
  input.addEventListener("change", () => {
    const [file] = input.files || [];
    if (!file) return;
    onSelect(file);
    render();
    markDirty();
  });
  label.append(span, input);

  const removeButton = document.createElement("button");
  removeButton.type = "button";
  removeButton.className = "button button-secondary";
  removeButton.textContent = "Remove Image";
  removeButton.addEventListener("click", () => {
    onRemove();
    render();
    markDirty();
  });

  wrap.append(label, removeButton, createPreviewCard(currentImage, altText));
  return wrap;
}

function createProjectDocumentEditor(project) {
  const wrap = document.createElement("div");
  wrap.className = "full-width";

  const label = document.createElement("label");
  const span = document.createElement("span");
  span.textContent = "Project Documents";
  const input = document.createElement("input");
  input.type = "file";
  input.multiple = true;
  input.accept = ".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.zip,.txt";
  input.addEventListener("change", () => {
    const files = Array.from(input.files || []);
    if (!files.length) return;
    const list = pendingProjectDocuments.get(project) || [];
    files.forEach((file) => list.push({ file }));
    pendingProjectDocuments.set(project, list);
    render();
    markDirty();
  });
  label.append(span, input);
  wrap.append(label);

  const list = document.createElement("div");
  list.className = "document-editor-list";

  (Array.isArray(project.documents) ? project.documents : []).forEach((doc, index) => {
    const row = document.createElement("div");
    row.className = "document-editor-item";
    row.innerHTML = `<div><strong>${doc.label || doc.name || "Document"}</strong><span>${doc.name || ""}</span></div>`;
    const button = document.createElement("button");
    button.type = "button";
    button.className = "button button-secondary";
    button.textContent = "Remove";
    button.addEventListener("click", () => {
      project.documents.splice(index, 1);
      render();
      markDirty();
    });
    row.appendChild(button);
    list.appendChild(row);
  });

  const pending = pendingProjectDocuments.get(project) || [];
  pending.forEach((entry, index) => {
    const row = document.createElement("div");
    row.className = "document-editor-item";
    row.innerHTML = `<div><strong>Pending document</strong><span>${entry.file.name}</span></div>`;
    const button = document.createElement("button");
    button.type = "button";
    button.className = "button button-secondary";
    button.textContent = "Remove Pending";
    button.addEventListener("click", () => {
      pending.splice(index, 1);
      if (pending.length) {
        pendingProjectDocuments.set(project, pending);
      } else {
        pendingProjectDocuments.delete(project);
      }
      render();
      markDirty();
    });
    row.appendChild(button);
    list.appendChild(row);
  });

  if (!list.children.length) {
    list.innerHTML = "<div class='empty-preview'>No documents selected</div>";
  }

  wrap.append(list);
  return wrap;
}

function createMultiImageEditor(frame, index) {
  const wrap = document.createElement("div");
  wrap.className = "full-width";

  const label = document.createElement("label");
  const span = document.createElement("span");
  span.textContent = "Frame Images";
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ACCEPTED_IMAGE_TYPES;
  input.multiple = true;
  input.addEventListener("change", () => {
    const files = Array.from(input.files || []);
    if (!files.length) return;
    const list = pendingGalleryImages.get(frame) || [];
    files.forEach((file) => {
      list.push({
        file,
        previewUrl: URL.createObjectURL(file)
      });
    });
    pendingGalleryImages.set(frame, list);
    render();
    markDirty();
  });
  label.append(span, input);
  wrap.append(label);

  const previews = document.createElement("div");
  previews.className = "gallery-image-editor-grid";

  const existingImages = Array.isArray(frame.images) ? frame.images : [];
  existingImages.forEach((image, imageIndex) => {
    const card = document.createElement("div");
    card.className = "gallery-image-editor-card";
    card.innerHTML = `<img src="${image}" alt="${frame.title} ${imageIndex + 1}">`;
    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.className = "button button-secondary";
    removeButton.textContent = "Remove";
    removeButton.addEventListener("click", () => {
      frame.images.splice(imageIndex, 1);
      frame.image = frame.images[0] || getGalleryFallback(index);
      render();
      markDirty();
    });
    card.appendChild(removeButton);
    previews.appendChild(card);
  });

  const pending = pendingGalleryImages.get(frame) || [];
  pending.forEach((entry, pendingIndex) => {
    const card = document.createElement("div");
    card.className = "gallery-image-editor-card";
    card.innerHTML = `<img src="${entry.previewUrl}" alt="${frame.title} pending ${pendingIndex + 1}">`;
    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.className = "button button-secondary";
    removeButton.textContent = "Remove Pending";
    removeButton.addEventListener("click", () => {
      URL.revokeObjectURL(entry.previewUrl);
      pending.splice(pendingIndex, 1);
      if (pending.length) {
        pendingGalleryImages.set(frame, pending);
      } else {
        pendingGalleryImages.delete(frame);
      }
      render();
      markDirty();
    });
    card.appendChild(removeButton);
    previews.appendChild(card);
  });

  if (!existingImages.length && !pending.length) {
    previews.innerHTML = "<div class='empty-preview'>No images selected</div>";
  }

  wrap.append(previews);
  return wrap;
}

function attachRemoveButton(card, collection, index) {
  const button = card.querySelector(".remove-button");
  button.addEventListener("click", () => {
    draft[collection].splice(index, 1);
    render();
    markDirty();
  });
}

function renderPreview(containerId, image) {
  const container = document.getElementById(containerId);
  container.innerHTML = image ? `<img src="${image}" alt="Preview">` : `<div class="empty-preview">No image selected</div>`;
}

function getProjectFallback(index) {
  return cms.createPlaceholderDataUrl(String(index + 1).padStart(2, "0"), "#0f766e", "#020617");
}

function getGalleryFallback(index) {
  return cms.createPlaceholderDataUrl(`Frame ${index + 1}`, "#1e293b", "#020617");
}

function normalizeFrame(item, index) {
  const images = Array.isArray(item.images) && item.images.length ? item.images.filter(Boolean) : [item.image || getGalleryFallback(index)];
  return {
    ...item,
    description: item.description || "Add a short explanation for this frame gallery.",
    images,
    image: images[0] || getGalleryFallback(index)
  };
}

function normalizeProject(item, index) {
  return {
    ...item,
    fullDescription: item.fullDescription || item.summary || "Add the full project description here.",
    image: item.image || getProjectFallback(index),
    documents: Array.isArray(item.documents) ? item.documents : []
  };
}

function getPendingImagePreview(entry) {
  return entry ? entry.previewUrl : "";
}

function setPendingWeakImage(store, item, file) {
  const previous = store.get(item);
  if (previous && previous.previewUrl) {
    URL.revokeObjectURL(previous.previewUrl);
  }
  store.set(item, {
    file,
    previewUrl: URL.createObjectURL(file)
  });
}

function clearPendingWeakImage(store, item) {
  const previous = store.get(item);
  if (previous && previous.previewUrl) {
    URL.revokeObjectURL(previous.previewUrl);
  }
  store.delete(item);
}

function clearPendingGalleryList(item) {
  const previous = pendingGalleryImages.get(item) || [];
  previous.forEach((entry) => URL.revokeObjectURL(entry.previewUrl));
  pendingGalleryImages.delete(item);
}

function clearPendingProjectDocs(item) {
  pendingProjectDocuments.delete(item);
}

function setPendingPortrait(file) {
  if (pendingPortraitImage && pendingPortraitImage.previewUrl) {
    URL.revokeObjectURL(pendingPortraitImage.previewUrl);
  }
  pendingPortraitImage = {
    file,
    previewUrl: URL.createObjectURL(file)
  };
}

function clearPendingPortrait() {
  if (pendingPortraitImage && pendingPortraitImage.previewUrl) {
    URL.revokeObjectURL(pendingPortraitImage.previewUrl);
  }
  pendingPortraitImage = null;
}

function setPendingResume(file) {
  pendingResumeDocument = { file };
}

function clearPendingResume() {
  pendingResumeDocument = null;
}

function collectManagedPortfolioUrls(data) {
  const urls = new Set();
  const imageLibrary = window.ProjectImageLibrary;
  if (!imageLibrary) return urls;

  const maybeAdd = (value) => {
    if (imageLibrary.isManagedUrl("portfolioAdmin", value)) {
      urls.add(imageLibrary.stripVersion(value));
    }
  };

  maybeAdd(data.portraitImage);
  maybeAdd(data.resumeUrl);
  (data.projects || []).forEach((project) => {
    maybeAdd(project.image);
    (project.documents || []).forEach((doc) => maybeAdd(doc.url));
  });
  (data.gallery || []).forEach((item) => {
    maybeAdd(item.image);
    (item.images || []).forEach((image) => maybeAdd(image));
  });
  return urls;
}

async function deleteRemovedPortfolioImages(previousData, nextData) {
  const imageLibrary = window.ProjectImageLibrary;
  if (!imageLibrary || !imageLibrary.isSupported()) return;

  const previousUrls = collectManagedPortfolioUrls(previousData);
  const nextUrls = collectManagedPortfolioUrls(nextData);

  for (const url of previousUrls) {
    if (!nextUrls.has(url)) {
      await imageLibrary.deleteImageFile("portfolioAdmin", url);
    }
  }
}

async function savePortfolioDataWithCleanup(previousData, nextData) {
  await cms.saveData(nextData);
  await deleteRemovedPortfolioImages(previousData, nextData);
}

async function syncPortfolioFolderStatus() {
  const status = document.getElementById("portfolio-folder-status");
  const button = document.getElementById("connect-portfolio-folder");
  if (!status || !button) return;

  const imageLibrary = window.ProjectImageLibrary;
  if (!imageLibrary || !imageLibrary.isSupported()) {
    status.textContent = "Folder-based image saving needs a modern Chromium browser on localhost or HTTPS.";
    button.disabled = true;
    return;
  }

  const details = await imageLibrary.getRootStatus("portfolioAdmin");
  status.textContent = details.label;
}

async function savePendingPortfolioImages(nextData) {
  const assetLibrary = window.ProjectImageLibrary;

  if (pendingPortraitImage) {
    nextData.portraitImage = await assetLibrary.saveImageFile("portfolioAdmin", "portrait", pendingPortraitImage.file, nextData.name || "portrait");
  }

  if (pendingResumeDocument) {
    nextData.resumeUrl = await assetLibrary.saveAssetFile("portfolioAdmin", "documents", pendingResumeDocument.file, `${nextData.name || "resume"}-resume`);
  }

  for (let index = 0; index < draft.projects.length; index += 1) {
    const item = draft.projects[index];
    const pendingImage = pendingProjectImages.get(item);
    if (pendingImage) {
      nextData.projects[index].image = await assetLibrary.saveImageFile(
        "portfolioAdmin",
        "projects",
        pendingImage.file,
        nextData.projects[index].title || `project-${index + 1}`
      );
    }

    const pendingDocs = pendingProjectDocuments.get(item) || [];
    const documents = Array.isArray(nextData.projects[index].documents) ? [...nextData.projects[index].documents] : [];
    for (let docIndex = 0; docIndex < pendingDocs.length; docIndex += 1) {
      const entry = pendingDocs[docIndex];
      const savedUrl = await assetLibrary.saveAssetFile(
        "portfolioAdmin",
        "documents",
        entry.file,
        `${nextData.projects[index].title || `project-${index + 1}`}-document-${docIndex + 1}`
      );
      documents.push({
        label: entry.file.name.replace(/\.[^.]+$/, ""),
        name: entry.file.name,
        url: savedUrl
      });
    }
    nextData.projects[index].documents = documents;
  }

  for (let index = 0; index < draft.gallery.length; index += 1) {
    const item = draft.gallery[index];
    const pending = pendingGalleryImages.get(item) || [];
    const savedImages = Array.isArray(nextData.gallery[index].images) ? [...nextData.gallery[index].images] : [];

    for (let pendingIndex = 0; pendingIndex < pending.length; pendingIndex += 1) {
      const entry = pending[pendingIndex];
      const saved = await assetLibrary.saveImageFile(
        "portfolioAdmin",
        "gallery",
        entry.file,
        `${nextData.gallery[index].title || `frame-${index + 1}`}-${pendingIndex + 1}`
      );
      savedImages.push(saved);
    }

    nextData.gallery[index].images = savedImages.length ? savedImages : [getGalleryFallback(index)];
    nextData.gallery[index].image = nextData.gallery[index].images[0];
  }
}

function clearAllPendingImages() {
  clearPendingPortrait();
  clearPendingResume();
  draft.projects.forEach((project) => {
    clearPendingWeakImage(pendingProjectImages, project);
    clearPendingProjectDocs(project);
  });
  draft.gallery.forEach((item) => clearPendingGalleryList(item));
}

function renderSimpleList(containerId, collection, buildCard) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";
  draft[collection].forEach((item, index) => {
    const card = document.getElementById("simple-item-template").content.firstElementChild.cloneNode(true);
    const grid = card.querySelector(".editor-card-grid");
    buildCard(grid, item, index);
    attachRemoveButton(card, collection, index);
    container.appendChild(card);
  });
}

function render() {
  if (!draft) return;

  draft.projects = draft.projects.map((item, index) => normalizeProject(item, index));
  draft.gallery = draft.gallery.map((item, index) => normalizeFrame(item, index));

  Object.entries(fieldMap).forEach(([id, key]) => {
    document.getElementById(id).value = draft[key] || "";
  });

  renderPreview("portrait-preview", getPendingImagePreview(pendingPortraitImage) || draft.portraitImage);
  setResumeStatus(pendingResumeDocument ? pendingResumeDocument.file.name : draft.resumeUrl);

  renderSimpleList("pill-list", "heroPills", (grid, item, index) => {
    grid.appendChild(createInput("Label", item, (value) => {
      draft.heroPills[index] = value;
    }));
  });

  renderSimpleList("stat-list", "stats", (grid, item, index) => {
    grid.appendChild(createInput("Value", item.value, (value) => {
      draft.stats[index].value = value;
    }));
    grid.appendChild(createInput("Label", item.label, (value) => {
      draft.stats[index].label = value;
    }));
  });

  renderSimpleList("service-list", "services", (grid, item, index) => {
    grid.appendChild(createInput("Title", item.title, (value) => {
      draft.services[index].title = value;
    }));
    grid.appendChild(createInput("Text", item.text, (value) => {
      draft.services[index].text = value;
    }, "textarea"));
  });

  renderSimpleList("project-list", "projects", (grid, item, index) => {
    grid.appendChild(createInput("Title", item.title, (value) => {
      draft.projects[index].title = value;
    }));
    grid.appendChild(createInput("Category", item.category, (value) => {
      draft.projects[index].category = value;
    }));
    grid.appendChild(createInput("Summary", item.summary, (value) => {
      draft.projects[index].summary = value;
    }, "textarea"));
    grid.appendChild(createInput("Full Description", item.fullDescription || "", (value) => {
      draft.projects[index].fullDescription = value;
    }, "textarea"));
    grid.appendChild(createInput("Tags (comma separated)", Array.isArray(item.tags) ? item.tags.join(", ") : "", (value) => {
      draft.projects[index].tags = value.split(",").map((tag) => tag.trim()).filter(Boolean);
    }));
    grid.appendChild(createInput("Project Link", item.link, (value) => {
      draft.projects[index].link = value;
    }));
    grid.appendChild(
      createImageEditor(
        "Project Image",
        getPendingImagePreview(pendingProjectImages.get(item)) || item.image,
        (file) => setPendingWeakImage(pendingProjectImages, item, file),
        () => {
          clearPendingWeakImage(pendingProjectImages, item);
          draft.projects[index].image = getProjectFallback(index);
        },
        item.title
      )
    );
    grid.appendChild(createProjectDocumentEditor(item));
  });

  renderSimpleList("gallery-list", "gallery", (grid, item, index) => {
    grid.appendChild(createInput("Frame Title", item.title, (value) => {
      draft.gallery[index].title = value;
    }));
    grid.appendChild(createInput("Frame Type", item.type, (value) => {
      draft.gallery[index].type = value;
    }));
    grid.appendChild(createInput("Frame Description", item.description || "", (value) => {
      draft.gallery[index].description = value;
    }, "textarea"));
    grid.appendChild(createMultiImageEditor(item, index));
  });

  renderSimpleList("contact-list", "contacts", (grid, item, index) => {
    grid.appendChild(createInput("Label", item.label, (value) => {
      draft.contacts[index].label = value;
    }));
    grid.appendChild(createInput("Display Value", item.value, (value) => {
      draft.contacts[index].value = value;
    }));
    grid.appendChild(createInput("Link / href", item.href, (value) => {
      draft.contacts[index].href = value;
    }));
  });
}

Object.entries(fieldMap).forEach(([id, key]) => {
  document.getElementById(id).addEventListener("input", (event) => {
    if (!draft) return;
    draft[key] = event.target.value;
    markDirty();
  });
});

document.getElementById("portraitImage").addEventListener("change", (event) => {
  if (!draft) return;
  const [file] = event.target.files || [];
  if (!file) return;
  setPendingPortrait(file);
  renderPreview("portrait-preview", pendingPortraitImage.previewUrl);
  markDirty();
});

document.getElementById("resumeFile").addEventListener("change", (event) => {
  if (!draft) return;
  const [file] = event.target.files || [];
  if (!file) return;
  setPendingResume(file);
  setResumeStatus(file.name);
  markDirty();
});

document.getElementById("remove-portrait").addEventListener("click", () => {
  if (!draft) return;
  clearPendingPortrait();
  draft.portraitImage = cms.defaultData.portraitImage;
  renderPreview("portrait-preview", draft.portraitImage);
  markDirty();
});

document.getElementById("remove-resume").addEventListener("click", () => {
  if (!draft) return;
  clearPendingResume();
  draft.resumeUrl = "";
  setResumeStatus("");
  markDirty();
});

document.getElementById("connect-portfolio-folder").addEventListener("click", async () => {
  try {
    await window.ProjectImageLibrary.connectRoot("portfolioAdmin");
    await syncPortfolioFolderStatus();
    setStatus("Portfolio image folder connected.", false);
  } catch (error) {
    setStatus(error.message || "Failed to connect the portfolio image folder.", false);
  }
});

document.getElementById("add-pill").addEventListener("click", () => {
  if (!draft) return;
  draft.heroPills.push("New Pill");
  render();
  markDirty();
});

document.getElementById("add-stat").addEventListener("click", () => {
  if (!draft) return;
  draft.stats.push({ value: "00", label: "New stat" });
  render();
  markDirty();
});

document.getElementById("add-service").addEventListener("click", () => {
  if (!draft) return;
  draft.services.push({ title: "New service", text: "Describe this capability." });
  render();
  markDirty();
});

document.getElementById("add-project").addEventListener("click", () => {
  if (!draft) return;
  const count = draft.projects.length + 1;
  draft.projects.push({
    title: `Project ${count}`,
    category: "New category",
    summary: "Add a project description.",
    fullDescription: "Add the full project description, process, stack, results, and supporting details.",
    image: cms.createPlaceholderDataUrl(String(count).padStart(2, "0"), "#0f766e", "#020617"),
    tags: ["Tag 1", "Tag 2"],
    documents: [],
    link: "#"
  });
  render();
  markDirty();
});

document.getElementById("add-gallery").addEventListener("click", () => {
  if (!draft) return;
  const count = draft.gallery.length + 1;
  const placeholder = cms.createPlaceholderDataUrl(`Frame ${count}`, "#1e293b", "#020617");
  draft.gallery.push({
    title: `Frame ${String(count).padStart(2, "0")}`,
    type: "Media",
    description: "Add a short explanation for this frame gallery.",
    image: placeholder,
    images: [placeholder]
  });
  render();
  markDirty();
});

document.getElementById("add-contact").addEventListener("click", () => {
  if (!draft) return;
  draft.contacts.push({ label: "New Link", value: "Details", href: "#" });
  render();
  markDirty();
});

document.getElementById("save-all").addEventListener("click", async () => {
  if (!draft) return;
  try {
    const previousData = await cms.getData();
    const nextData = clone(draft);
    nextData.projects = nextData.projects.map((item, index) => normalizeProject(item, index));
    nextData.gallery = nextData.gallery.map((item, index) => normalizeFrame(item, index));
    await savePendingPortfolioImages(nextData);
    await savePortfolioDataWithCleanup(previousData, nextData);
    clearAllPendingImages();
    draft = clone(nextData);
    render();
    setStatus("Changes saved. The portfolio page will use this updated content.", false);
  } catch (error) {
    setStatus(error.message || "Could not save changes.", true);
  }
});

document.getElementById("reset-defaults").addEventListener("click", async () => {
  try {
    const previousData = await cms.getData();
    const nextData = await cms.resetData();
    await deleteRemovedPortfolioImages(previousData, nextData);
    clearAllPendingImages();
    draft = clone(nextData);
    render();
    setStatus("Defaults restored. The portfolio has been reset to the original starter content.", false);
  } catch (error) {
    setStatus(error.message || "Could not reset the portfolio.", true);
  }
});

document.getElementById("export-data").addEventListener("click", () => {
  if (!draft) return;
  const blob = new Blob([JSON.stringify(draft, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "tharindu-portfolio-content.json";
  anchor.click();
  URL.revokeObjectURL(url);
  setStatus("Content exported as JSON.", false);
});

async function initManager() {
  if (!guardPortfolioAdminPage()) return;
  draft = clone(await cms.getData());
  draft.projects = draft.projects.map((item, index) => normalizeProject(item, index));
  draft.gallery = draft.gallery.map((item, index) => normalizeFrame(item, index));
  await syncPortfolioFolderStatus();
  render();
}

initManager();
