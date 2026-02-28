// ===== YAKAFINITY AI - MAIN JAVASCRIPT =====

// ===== DEEPSEEK API CONFIG =====
const DEEPSEEK_CONFIG = {
  apiKey: 'YOUR_DEEPSEEK_API_KEY_HERE', // Replace with your actual DeepSeek API key
  apiUrl: 'https://api.deepseek.com/v1/chat/completions',
  model: 'deepseek-chat',
  systemPrompt: `You are YAKA, the AI assistant for YAKAFINITY AI — a premium AI services agency. 
  You help potential clients understand our services including AI Mobile Development, AI Art, AI Video, AI Audio, AI Content, AI for Businesses, and Data services.
  Be concise, helpful, professional yet friendly. Keep responses under 80 words unless asked for detail.
  Always guide users toward booking a consultation or exploring our services.`
};

// ===== THEME MANAGEMENT =====
const ThemeManager = {
  init() {
    const saved = localStorage.getItem('yakafinity-theme') || 'dark';
    this.apply(saved);
  },
  apply(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('yakafinity-theme', theme);
  },
  toggle() {
    const current = document.documentElement.getAttribute('data-theme');
    this.apply(current === 'dark' ? 'light' : 'dark');
  }
};

// ===== NAVBAR =====
const NavManager = {
  init() {
    const nav = document.querySelector('.navbar');
    if (!nav) return;
    
    const handleScroll = () => {
      nav.classList.toggle('scrolled', window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    
    // Active link
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(link => {
      if (link.getAttribute('href') === currentPage) {
        link.classList.add('active');
      }
    });
  }
};

// ===== MOBILE NAV =====
const MobileNav = {
  open: false,
  init() {
    const hamburger = document.querySelector('.hamburger');
    const mobileNav = document.querySelector('.mobile-nav');
    if (!hamburger || !mobileNav) return;
    
    hamburger.addEventListener('click', () => {
      this.open = !this.open;
      mobileNav.classList.toggle('open', this.open);
      document.body.style.overflow = this.open ? 'hidden' : '';
    });
    
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        this.open = false;
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }
};

// ===== SCROLL REVEAL =====
const RevealManager = {
  init() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  }
};

// ===== AI CHAT =====
const ChatManager = {
  messages: [],
  isTyping: false,
  
  init() {
    const input = document.getElementById('chatInput');
    const sendBtn = document.getElementById('chatSend');
    if (!input || !sendBtn) return;
    
    // Auto-resize textarea
    input.addEventListener('input', () => {
      input.style.height = 'auto';
      input.style.height = Math.min(input.scrollHeight, 120) + 'px';
    });
    
    sendBtn.addEventListener('click', () => this.send());
    
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.send();
      }
    });
    
    // Initial greeting (already in HTML)
    this.addToHistory('assistant', "Hi! I'm YAKA, your AI guide. I'm here to help you discover how YAKAFINITY AI can transform your business. Tell me, what do you want? 🚀");
  },
  
  addToHistory(role, content) {
    this.messages.push({ role, content });
  },
  
  async send() {
    const input = document.getElementById('chatInput');
    const text = input.value.trim();
    if (!text || this.isTyping) return;
    
    input.value = '';
    input.style.height = 'auto';
    
    // Add user message
    this.addUserMessage(text);
    this.addToHistory('user', text);
    
    // Show typing
    this.showTyping();
    
    try {
      const response = await this.callDeepSeek(text);
      this.hideTyping();
      this.addAIMessage(response);
      this.addToHistory('assistant', response);
    } catch (err) {
      this.hideTyping();
      // Fallback responses if API fails
      const fallback = this.getFallback(text);
      this.addAIMessage(fallback);
    }
  },
  
  async callDeepSeek(userMessage) {
    const messagesPayload = [
      { role: 'system', content: DEEPSEEK_CONFIG.systemPrompt },
      ...this.messages.slice(-8) // Keep last 8 messages for context
    ];
    
    const response = await fetch(DEEPSEEK_CONFIG.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_CONFIG.apiKey}`
      },
      body: JSON.stringify({
        model: DEEPSEEK_CONFIG.model,
        messages: messagesPayload,
        max_tokens: 200,
        temperature: 0.7
      })
    });
    
    if (!response.ok) throw new Error(`API Error: ${response.status}`);
    const data = await response.json();
    return data.choices[0].message.content;
  },
  
  getFallback(input) {
    const lower = input.toLowerCase();
    if (lower.includes('app') || lower.includes('mobile')) {
      return "We build cutting-edge AI mobile apps with intelligent features like real-time processing, personalized experiences, and seamless integrations. Want to explore our AI Mobile Development services? 📱";
    } else if (lower.includes('art') || lower.includes('image') || lower.includes('design')) {
      return "Our AI Artists create stunning visuals using Midjourney, Stable Diffusion & ComfyUI. From brand assets to custom workflows — we make AI art work for your business. 🎨";
    } else if (lower.includes('video')) {
      return "We produce AI music videos, video avatars, and UGC content that converts. Our AI video team delivers Hollywood-quality at a fraction of the cost. 🎬";
    } else if (lower.includes('business') || lower.includes('consult')) {
      return "We help businesses adopt AI strategically — from roadmapping to implementation. Ready to book an AI consultation with our team? 💼";
    } else if (lower.includes('price') || lower.includes('cost') || lower.includes('how much')) {
      return "Our pricing is tailored to your project scope. Check out our Pricing page for general packages, or book a free discovery call to get a custom quote! 💰";
    } else {
      return "Great question! YAKAFINITY AI offers a full spectrum of AI services — from apps and automation to art, video, audio, and data. What specific area interests you most? 🤖";
    }
  },
  
  addUserMessage(text) {
    const container = document.getElementById('chatMessages');
    const msg = document.createElement('div');
    msg.className = 'chat-msg user';
    msg.innerHTML = `
      <div class="chat-bubble">${this.escapeHtml(text)}</div>
      <div class="chat-avatar chat-avatar-user">👤</div>
    `;
    container.appendChild(msg);
    this.scrollBottom();
  },
  
  addAIMessage(text) {
    const container = document.getElementById('chatMessages');
    const msg = document.createElement('div');
    msg.className = 'chat-msg ai';
    msg.innerHTML = `
      <div class="chat-avatar"><img src="logo.png" alt="YAKA"></div>
      <div class="chat-bubble">${this.escapeHtml(text)}</div>
    `;
    container.appendChild(msg);
    this.scrollBottom();
  },
  
  showTyping() {
    this.isTyping = true;
    const container = document.getElementById('chatMessages');
    const typing = document.createElement('div');
    typing.className = 'chat-msg ai';
    typing.id = 'typingIndicator';
    typing.innerHTML = `
      <div class="chat-avatar"><img src="logo.png" alt="YAKA"></div>
      <div class="typing-indicator">
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
      </div>
    `;
    container.appendChild(typing);
    this.scrollBottom();
  },
  
  hideTyping() {
    this.isTyping = false;
    document.getElementById('typingIndicator')?.remove();
  },
  
  scrollBottom() {
    const container = document.getElementById('chatMessages');
    if (container) container.scrollTop = container.scrollHeight;
  },
  
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
};

// ===== COUNTER ANIMATION =====
const CounterManager = {
  init() {
    const counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animate(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => observer.observe(counter));
  },
  
  animate(el) {
    const target = parseFloat(el.getAttribute('data-count'));
    const suffix = el.getAttribute('data-suffix') || '';
    const prefix = el.getAttribute('data-prefix') || '';
    const duration = 2000;
    const start = performance.now();
    
    const update = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = target * eased;
      
      el.textContent = prefix + (Number.isInteger(target) ? Math.round(value) : value.toFixed(1)) + suffix;
      
      if (progress < 1) requestAnimationFrame(update);
    };
    
    requestAnimationFrame(update);
  }
};

// ===== SMOOTH PARALLAX =====
const ParallaxManager = {
  init() {
    const orbs = document.querySelectorAll('.orb');
    if (!orbs.length) return;
    
    let ticking = false;
    window.addEventListener('mousemove', (e) => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const x = (e.clientX / window.innerWidth - 0.5) * 20;
          const y = (e.clientY / window.innerHeight - 0.5) * 20;
          
          orbs.forEach((orb, i) => {
            const factor = (i + 1) * 0.3;
            orb.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
          });
          ticking = false;
        });
        ticking = true;
      }
    });
  }
};

// ===== FORM HANDLING =====
const FormManager = {
  init() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      btn.textContent = 'Sending...';
      btn.disabled = true;
      
      setTimeout(() => {
        btn.textContent = '✓ Message Sent!';
        btn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
        
        setTimeout(() => {
          btn.textContent = 'Send Message';
          btn.disabled = false;
          btn.style.background = '';
          form.reset();
        }, 3000);
      }, 1500);
    });
  }
};

// ===== INIT ALL =====
document.addEventListener('DOMContentLoaded', () => {
  ThemeManager.init();
  NavManager.init();
  MobileNav.init();
  RevealManager.init();
  ChatManager.init();
  CounterManager.init();
  ParallaxManager.init();
  FormManager.init();
  
  // Theme toggle button
  document.querySelectorAll('.theme-toggle').forEach(btn => {
    btn.addEventListener('click', () => ThemeManager.toggle());
  });
});
