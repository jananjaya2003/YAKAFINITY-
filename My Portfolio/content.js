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
        id: "autovalue-sl",
        title: "AutoValue SL",
        category: "Machine Learning / Vehicle Valuation",
        summary: "A Sri Lankan vehicle price estimation platform powered by an ensemble machine learning model trained on real local listing data.",
        fullDescription:
          "I built AutoValue SL to make vehicle valuation faster and more data-driven for Sri Lankan buyers, sellers, and dealers. The project focuses on turning market listing patterns into a clean prediction experience where users can estimate a vehicle's likely value in seconds. The interface presents the result with a confidence range, core vehicle attributes, and model statistics so the output feels explainable instead of just numerical.",
        postIntro: "Excited to share AutoValue SL, a machine learning powered vehicle valuation project built for the Sri Lankan automotive market.",
        highlights: [
          "Designed a polished prediction workflow for entering vehicle details and receiving a market-value estimate.",
          "Used a trained ensemble model concept based on real Sri Lankan vehicle listings.",
          "Created a dashboard-style UI with model stats, price range visualization, and clear call-to-action flows."
        ],
        stack: ["Machine Learning", "Prediction UI", "Vehicle Data", "Frontend", "Sri Lanka Market"],
        outcome: "This project strengthened my ability to connect machine learning outputs with a user experience that feels practical, professional, and trustworthy.",
        image: "assets/projects/AutoValue SL.png",
        tags: ["Machine Learning", "Vehicle Pricing", "Sri Lanka"],
        documents: [],
        link: "#",
        linkedinPostUrl: "https://www.linkedin.com/posts/jananjaya2003_machinelearning-artificialintelligence-datascience-activity-7471475691746750464-Xj_Y?utm_source=social_share_send&utm_medium=member_desktop_web&rcm=ACoAAEvjBWYBWkV96QoaitODLhN2c5MSUrpsKCc"
      },
      {
        id: "car-price-prediction",
        title: "Car price prediction",
        category: "AI Forecasting / EV Market",
        summary: "An EV price forecasting tool for Sri Lanka that predicts monthly price movement using a linear regression machine learning approach.",
        fullDescription:
          "Car price prediction explores how AI-assisted historical market data can be used to forecast electric vehicle prices in Sri Lanka. The app lets users select EV details, mileage, and condition, then generates a six-month monthly forecast. I focused on making the predictive workflow simple, readable, and useful for users who want to understand possible price movement before making a vehicle decision.",
        postIntro: "I developed an EV price prediction tool focused on Sri Lanka's growing electric vehicle market.",
        highlights: [
          "Built a guided EV selection form with brand, model, year, mileage, and condition inputs.",
          "Applied a linear regression forecasting concept to generate six-month monthly price estimates.",
          "Presented results in LKR with a clean AI product interface for easier decision-making."
        ],
        stack: ["Linear Regression", "EV Forecasting", "AI Data", "Frontend", "Market Analysis"],
        outcome: "The project helped me practice turning an ML forecasting idea into a user-friendly product flow with clear local-market positioning.",
        image: "assets/projects/Car price prediction.png",
        tags: ["AI", "EV Prices", "Forecasting"],
        documents: [],
        link: "#",
        linkedinPostUrl: "https://www.linkedin.com/posts/jananjaya2003_electricvehicles-machinelearning-byd-activity-7471786823778861056-J8a9?utm_source=social_share_send&utm_medium=member_desktop_web&rcm=ACoAAEvjBWYBWkV96QoaitODLhN2c5MSUrpsKCc"
      },
      {
        id: "cybsecai",
        title: "cybsecAi",
        category: "Cybersecurity / AI Detection",
        summary: "An AI-assisted phishing URL detection interface that analyzes suspicious links and presents risk probability in a security-focused dashboard.",
        fullDescription:
          "cybsecAi is a cybersecurity project focused on phishing URL detection. The product experience is built around a direct scan workflow: the user enters a suspicious URL, runs analysis, and receives a clear risk result with probability feedback. The goal was to make threat detection feel understandable and immediate while keeping the interface serious and security-oriented.",
        postIntro: "I built cybsecAi as an AI-powered phishing URL detection project for safer browsing and faster threat awareness.",
        highlights: [
          "Created a URL scanning flow for checking suspicious links.",
          "Displayed phishing risk status, probability, and result feedback in a focused security interface.",
          "Designed the UI around clarity, urgency, and trust for cybersecurity use cases."
        ],
        stack: ["Cybersecurity", "AI Detection", "Phishing URLs", "Risk Scoring", "Web App"],
        outcome: "This project gave me stronger experience designing AI tools for security contexts where the result must be fast, clear, and easy to interpret.",
        image: "assets/projects/cybsecAi.png",
        tags: ["Cybersecurity", "AI", "Phishing Detection"],
        documents: [],
        link: "#",
        linkedinPostUrl: "https://www.linkedin.com/posts/jananjaya2003_machinelearning-cybersecurity-python-activity-7471783572601737217-7roc?utm_source=social_share_send&utm_medium=member_desktop_web&rcm=ACoAAEvjBWYBWkV96QoaitODLhN2c5MSUrpsKCc"
      },
      {
        id: "pos",
        title: "pos",
        category: "Retail System / Point of Sale",
        summary: "A point of sale system for JBSUPER with catalog search, billing, receipt generation, loyalty points, print, and PDF export.",
        fullDescription:
          "pos is a retail point of sale system designed for a small business billing environment. The interface includes a product catalog, item-code entry, cart totals, seller/cashier input, and a live receipt preview. I designed it to support practical cashier workflows with clear pricing, quantity controls, loyalty points, and receipt output actions for print and PDF.",
        postIntro: "I created a point of sale system for JBSUPER to support fast billing and receipt handling in a retail workflow.",
        highlights: [
          "Built catalog browsing and item-code billing for quick cashier use.",
          "Added receipt preview, subtotal, total, loyalty points, print, and PDF controls.",
          "Designed the interface for repeated daily use with compact panels and visible transaction state."
        ],
        stack: ["POS System", "Billing", "Receipt UI", "PDF Export", "Retail Workflow"],
        outcome: "This project improved my understanding of operational software where speed, readability, and reliable transaction flow matter more than decoration.",
        image: "assets/projects/pos.png",
        tags: ["POS", "Billing", "Retail"],
        documents: [],
        link: "#",
        linkedinPostUrl: "https://www.linkedin.com/posts/jananjaya2003_pos-webdevelopment-python-activity-7443548273849856001-6teU?utm_source=social_share_send&utm_medium=member_desktop_web&rcm=ACoAAEvjBWYBWkV96QoaitODLhN2c5MSUrpsKCc"
      },
      {
        id: "vehicle-tax-calculator",
        title: "Vehicle Tax Calculator",
        category: "Tax Calculator / Vehicle Import",
        summary: "A UK vehicle import calculator for estimating import duty, VAT, and excise duty from vehicle details and emissions inputs.",
        fullDescription:
          "Vehicle Tax Calculator is a utility project for estimating vehicle import costs. The app includes a VIN lookup area and separate calculator sections for import duty and tax calculations. The main goal was to make a complex vehicle-cost process feel structured, with clear fields for vehicle value, vehicle type, CO2 emissions, fuel type, and calculated tax outputs.",
        postIntro: "I built a Vehicle Tax Calculator to simplify vehicle import cost estimation through a clean web-based tool.",
        highlights: [
          "Created separate workflows for vehicle lookup, import duty, VAT, and excise duty calculations.",
          "Structured inputs around vehicle value, type, emissions, and fuel category.",
          "Designed the tool as a practical calculator interface for quick estimates."
        ],
        stack: ["Calculator App", "Vehicle Import", "VAT", "Excise Duty", "Web UI"],
        outcome: "The project helped me think through form-heavy product design and how to present finance-related calculations in a clear, low-friction layout.",
        image: "assets/projects/Vehicle Tax Calculator.png",
        tags: ["Tax Calculator", "Vehicle Import", "Utility"],
        documents: [],
        link: "#",
        linkedinPostUrl: "#"
      },
      {
        id: "yakafinity",
        title: "Yakafinity",
        category: "Business Website / Tech Services",
        summary: "A premium tech service provider website presenting AI solutions, development, marketing, hosting, and managed service offerings.",
        fullDescription:
          "Yakafinity is a business website concept for a premium technology service provider. It presents the brand, service categories, client pathways, and core expertise in a polished first-screen experience. I focused on making the website feel trustworthy, modern, and service-ready while keeping the message direct: build faster with AI, development, marketing, hosting, and managed tech support.",
        postIntro: "I designed and built Yakafinity as a premium digital presence for a technology service provider brand.",
        highlights: [
          "Created a polished landing experience with brand navigation, service positioning, and client login entry.",
          "Highlighted core expertise across AI solutions, development, marketing, hosting, and managed IT.",
          "Built a clean service-provider interface that can scale into a complete business website."
        ],
        stack: ["Business Website", "AI Services", "Frontend", "Brand UI", "Service Design"],
        outcome: "This project shows my ability to combine visual direction, business messaging, and web implementation into a professional service brand experience.",
        image: "assets/projects/Yakafinity.png",
        tags: ["Website", "Brand", "Tech Services"],
        documents: [],
        link: "#",
        linkedinPostUrl: "#"
      }
    ],
    gallery: [
      {
        title: "Image 1",
        type: "Photography",
        description: "Landscape photography with scenic views.",
        image: "assets/gallery/Image 1.jpg",
        images: ["assets/gallery/Image 1.jpg"]
      },
      {
        title: "Image 2",
        type: "Photography",
        description: "Grassland and nature photography.",
        image: "assets/gallery/Image 2.jpg",
        images: ["assets/gallery/Image 2.jpg"]
      },
      {
        title: "Image 3",
        type: "Photography",
        description: "Rock formation and landscape photography.",
        image: "assets/gallery/Image 3.jpg",
        images: ["assets/gallery/Image 3.jpg"]
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

  function shouldUseDefaultProjects(sourceProjects) {
    if (!Array.isArray(sourceProjects) || !sourceProjects.length) return true;
    const starterTitles = ["Project 1", "Project 2", "Project 3", "Project 4", "Project 5"];
    return sourceProjects.length === starterTitles.length && sourceProjects.every((item, index) => item && item.title === starterTitles[index]);
  }

  function normalizeProjects(sourceProjects) {
    const list = shouldUseDefaultProjects(sourceProjects) ? clone(defaultData.projects) : sourceProjects;
    return list.map((item, index) => {
      const fallback = defaultData.projects[index] || {
        title: `Project ${index + 1}`,
        category: "Project",
        summary: "Add a short summary.",
        fullDescription: "Add the full project description here.",
        image: createPlaceholderDataUrl(String(index + 1).padStart(2, "0"), "#0f766e", "#020617"),
        tags: [],
        documents: [],
        link: "#",
        linkedinPostUrl: "#",
        postIntro: "",
        highlights: [],
        stack: [],
        outcome: ""
      };
      return {
        ...fallback,
        ...item,
        fullDescription: item.fullDescription || item.summary || fallback.fullDescription,
        documents: Array.isArray(item.documents) ? item.documents : [],
        highlights: Array.isArray(item.highlights) ? item.highlights : [],
        stack: Array.isArray(item.stack) ? item.stack : Array.isArray(item.tags) ? item.tags : [],
        linkedinPostUrl: item.linkedinPostUrl || "#"
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
