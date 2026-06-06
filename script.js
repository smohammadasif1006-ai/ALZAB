/* ═══════════════════════════════════════════════════
   ALZAB ALGHARBIYAH – JAVASCRIPT
════════════════════════════════════════════════════ */

// ── Language State ──
let currentLang = localStorage.getItem('selectedLang') || 'en';

// ── On DOM Ready ──
document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initScrollEffects();
  initNavHighlight();
  initLogoStampAnimation();
  applyLang(); // Apply saved language on load
  updatePlaceholders();
  initContactForm();
  initFileInput();
  initWhatsApp();
  initAIBuddy();
});

/* ══════════════════════════════
   AI BUDDY / TECHNICAL ASSISTANT
══════════════════════════════ */
function initAIBuddy() {
  if (document.querySelector('.ai-buddy-float-pill')) return;

  const path = window.location.pathname;
  // Exclude individual brand pages, but keep it on products.html
  if (path.includes('/brands/')) return;


  // 1. Create the Float Trigger (Pill Shaped)
  const aiBtn = document.createElement('div');
  aiBtn.className = 'ai-buddy-float-pill';
  aiBtn.setAttribute('role', 'button');
  aiBtn.setAttribute('aria-label', 'Open Technical Assistant');
  
  aiBtn.innerHTML = `<span data-en="Technical Assistant" data-ar="المساعد الفني">${currentLang === 'ar' ? 'المساعد الفني' : 'Technical Assistant'}</span>`;

  // 2. Create the Chat Window
  const chatWindow = document.createElement('div');
  chatWindow.className = 'ai-chat-window';
  
  const welcomeMsgEn = 'Hi! How can I help you with your project today?';
  const welcomeMsgAr = 'مرحباً! كيف يمكنني مساعدتك في مشروعك اليوم؟';
  const welcomeMsg = currentLang === 'ar' ? welcomeMsgAr : welcomeMsgEn;

  const inputPlaceholderEn = 'Type your message...';
  const inputPlaceholderAr = 'اكتب رسالتك هنا...';
  const inputPlaceholder = currentLang === 'ar' ? inputPlaceholderAr : inputPlaceholderEn;

  const onlineTextEn = 'Online';
  const onlineTextAr = 'متصل';
  const onlineText = currentLang === 'ar' ? onlineTextAr : onlineTextEn;

  chatWindow.innerHTML = `
    <div class="ai-chat-header">
      <div class="ai-header-info">
        <div class="ai-avatar"></div>
        <div>
          <h4>Technical Assistant</h4>
          <span class="ai-status" data-en="${onlineTextEn}" data-ar="${onlineTextAr}"><span class="status-dot"></span><span class="lang-text">${onlineText}</span></span>
        </div>
      </div>
      <button class="ai-close-btn" aria-label="Close Chat">&times;</button>
    </div>
    <div class="ai-chat-body">
      <div class="ai-msg ai-msg-bot" data-en="${welcomeMsgEn}" data-ar="${welcomeMsgAr}">${welcomeMsg}</div>
    </div>
    <div class="ai-chat-footer">
      <textarea placeholder="${inputPlaceholder}" id="aiChatInput" data-en-placeholder="${inputPlaceholderEn}" data-ar-placeholder="${inputPlaceholderAr}"></textarea>
      <button id="aiSendBtn" aria-label="Send Message">
        <svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
      </button>
    </div>
  `;

  // 3. Interactions
  aiBtn.addEventListener('click', () => {
    chatWindow.classList.add('active');
    aiBtn.style.opacity = '0';
    aiBtn.style.pointerEvents = 'none';
  });

  const closeBtn = chatWindow.querySelector('.ai-close-btn');
  closeBtn.addEventListener('click', () => {
    chatWindow.classList.remove('active');
    aiBtn.style.opacity = '1';
    aiBtn.style.pointerEvents = 'auto';
  });

  const sendBtn = chatWindow.querySelector('#aiSendBtn');
  const input = chatWindow.querySelector('#aiChatInput');

  const sendMessage = () => {
    const text = input.value.trim();
    if (!text) return;

    const encodedMsg = encodeURIComponent(`[Technical Assistant Inquiry] ${text}`);
    const waUrl = `https://wa.me/966563585190?text=${encodedMsg}`;
    window.open(waUrl, '_blank');
    
    // Clear and close after sending
    input.value = '';
    chatWindow.classList.remove('active');
    aiBtn.style.opacity = '1';
    aiBtn.style.pointerEvents = 'auto';
  };

  sendBtn.addEventListener('click', sendMessage);
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  getOrCreateFloatingContainer().appendChild(aiBtn);
  document.body.appendChild(chatWindow);
}

/* ══════════════════════════════
   LANGUAGE SETTINGS
══════════════════════════════ */
function toggleLang() {
  currentLang = currentLang === 'en' ? 'ar' : 'en';
  localStorage.setItem('selectedLang', currentLang);
  applyLang();
}

function applyLang() {
  const html = document.documentElement;
  const label = document.getElementById('langLabel');

  if (currentLang === 'ar') {
    html.setAttribute('lang', 'ar');
    html.setAttribute('dir', 'rtl');
    document.body.setAttribute('dir', 'rtl');
    if (label) label.textContent = 'English';
  } else {
    html.setAttribute('lang', 'en');
    html.setAttribute('dir', 'ltr');
    document.body.setAttribute('dir', 'ltr');
    if (label) label.textContent = 'العربية';
  }

  // Update all text nodes
  const elements = document.querySelectorAll('[data-en][data-ar]');
  elements.forEach(el => {
    const text = el.getAttribute(`data-${currentLang}`);
    if (text) {
      const spanText = el.querySelector('.lang-text');
      if (spanText) {
        spanText.textContent = text;
      } else if (el.children.length === 0) {
        el.textContent = text;
      }
    }
  });

  // Update page title
  document.title = currentLang === 'ar'
    ? 'الزاب الغربية'
    : 'Alzab Algharbiyah';

  updatePlaceholders();
}

function updatePlaceholders() {
  const inputs = document.querySelectorAll('[data-en-placeholder]');
  inputs.forEach(el => {
    el.placeholder = el.getAttribute(`data-${currentLang}-placeholder`) || '';
  });
}

/* ══════════════════════════════
   NAVBAR SCROLL
══════════════════════════════ */
function initScrollEffects() {
  const navbar = document.getElementById('navbar');
  const backTop = document.getElementById('backTop');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    // Navbar
    if (scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Back to top
    if (scrollY > 400) {
      backTop.classList.add('visible');
    } else {
      backTop.classList.remove('visible');
    }
  }, { passive: true });
}

/* ══════════════════════════════
   ACTIVE NAV HIGHLIGHT
══════════════════════════════ */
function initNavHighlight() {
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-item');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navItems.forEach(item => {
          item.classList.remove('active');
          if (item.getAttribute('href') === '#' + entry.target.id) {
            item.classList.add('active');
          }
        });
      }
    });
  }, { threshold: 0.35 });

  sections.forEach(s => observer.observe(s));
}

/* ══════════════════════════════
   HAMBURGER MENU
══════════════════════════════ */
function toggleMenu() {
  const links = document.getElementById('navLinks');
  const hamburger = document.getElementById('hamburger');
  links.classList.toggle('open');
  hamburger.classList.toggle('active');
}

// Close menu on nav click
document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', () => {
    document.getElementById('navLinks').classList.remove('open');
    document.getElementById('hamburger').classList.remove('active');
  });
});

/* ══════════════════════════════
   PARTICLES
══════════════════════════════ */
function initParticles() {
  const container = document.getElementById('particles');
  if (!container) return;

  const count = 30;
  for (let i = 0; i < count; i++) {
    createParticle(container);
  }
}

function createParticle(container) {
  const p = document.createElement('div');
  p.className = 'particle';

  const size = Math.random() * 3 + 1.5;
  const left = Math.random() * 100;
  const delay = Math.random() * 12;
  const duration = Math.random() * 10 + 12;
  const opacity = (Math.random() * 0.4 + 0.2).toFixed(2);

  p.style.cssText = `
    left: ${left}%;
    bottom: -10px;
    width: ${size}px;
    height: ${size}px;
    animation-duration: ${duration}s;
    animation-delay: -${delay}s;
    opacity: ${opacity};
  `;

  container.appendChild(p);
}

/* ══════════════════════════════
   SCROLL BACK TO TOP
══════════════════════════════ */
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ══════════════════════════════
   CONTACT FORM
══════════════════════════════ */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', handleSubmit);
  }
}

function handleSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const btn = document.getElementById('submitBtn');
  const feedback = document.getElementById('formFeedback');
  
  btn.disabled = true;
  const originalText = btn.querySelector('span').textContent;
  btn.querySelector('span').textContent = currentLang === 'ar' ? 'جارٍ الإرسال...' : 'Sending...';

  const formData = new FormData(form);

  fetch(form.action, {
    method: 'POST',
    body: formData,
    headers: {
      'Accept': 'application/json'
    }
  })
  .then(response => {
    btn.disabled = false;
    btn.querySelector('span').textContent = originalText;
    
    if (response.ok) {
      feedback.style.display = 'block';
      feedback.style.color = '#25D366';
      feedback.innerHTML = currentLang === 'ar' 
        ? 'تم إرسال رسالتك بنجاح! شكراً لتواصلك معنا.' 
        : 'Your message has been sent successfully! Thank you for contacting us.';
      form.reset();
      const fileNameLabel = document.getElementById('fileNameLabel');
      if (fileNameLabel) {
        fileNameLabel.textContent = currentLang === 'ar' ? 'لم يتم اختيار ملف' : 'No file chosen';
      }
      
      setTimeout(() => {
        feedback.style.display = 'none';
      }, 5000);
    } else {
      throw new Error('Form submission failed');
    }
  })
  .catch(error => {
    btn.disabled = false;
    btn.querySelector('span').textContent = originalText;
    feedback.style.display = 'block';
    feedback.style.color = '#ff4d4d';
    feedback.innerHTML = currentLang === 'ar' 
      ? 'عذراً، حدث خطأ أثناء الإرسال. يرجى المحاولة مرة أخرى.' 
      : 'Sorry, an error occurred during submission. Please try again.';
  });
}

/* ══════════════════════════════
   STATS COUNTER ANIMATION
══════════════════════════════ */
function animateCounter(el, target, suffix) {
  let current = 0;
  const step = Math.ceil(target / 40);
  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = current + suffix;
    if (current >= target) clearInterval(timer);
  }, 40);
}

const statsObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const statNums = entry.target.querySelectorAll('.stat-num');
      statNums.forEach(el => {
        const targetValue = parseInt(el.getAttribute('data-target')) || 0;
        animateCounter(el, targetValue, '+');
      });
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.hero-stats, .stats-trigger').forEach(trigger => {
  statsObserver.observe(trigger);
});

/* ══════════════════════════════
   LOGO STAMP ANIMATION
══════════════════════════════ */
function initLogoStampAnimation() {
  const stamp = document.querySelector('.anim-stamp-trigger');
  if (!stamp) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          stamp.classList.add('stamp-hit');
        }, 300);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  observer.observe(stamp);
}

/* ══════════════════════════════
   FILE INPUT LABEL
══════════════════════════════ */
function initFileInput() {
  const fileInput = document.getElementById('userFile');
  const fileNameLabel = document.getElementById('fileNameLabel');
  
  if (fileInput && fileNameLabel) {
    fileInput.addEventListener('change', (e) => {
      const name = e.target.files.length > 0 ? e.target.files[0].name : (currentLang === 'ar' ? 'لم يتم اختيار ملف' : 'No file chosen');
      fileNameLabel.textContent = name;
    });
  }
}

/* ══════════════════════════════
   FLOATING WHATSAPP BUTTON
══════════════════════════════ */
function initWhatsApp() {
  if (document.querySelector('.whatsapp-float')) return;

  const path = window.location.pathname;
  let brand = "";
  if (path.includes('obo.html')) brand = "OBO";
  else if (path.includes('extell.html')) brand = "Extell";
  else if (path.includes('vmr.html')) brand = "VMR";
  else if (path.includes('barqan.html')) brand = "Barqan";

  const message = brand 
    ? `Can I get ${brand} catalog and price list?`
    : "Hello Alzab Algharbiyah, I have an inquiry regarding your services.";
    
  const encodedMsg = encodeURIComponent(message);
  const waUrl = `https://wa.me/966563585190?text=${encodedMsg}`;
  
  const waBtn = document.createElement('a');
  waBtn.href = waUrl;
  waBtn.className = 'whatsapp-float';
  waBtn.target = '_blank';
  waBtn.rel = 'noopener noreferrer';
  waBtn.setAttribute('aria-label', 'Chat on WhatsApp');
  
  const svgIcon = `
    <svg viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg">
      <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-5.5-2.8-23.2-8.5-44.2-27.1-16.4-14.6-27.4-32.7-30.6-38.1-3.2-5.5-.3-8.5 2.4-11.2 2.5-2.4 5.5-6.4 8.3-9.6 2.8-3.2 3.7-5.5 5.5-9.3 1.9-3.7 1-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 13.2 5.8 23.5 9.2 31.6 11.8 13.3 4.2 25.4 3.6 35 2.2 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
    </svg>
  `;

  if (brand) {
    const enText = `Can I get ${brand} catalog and price list?`;
    const arText = `هل يمكنني الحصول على كتالوج وقائمة أسعار ${brand}؟`;
    const labelText = currentLang === 'ar' ? arText : enText;
    
    waBtn.innerHTML = `
      <span class="wa-float-label" data-en="${enText}" data-ar="${arText}">${labelText}</span>
      ${svgIcon}
    `;
  } else {
    waBtn.innerHTML = svgIcon;
  }
  
  getOrCreateFloatingContainer().appendChild(waBtn);
}

function getOrCreateFloatingContainer() {
  let container = document.querySelector('.floating-controls-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'floating-controls-container';
    document.body.appendChild(container);
  }
  return container;
}
