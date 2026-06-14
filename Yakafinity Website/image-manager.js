(function () {
  const DB_NAME = "yakafinity-image-library";
  const STORE_NAME = "directory-handles";

  const ROOTS = {
    siteAdmin: {
      storageKey: "site-admin-root",
      projectBase: "admin-images/site-admin",
      publicBase: "../admin-images/site-admin"
    },
    portfolioAdmin: {
      storageKey: "portfolio-admin-root",
      projectBase: "admin-images/portfolio-admin",
      publicBase: "../admin-images/portfolio-admin"
    }
  };

  const ACCEPTED_IMAGE_EXTENSIONS = new Set(["jpg", "jpeg", "png", "webp", "gif", "bmp", "svg", "avif", "jfif"]);

  function isSupported() {
    return typeof window.showDirectoryPicker === "function" && "indexedDB" in window;
  }

  function sanitizeSegment(value) {
    return String(value || "image")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "image";
  }

  function getExtension(fileName) {
    const match = String(fileName || "").toLowerCase().match(/\.([a-z0-9]+)$/);
    return match ? match[1] : "png";
  }

  function isAcceptedImageFile(file) {
    if (!file) return false;
    const type = String(file.type || "").toLowerCase();
    if (type.startsWith("image/")) return true;
    return ACCEPTED_IMAGE_EXTENSIONS.has(getExtension(file.name));
  }

  function stripVersion(url) {
    return String(url || "").split("?")[0].replace(/\\/g, "/");
  }

  function normalizeManagedPath(rootKey, url) {
    const root = ROOTS[rootKey];
    if (!root) return null;
    const cleanUrl = stripVersion(url);
    const prefixes = [root.publicBase, root.projectBase].map((prefix) => prefix.replace(/\\/g, "/"));
    for (const prefix of prefixes) {
      if (cleanUrl === prefix) return "";
      if (cleanUrl.startsWith(`${prefix}/`)) {
        return cleanUrl.slice(prefix.length + 1);
      }
    }
    return null;
  }

  function isManagedUrl(rootKey, url) {
    return normalizeManagedPath(rootKey, url) !== null;
  }

  function toPublicUrl(rootKey, relativePath) {
    const root = ROOTS[rootKey];
    const cleanPath = String(relativePath || "").replace(/\\/g, "/").replace(/^\/+/, "");
    return cleanPath ? `${root.publicBase}/${cleanPath}?v=${Date.now()}` : "";
  }

  function readFileAsDataUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ""));
      reader.onerror = () => reject(reader.error || new Error("Could not read the selected file."));
      reader.readAsDataURL(file);
    });
  }

  function loadImageElement(file) {
    return new Promise((resolve, reject) => {
      const objectUrl = URL.createObjectURL(file);
      const image = new Image();
      image.onload = () => {
        URL.revokeObjectURL(objectUrl);
        resolve(image);
      };
      image.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        reject(new Error("Could not process the selected image."));
      };
      image.src = objectUrl;
    });
  }

  async function createInlineImageUrl(file, options = {}) {
    if (!isAcceptedImageFile(file)) {
      throw new Error("Please upload a valid image file like JPG, PNG, WEBP, GIF, BMP, SVG, or AVIF.");
    }

    const type = String(file.type || "").toLowerCase();
    if (type === "image/svg+xml" || getExtension(file.name) === "svg") {
      return readFileAsDataUrl(file);
    }

    const image = await loadImageElement(file);
    const maxWidth = Number(options.maxWidth || 1600);
    const maxHeight = Number(options.maxHeight || 1600);
    const quality = Number(options.quality || 0.86);
    const outputType = options.outputType || "image/webp";

    const scale = Math.min(1, maxWidth / image.naturalWidth, maxHeight / image.naturalHeight);
    const width = Math.max(1, Math.round(image.naturalWidth * scale));
    const height = Math.max(1, Math.round(image.naturalHeight * scale));

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context) {
      return readFileAsDataUrl(file);
    }

    context.drawImage(image, 0, 0, width, height);
    return canvas.toDataURL(outputType, quality);
  }

  async function createInlineAssetUrl(file) {
    return readFileAsDataUrl(file);
  }

  function openDb() {
    return new Promise((resolve, reject) => {
      const request = window.indexedDB.open(DB_NAME, 1);
      request.onupgradeneeded = () => {
        if (!request.result.objectStoreNames.contains(STORE_NAME)) {
          request.result.createObjectStore(STORE_NAME);
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async function withStore(mode, run) {
    const db = await openDb();
    try {
      return await new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, mode);
        const store = tx.objectStore(STORE_NAME);
        Promise.resolve(run(store, tx)).then(resolve).catch(reject);
        tx.onerror = () => reject(tx.error);
      });
    } finally {
      db.close();
    }
  }

  function getRootConfig(rootKey) {
    const root = ROOTS[rootKey];
    if (!root) {
      throw new Error(`Unknown image root: ${rootKey}`);
    }
    return root;
  }

  async function getStoredHandle(rootKey) {
    const root = getRootConfig(rootKey);
    return withStore("readonly", (store) => {
      return new Promise((resolve, reject) => {
        const request = store.get(root.storageKey);
        request.onsuccess = () => resolve(request.result || null);
        request.onerror = () => reject(request.error);
      });
    });
  }

  async function setStoredHandle(rootKey, handle) {
    const root = getRootConfig(rootKey);
    return withStore("readwrite", (store) => {
      return new Promise((resolve, reject) => {
        const request = store.put(handle, root.storageKey);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    });
  }

  async function clearStoredHandle(rootKey) {
    const root = getRootConfig(rootKey);
    return withStore("readwrite", (store) => {
      return new Promise((resolve, reject) => {
        const request = store.delete(root.storageKey);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    });
  }

  async function verifyPermission(handle, write = false) {
    if (!handle) return false;
    const options = write ? { mode: "readwrite" } : {};
    if ((await handle.queryPermission(options)) === "granted") {
      return true;
    }
    return (await handle.requestPermission(options)) === "granted";
  }

  async function connectRoot(rootKey) {
    if (!isSupported()) {
      throw new Error("This browser does not support folder-based image management.");
    }
    const handle = await window.showDirectoryPicker({ mode: "readwrite", id: rootKey });
    const granted = await verifyPermission(handle, true);
    if (!granted) {
      throw new Error("Folder permission was not granted.");
    }
    await setStoredHandle(rootKey, handle);
    return handle.name;
  }

  async function disconnectRoot(rootKey) {
    await clearStoredHandle(rootKey);
  }

  async function getRootHandle(rootKey, write = false) {
    const handle = await getStoredHandle(rootKey);
    if (!handle) return null;
    const granted = await verifyPermission(handle, write);
    if (!granted) return null;
    return handle;
  }

  async function ensureFolder(handle, segments) {
    let current = handle;
    for (const segment of segments) {
      current = await current.getDirectoryHandle(segment, { create: true });
    }
    return current;
  }

  async function saveAssetFile(rootKey, folderPath, file, nameBase) {
    const rootHandle = await getRootHandle(rootKey, true);
    if (!rootHandle) {
      throw new Error("Connect the image folder first.");
    }

    const segments = String(folderPath || "")
      .split("/")
      .map((segment) => segment.trim())
      .filter(Boolean);
    const targetFolder = await ensureFolder(rootHandle, segments);
    const fileName = `${sanitizeSegment(nameBase)}-${Date.now()}.${getExtension(file.name)}`;
    const fileHandle = await targetFolder.getFileHandle(fileName, { create: true });
    const writable = await fileHandle.createWritable();
    await writable.write(file);
    await writable.close();
    return toPublicUrl(rootKey, [...segments, fileName].join("/"));
  }

  async function saveImageFile(rootKey, folderPath, file, nameBase) {
    if (!isAcceptedImageFile(file)) {
      throw new Error("Please upload a valid image file like JPG, PNG, WEBP, GIF, BMP, SVG, or AVIF.");
    }
    return saveAssetFile(rootKey, folderPath, file, nameBase);
  }

  async function saveAssetWithFallback(rootKey, folderPath, file, nameBase) {
    const rootHandle = await getRootHandle(rootKey, true);
    if (rootHandle) {
      const segments = String(folderPath || "")
        .split("/")
        .map((segment) => segment.trim())
        .filter(Boolean);
      const targetFolder = await ensureFolder(rootHandle, segments);
      const fileName = `${sanitizeSegment(nameBase)}-${Date.now()}.${getExtension(file.name)}`;
      const fileHandle = await targetFolder.getFileHandle(fileName, { create: true });
      const writable = await fileHandle.createWritable();
      await writable.write(file);
      await writable.close();
      return toPublicUrl(rootKey, [...segments, fileName].join("/"));
    }
    return createInlineAssetUrl(file);
  }

  async function saveImageWithFallback(rootKey, folderPath, file, nameBase, options) {
    const rootHandle = await getRootHandle(rootKey, true);
    if (rootHandle) {
      const segments = String(folderPath || "")
        .split("/")
        .map((segment) => segment.trim())
        .filter(Boolean);
      const targetFolder = await ensureFolder(rootHandle, segments);
      const fileName = `${sanitizeSegment(nameBase)}-${Date.now()}.${getExtension(file.name)}`;
      const fileHandle = await targetFolder.getFileHandle(fileName, { create: true });
      const writable = await fileHandle.createWritable();
      await writable.write(file);
      await writable.close();
      return toPublicUrl(rootKey, [...segments, fileName].join("/"));
    }
    return createInlineImageUrl(file, options);
  }

  async function deleteImageFile(rootKey, url) {
    const rootHandle = await getRootHandle(rootKey, true);
    const relativePath = normalizeManagedPath(rootKey, url);
    if (!rootHandle || !relativePath) return false;

    const parts = relativePath.split("/").filter(Boolean);
    const fileName = parts.pop();
    if (!fileName) return false;

    try {
      const folder = await ensureFolder(rootHandle, parts);
      await folder.removeEntry(fileName);
      return true;
    } catch {
      return false;
    }
  }

  async function getRootStatus(rootKey) {
    const root = getRootConfig(rootKey);
    const handle = await getStoredHandle(rootKey);
    if (!handle) {
      return {
        connected: false,
        label: `Browser storage upload mode is active. Connect ${root.projectBase} only if you want files written into the local project folder.`
      };
    }

    const granted = await verifyPermission(handle, true);
    return {
      connected: granted,
      label: granted
        ? `Connected folder: ${handle.name}. New uploads will be written as real project files.`
        : `Browser storage upload mode is active. Reconnect ${root.projectBase} if you want file-based saving again.`
    };
  }

  window.ProjectImageLibrary = {
    createInlineAssetUrl,
    createInlineImageUrl,
    connectRoot,
    deleteImageFile,
    disconnectRoot,
    getRootStatus,
    isManagedUrl,
    isSupported,
    saveAssetFile,
    saveAssetWithFallback,
    saveImageFile,
    saveImageWithFallback,
    stripVersion
  };
})();
