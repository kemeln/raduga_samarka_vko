/* ============================================
   RADUGA RESORT - Main JavaScript
   ============================================ */

const WHATSAPP_NUMBER = '77713426072';
let currentLang = 'ru';
let translations = {};
let questionnaireCompleted = false;

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
  initLanguage();
  initHeroCarousel();
  initScrollEffects();
  initMobileMenu();
  initIntersectionObserver();
});

// ==================== LANGUAGE SYSTEM ====================
async function initLanguage() {
  const savedLang = localStorage.getItem('raduga-lang') || 'ru';
  const urlParams = new URLSearchParams(window.location.search);
  const urlLang = urlParams.get('lang');
  currentLang = urlLang || savedLang;

  // Load all translations
  try {
    const [ru, kz, en] = await Promise.all([
      fetch('i18n/ru.json').then(r => r.json()),
      fetch('i18n/kz.json').then(r => r.json()),
      fetch('i18n/en.json').then(r => r.json())
    ]);
    translations = { ru, kz, en };
  } catch (e) {
    console.warn('Translation files not loaded, using defaults');
    translations = { ru: {}, kz: {}, en: {} };
  }

  setLanguage(currentLang);
}

function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('raduga-lang', lang);
  document.documentElement.lang = lang === 'kz' ? 'kk' : lang;

  // Update active button
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });

  // Apply translations
  const t = translations[lang] || {};
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key]) {
      el.textContent = t[key];
    }
  });

  // Apply placeholder translations
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (t[key]) {
      el.placeholder = t[key];
    }
  });
}

// Language button click handlers
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('lang-btn')) {
    setLanguage(e.target.dataset.lang);
  }
});

function t(key) {
  return (translations[currentLang] && translations[currentLang][key]) || key;
}

// ==================== HERO CAROUSEL ====================
let heroIndex = 0;
let heroInterval;

function initHeroCarousel() {
  const slides = document.querySelectorAll('.hero-slide');
  const indicators = document.getElementById('heroIndicators');

  if (!slides.length || !indicators) return;

  // Create indicators
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'hero-indicator' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => goToSlide(i));
    indicators.appendChild(dot);
  });

  heroInterval = setInterval(nextSlide, 5000);
}

function nextSlide() {
  const slides = document.querySelectorAll('.hero-slide');
  goToSlide((heroIndex + 1) % slides.length);
}

function goToSlide(index) {
  const slides = document.querySelectorAll('.hero-slide');
  const indicators = document.querySelectorAll('.hero-indicator');

  slides[heroIndex].classList.remove('active');
  indicators[heroIndex].classList.remove('active');

  heroIndex = index;

  slides[heroIndex].classList.add('active');
  indicators[heroIndex].classList.add('active');

  // Reset timer
  clearInterval(heroInterval);
  heroInterval = setInterval(nextSlide, 5000);
}

// ==================== SCROLL EFFECTS ====================
function initScrollEffects() {
  const header = document.getElementById('header');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === 'javascript:void(0)') return;

      e.preventDefault();
      const target = document.querySelector(targetId);
      if (target) {
        const headerHeight = document.getElementById('header').offsetHeight;
        const top = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        window.scrollTo({ top, behavior: 'smooth' });

        // Close mobile menu if open
        const nav = document.getElementById('nav');
        const toggle = document.getElementById('menuToggle');
        if (nav.classList.contains('active')) {
          nav.classList.remove('active');
          toggle.classList.remove('active');
          document.body.style.overflow = '';
        }
      }
    });
  });
}

// ==================== MOBILE MENU ====================
function initMobileMenu() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('nav');

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    nav.classList.toggle('active');
    document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
  });
}

// ==================== INTERSECTION OBSERVER (Animations) ====================
function initIntersectionObserver() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
}

// ==================== ROOM MODALS ====================
function openRoomModal(type) {
  const modal = document.getElementById('modal-' + type);
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeModal(type) {
  const modal = document.getElementById('modal-' + type);
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

function changeModalImg(type, thumb) {
  const mainImg = document.getElementById(type + '-main-img');
  if (mainImg) {
    mainImg.src = thumb.src;
    // Update active thumbnail
    thumb.closest('.modal-gallery').querySelectorAll('img').forEach(img => {
      img.classList.remove('active');
    });
    thumb.classList.add('active');
  }
}

// Close modal on overlay click
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-overlay')) {
    e.target.classList.remove('active');
    document.body.style.overflow = '';
  }
});

// Close modal on Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.active').forEach(modal => {
      modal.classList.remove('active');
    });
    closeLightbox();
    closeWaPrompt();
    document.body.style.overflow = '';
  }
});

// ==================== QUESTIONNAIRE ====================
function nextStep(step) {
  // Validate current step
  if (step === 2) {
    const name = document.getElementById('q-name').value.trim();
    const phone = document.getElementById('q-phone').value.trim();
    if (!name || !phone) {
      alert(currentLang === 'en' ? 'Please fill in your name and phone number' :
            currentLang === 'kz' ? 'Атыңызды және телефон нөміріңізді толтырыңыз' :
            'Пожалуйста, заполните имя и телефон');
      return;
    }
  }

  showStep(step);
}

function prevStep(step) {
  showStep(step);
}

function showStep(step) {
  document.querySelectorAll('.form-step').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.form-progress-step').forEach(s => {
    s.classList.remove('active');
    s.classList.remove('completed');
    const sStep = parseInt(s.dataset.step);
    if (sStep < step) s.classList.add('completed');
    if (sStep === step) s.classList.add('active');
  });

  const targetStep = document.querySelector(`.form-step[data-step="${step}"]`);
  if (targetStep) targetStep.classList.add('active');
}

function stepValue(id, delta) {
  const input = document.getElementById(id);
  let val = parseInt(input.value) + delta;
  if (val < parseInt(input.min)) val = parseInt(input.min);
  if (val > parseInt(input.max)) val = parseInt(input.max);
  input.value = val;
}

function submitQuestionnaire() {
  const name = document.getElementById('q-name').value.trim();
  const phone = document.getElementById('q-phone').value.trim();
  const dateFrom = document.getElementById('q-date-from').value;
  const dateTo = document.getElementById('q-date-to').value;
  const adults = document.getElementById('q-adults').value;
  const children = document.getElementById('q-children').value;
  const rooms = document.getElementById('q-rooms').value;
  const roomType = document.querySelector('input[name="room-type"]:checked');
  const special = document.getElementById('q-special').value.trim();

  if (!name || !phone) {
    showStep(1);
    alert(currentLang === 'en' ? 'Please fill in your name and phone number' :
          currentLang === 'kz' ? 'Атыңызды және телефон нөміріңізді толтырыңыз' :
          'Пожалуйста, заполните имя и телефон');
    return;
  }

  let roomTypeName = roomType ? roomType.value : '';
  if (roomTypeName === 'undecided') {
    roomTypeName = currentLang === 'en' ? "Haven't decided" :
                   currentLang === 'kz' ? 'Әлі шешкен жоқпын' :
                   'Ещё не решил(а)';
  }

  // Build message in current language
  let message = '';

  if (currentLang === 'en') {
    message = `Hello! I'd like to book at Raduga Resort.\n\n`;
    message += `Name: ${name}\n`;
    message += `Phone: ${phone}\n`;
    if (dateFrom) message += `Check-in: ${dateFrom}\n`;
    if (dateTo) message += `Check-out: ${dateTo}\n`;
    message += `Adults: ${adults}\n`;
    message += `Children: ${children}\n`;
    message += `Houses needed: ${rooms}\n`;
    message += `House type: ${roomTypeName}\n`;
    if (special) message += `Special requests: ${special}\n`;
  } else if (currentLang === 'kz') {
    message = `Сәлеметсіз бе! Мен «Радуга» демалыс базасына брондау жасағым келеді.\n\n`;
    message += `Аты-жөні: ${name}\n`;
    message += `Телефон: ${phone}\n`;
    if (dateFrom) message += `Келу күні: ${dateFrom}\n`;
    if (dateTo) message += `Кету күні: ${dateTo}\n`;
    message += `Ересектер: ${adults}\n`;
    message += `Балалар: ${children}\n`;
    message += `Үй саны: ${rooms}\n`;
    message += `Үй түрі: ${roomTypeName}\n`;
    if (special) message += `Ерекше тілектер: ${special}\n`;
  } else {
    message = `Здравствуйте! Хочу забронировать дом на базе отдыха «Радуга».\n\n`;
    message += `Имя: ${name}\n`;
    message += `Телефон: ${phone}\n`;
    if (dateFrom) message += `Дата заезда: ${dateFrom}\n`;
    if (dateTo) message += `Дата выезда: ${dateTo}\n`;
    message += `Взрослых: ${adults}\n`;
    message += `Детей: ${children}\n`;
    message += `Количество домов: ${rooms}\n`;
    message += `Тип дома: ${roomTypeName}\n`;
    if (special) message += `Особые пожелания: ${special}\n`;
  }

  questionnaireCompleted = true;
  const encoded = encodeURIComponent(message);
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`, '_blank');
}

// ==================== WHATSAPP INTEGRATION ====================
function handleWhatsAppClick() {
  if (questionnaireCompleted) {
    openWhatsAppDirect();
  } else {
    showWaPrompt();
  }
}

function showWaPrompt() {
  document.getElementById('waPrompt').classList.add('active');
}

function closeWaPrompt() {
  document.getElementById('waPrompt').classList.remove('active');
}

function openWhatsAppDirect() {
  closeWaPrompt();
  let greeting = '';
  if (currentLang === 'en') {
    greeting = 'Hello! I would like to inquire about staying at Raduga Resort.';
  } else if (currentLang === 'kz') {
    greeting = 'Сәлеметсіз бе! Мен «Радуга» демалыс базасы туралы білгім келеді.';
  } else {
    greeting = 'Здравствуйте! Хочу узнать об отдыхе на базе «Радуга».';
  }
  const encoded = encodeURIComponent(greeting);
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`, '_blank');
}

// Close WhatsApp prompt on overlay click
document.addEventListener('click', (e) => {
  if (e.target.id === 'waPrompt') {
    closeWaPrompt();
  }
});

// ==================== LIGHTBOX ====================
function openLightbox(src) {
  const lightbox = document.getElementById('lightbox');
  const img = document.getElementById('lightboxImg');
  img.src = src;
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  const lightbox = document.getElementById('lightbox');
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
}

document.addEventListener('click', (e) => {
  if (e.target.id === 'lightbox') {
    closeLightbox();
  }
});

// ==================== RULES TOGGLE ====================
function toggleRules() {
  const content = document.getElementById('rulesContent');
  content.classList.toggle('active');
}
