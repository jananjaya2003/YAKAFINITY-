const STORAGE_KEY = "yakafinity_site_data_v1";
const ORDERS_KEY = "yakafinity_orders_v1";
const ADMIN_AUTH_KEY = "yakafinity_admin_auth_v1";
const ADMIN_CREDENTIALS_KEY = "yakafinity_admin_credentials_v1";

const DEFAULT_DATA = {
  company: {
    name: "YAKAFINITY",
    domain: "www.yakafinity.com",
    tagline: "Premium AI, Development, Marketing, and IT services for modern businesses.",
    logo: "../admin-images/site-admin/brand/logo.png"
  },
  content: {
    home: {
      eyebrow: "Premium Tech Service Provider",
      title: "Build Faster With YAKAFINITY",
      intro: "We design growth-focused digital systems, automate workflows with AI, and deliver reliable managed tech services.",
      primaryCtaLabel: "Start Your Order",
      primaryCtaHref: "contact.html",
      secondaryCtaLabel: "Explore Services",
      secondaryCtaHref: "services.html",
      trustItems: ["Fast Turnaround", "Secure Delivery", "Premium Quality"],
      expertiseTitle: "Core Expertise",
      expertiseItems: ["AI Solutions", "Pro Accounts", "Development", "Marketing & Design", "Creative", "Hosting & IT"],
      featuredEyebrow: "What We Offer",
      featuredTitle: "Featured Services (Top 5)",
      processEyebrow: "How We Work",
      processTitle: "Simple Process, Premium Delivery",
      processSteps: [
        { title: "1. Discovery", text: "We define your goals, timeline, and preferred delivery format." },
        { title: "2. Build", text: "Our team executes with transparent updates and checkpoints." },
        { title: "3. Delivery", text: "Final assets are quality-checked, documented, and handed over smoothly." }
      ],
      finalEyebrow: "Ready to Start",
      finalTitle: "Move to the Contact Page to Place an Order",
      finalText: "Use our dedicated contact/order page for clean submission and project details.",
      finalButtonLabel: "Go to Contact & Orders",
      finalButtonHref: "contact.html"
    },
    about: {
      eyebrow: "Who We Are",
      title: "Premium Technology Partner for Growth",
      intro: "We build practical, scalable digital solutions that move your business faster.",
      cards: [
        { title: "Mission", text: "Deliver reliable high-quality tech services that combine speed, quality, and long-term support." },
        { title: "Vision", text: "Become the trusted all-in-one service partner for startups, creators, and growing companies." },
        { title: "Value", text: "We focus on clarity, secure delivery, and measurable business outcomes in every engagement." }
      ],
      processEyebrow: "How We Deliver",
      processTitle: "Clear End-to-End Workflow",
      processSteps: [
        { title: "Consult", text: "We identify goals, success metrics, and project constraints." },
        { title: "Execute", text: "We implement with transparent milestones and regular updates." },
        { title: "Support", text: "We provide handover guidance, iteration, and continuous assistance." }
      ],
      ownerEyebrow: "Meet The Owner",
      ownerTitle: "Explore the personal portfolio behind YAKAFINITY",
      ownerText: "Visit the owner's portfolio to see background, projects, creative work, and personal highlights.",
      ownerCardText: "Open the connected portfolio site for a closer look at the founder's work and profile.",
      ownerButtonLabel: "Owner Portfolio",
      ownerButtonHref: "../My Portfolio/index.html"
    },
    servicesPage: {
      eyebrow: "All Services",
      title: "Solutions for Every Growth Stage",
      intro: "Every service is managed with premium quality, clear timelines, and delivery support."
    },
    contactPage: {
      eyebrow: "Contact",
      title: "Send Your Project Request",
      intro: "Complete this form and we will manage your order from planning to delivery."
    },
    footer: {
      tagline: "Premium Tech Services",
      contactLine: "Contact Info :- 072 100 5844",
      servicesLinkLabel: "Start Your Project",
      servicesLinkHref: "contact.html",
      domainPrefix: "Domain:"
    }
  },
  services: [
    {
      id: "ai-solutions",
      title: "AI Solutions",
      icon: "ðŸ¤–",
      category: "Automation",
      image: "../admin-images/site-admin/services/service 1.png",
      description: "Custom AI assistants, workflow automation, and intelligent business tools.",
      features: ["AI Strategy", "Prompt Systems", "Automation Setup", "Model Integration"],
      offerings: [
        { name: "Chatbot Setup", priceLkr: 1500 },
        { name: "Prompt Pack", priceLkr: 1200 },
        { name: "AI Workflow Automation", priceLkr: 2500 }
      ]
    },
    {
      id: "pro-accounts",
      title: "Pro Accounts",
      icon: "ðŸ’Ž",
      category: "Subscriptions",
      image: "../admin-images/site-admin/services/service 2.png",
      description: "Securely managed premium account setup and renewal support for teams.",
      features: ["Account Provisioning", "Renewal Tracking", "Usage Setup", "Support"],
      offerings: [
        { name: "Canva Pro", priceLkr: 300 },
        { name: "CapCut Pro", priceLkr: 500 },
        { name: "Gemini AI", priceLkr: 600 }
      ]
    },
    {
      id: "development",
      title: "Development",
      icon: "ðŸ’»ðŸ“±",
      category: "Engineering",
      image: "../admin-images/site-admin/services/service 3.png",
      description: "Website, web app, and mobile app development with modern architecture.",
      features: ["Web Development", "Mobile Apps", "API Integration", "Maintenance"],
      offerings: [
        { name: "Landing Page", priceLkr: 3000 },
        { name: "Business Website", priceLkr: 12000 },
        { name: "Mobile App MVP", priceLkr: 25000 }
      ]
    },
    {
      id: "marketing-design",
      title: "Marketing & Design",
      icon: "ðŸŽ¨ðŸ“ˆ",
      category: "Creative Growth",
      image: "../admin-images/site-admin/services/service 4.png",
      description: "Brand identity, ad creatives, social growth strategy, and campaign execution.",
      features: ["Branding", "Social Content", "Performance Ads", "Landing Design"],
      offerings: [
        { name: "Logo + Brand Kit", priceLkr: 2500 },
        { name: "Social Media Pack", priceLkr: 3500 },
        { name: "Ad Creative Bundle", priceLkr: 4500 }
      ]
    },
    {
      id: "hosting-it",
      title: "Hosting & IT",
      icon: "ðŸŒðŸ”",
      category: "Infrastructure",
      image: "../admin-images/site-admin/services/service 5.png",
      description: "Reliable hosting, domain operations, cybersecurity support, and IT monitoring.",
      features: ["Cloud Hosting", "Domain Management", "Security Hardening", "IT Support"],
      offerings: [
        { name: "Starter Hosting Setup", priceLkr: 2000 },
        { name: "Managed VPS Setup", priceLkr: 6000 },
        { name: "Security Hardening", priceLkr: 5000 }
      ]    },
    {
      id: "video-production",
      title: "Video Production",
      icon: "🎬",
      category: "Content",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&auto=format&fit=crop&q=80",
      description: "Professional video creation, editing, and multimedia content production.",
      features: ["Video Editing", "Motion Graphics", "Animated Explainers", "Promotional Videos"],
      offerings: [
        { name: "Video Editing Basics", priceLkr: 2000 },
        { name: "Animated Explainer", priceLkr: 5000 },
        { name: "Full Production Package", priceLkr: 8000 }
      ]    }
  ]
};

const DEFAULT_ADMIN_CREDENTIALS = {
  username: "tharindujb2003",
  password: "tjbro2003@#"
};

function normalizeSiteManagedUrl(value) {
  const url = String(value || "");
  if (!url) return url;
  if (
    url === "logo.png" ||
    url === "./logo.png" ||
    url === "Yakafinity Website/logo.png" ||
    url === "../Yakafinity Website/logo.png" ||
    url === "/Yakafinity Website/logo.png"
  ) {
    return "../admin-images/site-admin/brand/logo.png";
  }
  if (url.startsWith("../admin-images/site-admin/")) return url;
  if (url.startsWith("/admin-images/site-admin/")) return `..${url}`;
  if (url.startsWith("admin-images/site-admin/")) return `../${url}`;
  return url;
}

function normalizeSiteHref(value) {
  const href = String(value || "");
  if (!href) return href;
  if (href === "My Portfolio/index.html" || href === "./My Portfolio/index.html") {
    return "../My Portfolio/index.html";
  }
  return href;
}

function cloneDefaultData() {
  return structuredClone(DEFAULT_DATA);
}

function normalizeSiteData(data) {
  const source = data || {};
  const normalized = cloneDefaultData();

  normalized.company = {
    ...normalized.company,
    ...(source.company || {})
  };
  normalized.company.logo = normalizeSiteManagedUrl(normalized.company.logo);

  normalized.content.home = {
    ...normalized.content.home,
    ...((source.content && source.content.home) || {})
  };
  normalized.content.about = {
    ...normalized.content.about,
    ...((source.content && source.content.about) || {})
  };
  normalized.content.about.ownerButtonHref = normalizeSiteHref(normalized.content.about.ownerButtonHref);
  normalized.content.servicesPage = {
    ...normalized.content.servicesPage,
    ...((source.content && source.content.servicesPage) || {})
  };
  normalized.content.contactPage = {
    ...normalized.content.contactPage,
    ...((source.content && source.content.contactPage) || {})
  };
  normalized.content.footer = {
    ...normalized.content.footer,
    ...((source.content && source.content.footer) || {})
  };

  if (Array.isArray(source.content && source.content.home && source.content.home.trustItems)) {
    normalized.content.home.trustItems = source.content.home.trustItems.filter(Boolean);
  }
  if (Array.isArray(source.content && source.content.home && source.content.home.expertiseItems)) {
    normalized.content.home.expertiseItems = source.content.home.expertiseItems.filter(Boolean);
  }
  if (Array.isArray(source.content && source.content.home && source.content.home.processSteps)) {
    normalized.content.home.processSteps = source.content.home.processSteps;
  }
  if (Array.isArray(source.content && source.content.about && source.content.about.cards)) {
    normalized.content.about.cards = source.content.about.cards;
  }
  if (Array.isArray(source.content && source.content.about && source.content.about.processSteps)) {
    normalized.content.about.processSteps = source.content.about.processSteps;
  }
  if (Array.isArray(source.services)) {
    normalized.services = source.services;
  }

  normalized.services = (normalized.services || []).map((service) => ({
    ...service,
    image: normalizeSiteManagedUrl(service.image),
    offerings: Array.isArray(service.offerings)
      ? service.offerings.map((offering) => ({
          ...offering,
          image: normalizeSiteManagedUrl(offering.image)
        }))
      : service.offerings
  }));

  return normalized;
}

function getSiteData() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return cloneDefaultData();
  try {
    return normalizeSiteData(JSON.parse(raw));
  } catch {
    return cloneDefaultData();
  }
}

function saveSiteData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizeSiteData(data)));
}

function getOrders() {
  const raw = localStorage.getItem(ORDERS_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveOrders(orders) {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

function getAdminCredentials() {
  const raw = localStorage.getItem(ADMIN_CREDENTIALS_KEY);
  if (!raw) return structuredClone(DEFAULT_ADMIN_CREDENTIALS);
  try {
    const parsed = JSON.parse(raw);
    if (!parsed.username || !parsed.password) {
      return structuredClone(DEFAULT_ADMIN_CREDENTIALS);
    }
    if (parsed.username === "admin" && parsed.password === "Yakafinity@2026") {
      return structuredClone(DEFAULT_ADMIN_CREDENTIALS);
    }
    return parsed;
  } catch {
    return structuredClone(DEFAULT_ADMIN_CREDENTIALS);
  }
}

function setAdminCredentials(username, password) {
  localStorage.setItem(
    ADMIN_CREDENTIALS_KEY,
    JSON.stringify({
      username,
      password
    })
  );
}

function loginAdmin(username, password) {
  const creds = getAdminCredentials();
  if (username === creds.username && password === creds.password) {
    localStorage.setItem(ADMIN_AUTH_KEY, "true");
    return true;
  }
  return false;
}

function isAdminAuthenticated() {
  return localStorage.getItem(ADMIN_AUTH_KEY) === "true";
}

function logoutAdmin() {
  localStorage.removeItem(ADMIN_AUTH_KEY);
}
