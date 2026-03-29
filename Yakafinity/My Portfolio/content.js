(function () {
  const STORAGE_KEY = "tharindu-portfolio-content-v1";
  const DB_NAME = "tharindu-portfolio-db";
  const STORE_NAME = "content";
  const RECORD_KEY = "site-content";

  function createPlaceholderDataUrl(title, accentA, accentB) {
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 900">
        <defs>
          <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="${accentA}" />
            <stop offset="100%" stop-color="${accentB}" />
          </linearGradient>
        </defs>
        <rect width="1200" height="900" fill="url(#bg)" />
        <circle cx="1020" cy="180" r="150" fill="rgba(255,255,255,0.15)" />
        <circle cx="200" cy="720" r="230" fill="rgba(0,0,0,0.2)" />
        <text x="90" y="720" fill="white" font-size="96" font-family="Space Grotesk, Arial, sans-serif">Project</text>
        <text x="90" y="820" fill="white" font-size="82" font-family="Fraunces, Georgia, serif">${title}</text>
      </svg>
    `;
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
  }

  const defaultContacts = [
    { label: "Email", value: "jananjayabandara2003", href: "mailto:jananjayabandara2003@gmail.com" },
    { label: "Instagram", value: "tharindu_jb", href: "https://instagram.com/tharindu_jb" },
    { label: "LinkedIn", value: "jananjaya2003", href: "https://linkedin.com/in/jananjaya2003" }
  ];

  const defaultData = {
    name: "Tharindu J Bandara",
    heroEyebrow: "BSc Computer Science with AI | Coventry University",
    heroTitle: "I build premium tech experiences, AI solutions, and visual stories.",
    heroSummary:
      "I am Tharindu J Bandara, a Computer Science with AI undergraduate at Coventry University. My work sits between software, intelligent systems, photography, and videography, helping ideas feel advanced, useful, and cinematic at the same time.",
    heroCaptionTitle: "Tech Builder",
    heroCaptionSubtitle: "AI solutions | Photography | Videography",
    heroSignal: "AI-powered products with strong visual identity",
    portraitImage: "JB.png",
    resumeUrl: "Resume.pdf",
    heroPills: [
      "AI Solutions",
      "Full Digital Concepts",
      "Photography Direction",
      "Videography Production"
    ],
    aboutText:
      "I am currently studying BSc Computer Science with AI at Coventry University, and I enjoy turning ambitious ideas into polished digital experiences. My interests move across software engineering, AI-assisted solutions, automation, interface design, photography, and videography. I like work that combines technical depth with creative presentation, especially when AI helps make products smarter, more personal, or more efficient.",
    education: "BSc Computer Science with AI, Coventry University",
    focus: "Tech products, AI solutions, content systems, and visual storytelling",
    location: "Sri Lanka",
    stats: [
      { value: "05", label: "Starter projects ready to customize" },
      { value: "AI", label: "Driven problem solving" },
      { value: "360", label: "Blend of code, visuals, and product thinking" }
    ],
    services: [
      {
        title: "AI Solutions",
        text: "Practical AI concepts, smart automations, and product ideas shaped for real use."
      },
      {
        title: "Web Experiences",
        text: "Premium interfaces and portfolio-grade websites with smooth motion and strong identity."
      },
      {
        title: "Photography",
        text: "Portraits, visual direction, and image-led presentation for personal and brand storytelling."
      },
      {
        title: "Videography",
        text: "Cinematic thinking for reels, edits, motion scenes, and digital-first visual narratives."
      }
    ],
    projects: [
      {
        title: "Project 1",
        category: "AI / Product",
        summary: "Placeholder for an AI-powered build. Replace this with your real project description in the management page.",
        fullDescription: "Add the full project story, process, goals, stack, and delivery notes here.",
        image: createPlaceholderDataUrl("01", "#0d9488", "#0f172a"),
        tags: ["AI", "Web", "Automation"],
        documents: [],
        link: "#"
      },
      {
        title: "Project 2",
        category: "Web Experience",
        summary: "Placeholder for a polished website or application project with modern UX and responsive delivery.",
        fullDescription: "Add the full project story, process, goals, stack, and delivery notes here.",
        image: createPlaceholderDataUrl("02", "#2563eb", "#111827"),
        tags: ["Frontend", "Branding", "UI"],
        documents: [],
        link: "#"
      },
      {
        title: "Project 3",
        category: "Computer Vision",
        summary: "Placeholder for a computer vision, image processing, or machine learning experiment.",
        fullDescription: "Add the full project story, process, goals, stack, and delivery notes here.",
        image: createPlaceholderDataUrl("03", "#7c3aed", "#111827"),
        tags: ["Vision", "ML", "Experiment"],
        documents: [],
        link: "#"
      },
      {
        title: "Project 4",
        category: "Content System",
        summary: "Placeholder for a content-managed website, dashboard, or admin experience.",
        fullDescription: "Add the full project story, process, goals, stack, and delivery notes here.",
        image: createPlaceholderDataUrl("04", "#ea580c", "#111827"),
        tags: ["CMS", "Dashboard", "UX"],
        documents: [],
        link: "#"
      },
      {
        title: "Project 5",
        category: "Creative Media",
        summary: "Placeholder for a media, portfolio, or visual storytelling project that combines tech and editing.",
        fullDescription: "Add the full project story, process, goals, stack, and delivery notes here.",
        image: createPlaceholderDataUrl("05", "#db2777", "#111827"),
        tags: ["Media", "Video", "Creative"],
        documents: [],
        link: "#"
      }
    ],
    gallery: [
      {
        title: "Frame 01",
        type: "Photography",
        description: "Use this frame to present a focused set of photography images.",
        image: createPlaceholderDataUrl("Frame 01", "#334155", "#020617"),
        images: [createPlaceholderDataUrl("Frame 01", "#334155", "#020617")]
      },
      {
        title: "Frame 02",
        type: "Videography",
        description: "Use this frame to present a focused set of videography images or thumbnails.",
        image: createPlaceholderDataUrl("Frame 02", "#1d4ed8", "#020617"),
        images: [createPlaceholderDataUrl("Frame 02", "#1d4ed8", "#020617")]
      },
      {
        title: "Frame 03",
        type: "Creative Direction",
        description: "Use this frame to present other curated visual work and creative direction.",
        image: createPlaceholderDataUrl("Frame 03", "#0f766e", "#020617"),
        images: [createPlaceholderDataUrl("Frame 03", "#0f766e", "#020617")]
      }
    ],
    contactHeading: "Let’s build something intelligent, visual, and memorable.",
    contactText:
      "Reach out through email, Instagram, or LinkedIn for collaborations, project work, and creative tech conversations.",
    contacts: defaultContacts
  };

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function shouldUseDefaultContacts(sourceContacts) {
    if (!Array.isArray(sourceContacts) || !sourceContacts.length) return true;
    const values = sourceContacts.map((item) => `${item.label}|${item.value}|${item.href}`);
    return values.some((value) =>
      [
        "Email|hello@example.com|mailto:hello@example.com",
        "Instagram|@yourhandle|#",
        "LinkedIn|Your profile|#"
      ].includes(value)
    );
  }

  function normalizeGalleryItems(sourceGallery) {
    const list = Array.isArray(sourceGallery) ? sourceGallery : clone(defaultData.gallery);
    return list.map((item, index) => {
      const fallback = defaultData.gallery[index] || {
        title: `Frame ${String(index + 1).padStart(2, "0")}`,
        type: "Media",
        description: "Add a short explanation for this frame gallery.",
        image: createPlaceholderDataUrl(`Frame ${index + 1}`, "#1e293b", "#020617"),
        images: [createPlaceholderDataUrl(`Frame ${index + 1}`, "#1e293b", "#020617")]
      };
      const imageList = Array.isArray(item.images) && item.images.length
        ? item.images.filter(Boolean)
        : [item.image || fallback.image];

      return {
        ...fallback,
        ...item,
        images: imageList,
        image: item.image || imageList[0] || fallback.image
      };
    });
  }

  function normalizeProjects(sourceProjects) {
    const list = Array.isArray(sourceProjects) ? sourceProjects : clone(defaultData.projects);
    return list.map((item, index) => {
      const fallback = defaultData.projects[index] || {
        title: `Project ${index + 1}`,
        category: "Project",
        summary: "Add a short summary.",
        fullDescription: "Add the full project description here.",
        image: createPlaceholderDataUrl(String(index + 1).padStart(2, "0"), "#0f766e", "#020617"),
        tags: [],
        documents: [],
        link: "#"
      };
      return {
        ...fallback,
        ...item,
        fullDescription: item.fullDescription || item.summary || fallback.fullDescription,
        documents: Array.isArray(item.documents) ? item.documents : []
      };
    });
  }

  function normalize(data) {
    const source = data || {};
    return {
      ...clone(defaultData),
      ...source,
      resumeUrl: typeof source.resumeUrl === "string" ? source.resumeUrl : defaultData.resumeUrl,
      heroPills: Array.isArray(source.heroPills) ? source.heroPills : clone(defaultData.heroPills),
      stats: Array.isArray(source.stats) ? source.stats : clone(defaultData.stats),
      services: Array.isArray(source.services) ? source.services : clone(defaultData.services),
      projects: normalizeProjects(source.projects),
      gallery: normalizeGalleryItems(source.gallery),
      contacts: shouldUseDefaultContacts(source.contacts) ? clone(defaultContacts) : source.contacts
    };
  }

  function openDb() {
    return new Promise((resolve, reject) => {
      if (!("indexedDB" in window)) {
        reject(new Error("IndexedDB is not available in this browser."));
        return;
      }
      const request = window.indexedDB.open(DB_NAME, 1);
      request.onupgradeneeded = () => {
        request.result.createObjectStore(STORE_NAME);
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async function readFromIndexedDb() {
    const db = await openDb();
    try {
      const stored = await new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readonly");
        const store = tx.objectStore(STORE_NAME);
        const request = store.get(RECORD_KEY);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
      return stored;
    } finally {
      db.close();
    }
  }

  async function writeToIndexedDb(data) {
    const db = await openDb();
    try {
      await new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readwrite");
        tx.objectStore(STORE_NAME).put(data, RECORD_KEY);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      });
    } finally {
      db.close();
    }
  }

  async function clearIndexedDb() {
    const db = await openDb();
    try {
      await new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readwrite");
        tx.objectStore(STORE_NAME).delete(RECORD_KEY);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      });
    } finally {
      db.close();
    }
  }

  async function getData() {
    try {
      const stored = await readFromIndexedDb();
      if (stored) {
        return normalize(stored);
      }
    } catch (error) {
      console.warn("IndexedDB read failed, falling back to localStorage.", error);
    }

    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return clone(defaultData);
    }
    try {
      return normalize(JSON.parse(raw));
    } catch (error) {
      console.warn("Falling back to default content because saved data could not be parsed.", error);
      return clone(defaultData);
    }
  }

  async function saveData(data) {
    const normalized = normalize(data);
    try {
      await writeToIndexedDb(normalized);
    } catch (error) {
      console.warn("IndexedDB save failed, falling back to localStorage only.", error);
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
  }

  async function resetData() {
    try {
      await clearIndexedDb();
    } catch (error) {
      console.warn("IndexedDB reset failed, clearing localStorage only.", error);
    }
    window.localStorage.removeItem(STORAGE_KEY);
    return clone(defaultData);
  }

  window.PortfolioCMS = {
    STORAGE_KEY,
    defaultData: clone(defaultData),
    getData,
    saveData,
    resetData,
    createPlaceholderDataUrl
  };
})();
